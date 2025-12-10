# WuXuxian TTRPG web app (local, beginner-friendly)

This repo scaffolds a local-first stack for the WuXuxian text TTRPG. The **OpenAPI spec (`backend/openapi.yaml`) and Postgres DDL (`backend/schema.sql`) are the canonical definitions** for the API and database—use them as references and do not edit them.

## Architecture (short plan)
- **Backend:** FastAPI + SQLAlchemy (vanilla) with a small config helper in `app/core/config.py`.
- **Database:** Local Postgres (via Docker Compose) using `schema.sql` to create tables/enums. The backend connects via `DATABASE_URL` (defaults to `postgresql+psycopg2://postgres:postgres@localhost:5432/wuxuxian`).
- **API:** Routers live in `app/api/routes`, currently a `characters` vertical slice under the prefix `/api/v1`.
- **Models:** SQLAlchemy models under `app/models` share a declarative `Base` in `app/models/base.py`.
- **Frontend:** React + TypeScript + Vite in `frontend/` calling `http://localhost:8000/api/v1`.
- **Infra:** `infra/docker-compose.yml` runs Postgres locally; volumes keep data between runs.
- **Specs:** `backend/openapi.yaml` describes endpoints; `backend/schema.sql` defines tables/enums. Keep them unchanged.

## Repo layout
```
.
├─ backend/
│  ├─ app/
│  │  ├─ api/routes/characters.py
│  │  ├─ api/deps.py
│  │  ├─ core/config.py
│  │  ├─ db/session.py
│  │  ├─ main.py
│  │  ├─ models/base.py
│  │  └─ models/characters.py
│  ├─ openapi.yaml  (canonical API spec)
│  ├─ schema.sql    (canonical DB DDL)
│  └─ requirements.txt
├─ frontend/
│  ├─ src/App.tsx
│  ├─ src/main.tsx
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ vite.config.ts
├─ infra/docker-compose.yml
└─ README.md
```

## Step-by-step quickstart

### 1) Start Postgres via Docker Compose
```bash
cd infra
docker-compose up -d
```
This launches Postgres on `localhost:5432` with user `postgres`, password `postgres`, and database `wuxuxian`.

### 2) Apply the canonical schema
Open a new terminal (leave Postgres running) and apply the DDL:
```bash
psql postgresql://postgres:postgres@localhost:5432/wuxuxian -f backend/schema.sql
```

### 3) Run the backend API (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`. Health check: `http://localhost:8000/health`.

### 4) Run the frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev -- --host --port 5173
```
The dev server runs at `http://localhost:5173`.

### 5) See the vertical slice
Open your browser to `http://localhost:5173`. The page loads characters by calling `GET http://localhost:8000/api/v1/characters`. If the list is empty, it will say "No characters yet." Use the "Refresh" button after you add data.

### 6) Notes on the specs
- **Do not edit** `backend/openapi.yaml` or `backend/schema.sql`; treat them as source of truth.
- Future backend routes and models should align with the OpenAPI definitions, and migrations should follow the DDL.
