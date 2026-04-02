# Stage 1: Build Next.js frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Python backend
FROM python:3.11-slim
WORKDIR /app/backend

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy backend source and install dependencies
COPY backend/ ./
RUN uv sync --no-dev --no-install-project

# Copy built frontend static files
COPY --from=frontend-builder /app/out ./static/

# Copy templates and catalog (needed by chat endpoint)
COPY catalog.json /app/catalog.json
COPY templates/ /app/templates/

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
