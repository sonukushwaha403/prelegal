import json
import re
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from litellm import completion
from jose import JWTError
from auth import decode_token

router = APIRouter()

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

PROJECT_ROOT = Path(__file__).parent.parent.parent
CATALOG_PATH = PROJECT_ROOT / "catalog.json"
TEMPLATES_DIR = PROJECT_ROOT / "templates"

FIELD_PATTERN = re.compile(
    r'<span class="(?:coverpage|keyterms|orderform|businessterms|sow)_link"[^>]*>([^<]+)</span>'
)

SUPPORTED_DOCS = ", ".join(
    item["name"] for item in json.loads(CATALOG_PATH.read_text())
)


def extract_fields(template_content: str) -> list[str]:
    """Extract unique field names from span-link placeholders, filtering possessives and plurals."""
    raw = set(FIELD_PATTERN.findall(template_content))
    # Filter out possessive forms (Customer's) and plurals (Periods) if base exists
    base_fields = set()
    apos_s = chr(0x2019) + "s"  # right single quotation mark + s
    for f in raw:
        if f.endswith(apos_s) or f.endswith("'s"):
            continue  # skip possessives
        base_fields.add(f)
    # Remove plurals where singular exists
    result = set()
    for f in base_fields:
        if f.endswith('s') and f[:-1] in base_fields:
            continue  # skip plural if singular exists
        result.add(f)
    return sorted(result)


def read_template(filename: str) -> str:
    """Read a template file, raising 404 if not found."""
    path = PROJECT_ROOT / filename
    if not path.exists() or not str(path).startswith(str(TEMPLATES_DIR)):
        raise HTTPException(status_code=404, detail="Template not found")
    return path.read_text(encoding="utf-8")


def build_system_prompt(doc_name: str, fields: list[str], current_fields: dict) -> str:
    field_list = "\n".join(f"- {f}" for f in fields)
    filled = {k: v for k, v in current_fields.items() if v}
    context = f"\nCurrently filled fields: {filled}" if filled else "\nNo fields filled yet."

    return f"""You are a legal document assistant helping users fill out a "{doc_name}".

Conduct a friendly, natural conversation to collect all required information. Ask about 1-2 fields at a time. When the user provides information, extract it into the relevant fields using the exact field names below.

Always end your reply with a follow-up question about the next unfilled field(s), unless all fields are complete.

Fields to collect:
{field_list}

Only set a field in field_updates when the user has clearly provided that information. Use the exact field name as the key.

If the user asks for a document type we don't support, explain that and suggest the closest match from our supported types: {SUPPORTED_DOCS}
{context}"""


class ChatMessage(BaseModel):
    role: str
    content: str


class AIResponse(BaseModel):
    reply: str
    field_updates: dict[str, str]


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    template_filename: str
    current_fields: dict[str, str] = {}


class ChatResponse(BaseModel):
    reply: str
    field_updates: dict[str, str]


def get_current_user_id(authorization: str = Header(default=None)) -> int:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization[7:]
    try:
        payload = decode_token(token)
        sub = payload.get("sub")
        if not sub:
            raise HTTPException(status_code=401, detail="Invalid token")
        return int(sub)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.get("/catalog")
def get_catalog():
    """Return the list of supported document types."""
    return json.loads(CATALOG_PATH.read_text())


@router.get("/template")
def get_template(filename: str):
    """Return the raw markdown content of a template."""
    content = read_template(filename)
    fields = extract_fields(content)
    # Look up the document name from the catalog
    catalog = json.loads(CATALOG_PATH.read_text())
    doc_name = filename
    for item in catalog:
        if item["filename"] == filename:
            doc_name = item["name"]
            break
    return {"content": content, "fields": fields, "name": doc_name}


@router.post("/message", response_model=ChatResponse)
def chat_message(req: ChatRequest, _user_id: int = Depends(get_current_user_id)):
    """Chat with the AI to fill in document fields."""
    template_content = read_template(req.template_filename)
    fields = extract_fields(template_content)

    # Look up document name
    catalog = json.loads(CATALOG_PATH.read_text())
    doc_name = req.template_filename
    for item in catalog:
        if item["filename"] == req.template_filename:
            doc_name = item["name"]
            break

    system_prompt = build_system_prompt(doc_name, fields, req.current_fields)

    messages = [{"role": "system", "content": system_prompt}]
    messages += [{"role": m.role, "content": m.content} for m in req.messages]

    response = completion(
        model=MODEL,
        messages=messages,
        response_format=AIResponse,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
    )

    result = AIResponse.model_validate_json(response.choices[0].message.content)
    # Only return non-empty updates
    updates = {k: v for k, v in result.field_updates.items() if v}

    return ChatResponse(reply=result.reply, field_updates=updates)
