import os
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from litellm import completion
from jose import JWTError
from auth import decode_token

router = APIRouter()

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

SYSTEM_PROMPT = """You are a legal document assistant helping users fill out a Mutual Non-Disclosure Agreement (MNDA).

Conduct a friendly, natural conversation to collect all required information. Ask about 1-2 fields at a time. When the user provides information, extract it into the relevant fields.

Fields to collect:
- party1Company: Party 1's company name
- party1Name: Party 1's signatory full name
- party1Title: Party 1's signatory title (e.g. CEO)
- party1Address: Party 1's notice address (email or postal)
- party2Company: Party 2's company name
- party2Name: Party 2's signatory full name
- party2Title: Party 2's signatory title
- party2Address: Party 2's notice address (email or postal)
- purpose: The purpose for which confidential information may be used
- effectiveDate: Agreement effective date in YYYY-MM-DD format
- mndaTermType: "expires" if it has a fixed term, "continues" if it continues until terminated
- mndaTermYears: Number of years as a string (only when mndaTermType is "expires")
- confidentialityType: "years" if confidentiality lasts N years, "perpetuity" if it lasts forever
- confidentialityYears: Number of years as a string (only when confidentialityType is "years")
- governingLaw: Governing state (e.g. "Delaware")
- jurisdiction: Courts for disputes (e.g. "courts located in New Castle, DE")
- modifications: Any modifications to standard terms (optional, can be empty string)

Current field values will be provided. Focus on empty fields. Only set a field when the user has clearly stated that information. Return null for fields not yet known."""


class ChatMessage(BaseModel):
    role: str
    content: str


class CurrentFields(BaseModel):
    party1Company: str = ""
    party1Name: str = ""
    party1Title: str = ""
    party1Address: str = ""
    party2Company: str = ""
    party2Name: str = ""
    party2Title: str = ""
    party2Address: str = ""
    purpose: str = ""
    effectiveDate: str = ""
    mndaTermType: str = "expires"
    mndaTermYears: str = "1"
    confidentialityType: str = "years"
    confidentialityYears: str = "1"
    governingLaw: str = ""
    jurisdiction: str = ""
    modifications: str = ""


class FieldUpdates(BaseModel):
    party1Company: Optional[str] = None
    party1Name: Optional[str] = None
    party1Title: Optional[str] = None
    party1Address: Optional[str] = None
    party2Company: Optional[str] = None
    party2Name: Optional[str] = None
    party2Title: Optional[str] = None
    party2Address: Optional[str] = None
    purpose: Optional[str] = None
    effectiveDate: Optional[str] = None
    mndaTermType: Optional[str] = None
    mndaTermYears: Optional[str] = None
    confidentialityType: Optional[str] = None
    confidentialityYears: Optional[str] = None
    governingLaw: Optional[str] = None
    jurisdiction: Optional[str] = None
    modifications: Optional[str] = None


class AIResponse(BaseModel):
    reply: str
    field_updates: FieldUpdates


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    current_fields: CurrentFields


class ChatResponse(BaseModel):
    reply: str
    field_updates: dict


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


@router.post("/nda", response_model=ChatResponse)
def chat_nda(req: ChatRequest, _user_id: int = Depends(get_current_user_id)):
    """Chat with the AI to fill in Mutual NDA fields."""
    filled = {k: v for k, v in req.current_fields.model_dump().items() if v}
    context = f"\nCurrently filled fields: {filled}" if filled else "\nNo fields filled yet."

    messages = [{"role": "system", "content": SYSTEM_PROMPT + context}]
    messages += [{"role": m.role, "content": m.content} for m in req.messages]

    response = completion(
        model=MODEL,
        messages=messages,
        response_format=AIResponse,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
    )

    result = AIResponse.model_validate_json(response.choices[0].message.content)
    updates = {k: v for k, v in result.field_updates.model_dump().items() if v is not None}

    return ChatResponse(reply=result.reply, field_updates=updates)
