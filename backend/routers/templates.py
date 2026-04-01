from pathlib import Path
from fastapi import APIRouter, HTTPException
from config import load_catalog, read_template

router = APIRouter()


@router.get("")
def get_catalog():
    return load_catalog()


@router.get("/{doc_filename}")
def get_template(doc_filename: str):
    catalog = load_catalog()
    entry = next((e for e in catalog if Path(e["filename"]).name == doc_filename), None)
    if not entry:
        raise HTTPException(status_code=404, detail="Template not found")
    try:
        content = read_template(doc_filename)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid filename")
    return {"content": content, "name": entry["name"], "description": entry["description"]}
