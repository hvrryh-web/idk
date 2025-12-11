# Copilot Instructions for WuXuxian TTRPG Webapp

## Project Overview
- **Stack:** FastAPI + SQLAlchemy backend (`backend/`), Vite + React + TypeScript frontend (`frontend/`), PostgreSQL via Docker Compose (`infra/`).
- **Design Docs:** See `docs/wuxiaxian-reference/` for system mechanics, architecture analysis, and implementation roadmap.
- **ASCII Art:** Separate Node.js backend for ASCII art generation (see `ASCII_COMPONENT_README.md`).

## Architecture & Service Boundaries
- **Backend:**
  - API contract: `backend/openapi.yaml`
  - DB schema: `backend/schema.sql`
  - Config: `app/core/config.py`
  - DB session: `app/db/session.py`
  - Models: `app/models/`
  - Character CRUD: `app/api/routes/characters.py` (mounted at `/api/v1`)
- **Frontend:**
  - Entry: `frontend/src/App.tsx`, `frontend/src/main.tsx`
  - Components: `frontend/src/components/`
  - API calls: `http://localhost:8000/api/v1`
- **Assets:**
  - Naming: `[category]-[name]-[variant]_[scale].[ext]` (see `frontend/public/assets/README.md`)

## Developer Workflows
- **Start Postgres:**
  `cd infra && docker compose up -d`
- **Apply DB Schema:**
  `psql postgresql://postgres:postgres@localhost:5432/wuxuxian -f ../backend/schema.sql`
- **Backend:**
  `cd backend && pip install -r requirements.txt && python -m uvicorn app.main:app --reload --port 8000`
- **Frontend:**
  `cd frontend && npm install && npm run dev`
- **Testing:**
  - Backend: `cd backend && pytest tests/`
  - Frontend: `cd frontend && npm test`
- **Linting:**
  - Python: `ruff check .`
  - JS/TS: `npm run lint`

## Patterns & Conventions
- **Patch Notes:**
  - Use `docs/patch-notes/` with `PATCH-YYYYMMDD-NNN` format and index table.
- **Masterdoc Segmentation:**
  - See `masterdocs/README.md` for chunking rules and metadata.
- **Custom Agents:**
  - Reference agent YAMLs in `.github/agents/` for specialized tasks (game mechanics, backend, frontend, full-stack).
  - Mention agent by name in Copilot Chat for context-aware help.

## Integration Points
- **Frontend ↔ Backend:**
  - Use REST API at `/api/v1`
  - Ensure type consistency and CORS config
- **Database:**
  - Schema changes require updates to both `schema.sql` and SQLAlchemy models

## Key References
- `README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `.github/agents/README.md`
- For design intent and implementation gaps: `docs/wuxiaxian-reference/REPO_ARCHITECTURE_ANALYSIS.md`
- For combat logic: `backend/app/simulation/`
- For asset conventions: `frontend/public/assets/README.md`
