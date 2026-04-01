import re
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from litellm import completion
from jose import JWTError
from auth import decode_token
from config import load_catalog, read_template

router = APIRouter()

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}


def extract_fields(content: str) -> list[str]:
    """Extract unique fillable field names from a template."""
    # Span-based: <span class="..._link">FieldName</span>
    fields = []
    seen: set[str] = set()
    for match in re.finditer(r'<span class="[^"]*_link">([^<]+)</span>', content):
        name = match.group(1).strip()
        if name not in seen:
            seen.add(name)
            fields.append(name)
    # Cover-page style: ### Section headings define the fields
    if not fields:
        for match in re.finditer(r'^###\s+(.+)$', content, re.MULTILINE):
            name = match.group(1).strip()
            if name not in seen:
                seen.add(name)
                fields.append(name)
        # Also grab the signature table row labels
        for match in re.finditer(r'\|\s*(Print Name|Title|Company|Notice Address|Date)\s*\|', content):
            for party in ("Party 1 - " + match.group(1), "Party 2 - " + match.group(1)):
                if party not in seen:
                    seen.add(party)
                    fields.append(party)
    return fields


def build_system_prompt(doc_name: str, doc_description: str, fields: list[str], catalog: list[dict]) -> str:
    supported = "\n".join(f"- {e['name']}" for e in catalog)
    field_list = "\n".join(f"- {f}" for f in fields)
    return f"""You are a legal document assistant helping users fill out a {doc_name}.

{doc_description}

Your job is to have a friendly, natural conversation to collect all required information. Ask about 1-2 fields at a time in a natural, conversational way. When the user provides information, extract it into the relevant fields.

Fields to collect:
{field_list}

IMPORTANT RULES:
1. Always end your reply with a question to collect the next missing piece of information. Never end with a statement that requires no user response.
2. Only update a field in field_updates when the user has clearly provided that value.
3. If the user asks for help with a document type not listed below, explain politely that we don't support it yet and suggest the most similar document you can help with.
4. Keep responses concise and conversational.

Supported document types:
{supported}"""


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    doc_filename: str
    messages: list[ChatMessage]
    current_fields: dict[str, str] = {}


class AIResponse(BaseModel):
    reply: str
    field_updates: dict[str, str] = {}


class ChatResponse(BaseModel):
    reply: str
    field_updates: dict[str, str]


def get_current_user_id(authorization: Optional[str] = Header(default=None)) -> int:
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


@router.post("", response_model=ChatResponse)
def chat(req: ChatRequest, _user_id: int = Depends(get_current_user_id)):
    """Generic chat endpoint for any supported document type."""
    catalog = load_catalog()
    entry = next((e for e in catalog if Path(e["filename"]).name == req.doc_filename), None)
    if not entry:
        raise HTTPException(status_code=404, detail="Unknown document type")

    try:
        content = read_template(req.doc_filename)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid filename")
    fields = extract_fields(content)

    filled = {k: v for k, v in req.current_fields.items() if v}
    context = f"\nCurrently filled fields: {filled}" if filled else "\nNo fields filled yet."
    system_prompt = build_system_prompt(entry["name"], entry["description"], fields, catalog) + context

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
    return ChatResponse(reply=result.reply, field_updates=result.field_updates)
