# WuXuxian stack

Mono-repo scaffolding for the WuXuxian TTRPG tools: FastAPI + SQLAlchemy backend, Vite + React + TypeScript frontend, and optional local Postgres via Docker Compose.

## Architecture & plan (concise)
- Treat `backend/openapi.yaml` and `backend/schema.sql` as canonical; paste in the provided specs without modifying them. Use `schema.sql` to bootstrap the database.
- Backend settings live in `app/core/config.py` with an environment-driven `DATABASE_URL` defaulting to local Postgres.
- SQLAlchemy engine/session in `app/db/session.py` with a shared declarative `Base` in `app/models/base.py`.
- Core models map to the `characters` and `techniques` tables with minimal enums aligned to the schema placeholder.
- Minimal CRUD routes for characters under `/api/v1` using simple Pydantic schemas.
- FastAPI app (`app/main.py`) includes CORS for Vite (`http://localhost:5173`) and a `/health` endpoint.
- Frontend calls `GET /api/v1/characters` on load, displays the list, and offers a refresh button.
- Optional infra via `infra/docker-compose.yml` to run Postgres locally; apply `schema.sql` manually.
- Dependencies stay minimal: FastAPI, Uvicorn, SQLAlchemy, psycopg2-binary, python-dotenv (optional).

## Quick start
Start Postgres (Docker):

```bash
cd infra
docker-compose up -d
```

Apply schema:

```bash
psql postgresql://postgres:postgres@localhost:5432/wuxuxian -f backend/schema.sql
```

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open the app: http://localhost:5173 (API at http://localhost:8000).
