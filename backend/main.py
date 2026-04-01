from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from database import init_db
import models  # noqa: F401 - registers ORM models with Base before init_db()
from routers.users import router as users_router

app = FastAPI(title="Prelegal API")

init_db()

app.include_router(users_router, prefix="/api/auth", tags=["auth"])

# Serve the statically-built Next.js frontend
frontend_dir = Path(__file__).parent / "static"
if frontend_dir.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dir), html=True), name="frontend")
