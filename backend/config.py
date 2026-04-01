import json
from pathlib import Path

CATALOG_PATH = Path(__file__).parent.parent / "catalog.json"
TEMPLATES_DIR = Path(__file__).parent.parent / "templates"


def load_catalog() -> list[dict]:
    return json.loads(CATALOG_PATH.read_text())


def read_template(doc_filename: str) -> str:
    """Read template content, raising ValueError if path escapes TEMPLATES_DIR."""
    path = (TEMPLATES_DIR / doc_filename).resolve()
    if not path.is_relative_to(TEMPLATES_DIR.resolve()):
        raise ValueError("Invalid filename")
    return path.read_text(encoding="utf-8")
