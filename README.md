# WuXuxian TTRPG webapp scaffold

FastAPI + SQLAlchemy backend, Vite + React + TypeScript frontend, and local Postgres via Docker Compose.

## 🚀 Quick Start - Test Me!

**Want to quickly test the backend?** Run this from the `backend/` directory:

```bash
cd backend
./test_me.sh
```

The server will start at http://localhost:8000 with:
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Characters API**: http://localhost:8000/api/v1/characters

## Architecture
- Treat `backend/openapi.yaml` and `backend/schema.sql` as canonical inputs; paste the provided specs verbatim without modifying them.
- Backend: FastAPI application with settings in `app/core/config.py`, DB session management in `app/db/session.py`, and SQLAlchemy models in `app/models/`. Character CRUD lives under `app/api/routes/characters.py` and is mounted at `/api/v1`.
- Frontend: Vite + React + TypeScript in `frontend/`, calling the backend at `http://localhost:8000/api/v1`.
- Infra: Docker Compose in `infra/` to start a local Postgres instance; optionally connect the backend to it via `DATABASE_URL`.

## Getting started
1. **Start Postgres**
   ```bash
   cd infra
   docker-compose up -d
   ```

2. **Apply the schema** (after pasting the real DDL into `backend/schema.sql`):
   ```bash
   psql postgresql://postgres:postgres@localhost:5432/wuxuxian -f ../backend/schema.sql
   ```

3. **Run the backend**
   ```bash
   cd ../backend
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

4. **Run the frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

5. **Open the app**
   - Frontend: http://localhost:5173
   - API: http://localhost:8000 (characters at `/api/v1/characters`)

## Repository layout
```
wuxuxian-ttrpg-webapp/
  backend/
    app/
      api/
        deps.py
        routes/
          characters.py
      core/
        config.py
      db/
        session.py
      models/
        base.py
        characters.py
    openapi.yaml
    schema.sql
    requirements.txt
  frontend/
    src/
      App.tsx
      main.tsx
    package.json
    vite.config.ts
  infra/
    docker-compose.yml
  README.md
```
