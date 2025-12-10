# Backend

FastAPI + SQLAlchemy backend for the WuXuxian TTRPG data. The API contract and database structure are defined by `openapi.yaml` and `schema.sql` (placeholders here; paste in the provided specs without modifying them).

## 🚀 Quick Start - Test Me!

**Want to quickly test the application?** Just run:

```bash
./test_me.sh
```

This script will:
- Set up the Python environment
- Install dependencies
- Start the FastAPI server on http://localhost:8000
- Open these endpoints:
  - **API Docs**: http://localhost:8000/docs
  - **Health Check**: http://localhost:8000/health
  - **Characters API**: http://localhost:8000/api/v1/characters

## Prerequisites
- Python 3.12
- Postgres running locally (see `infra/docker-compose.yml` for a quick container)

## Setup
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Apply the schema to your database (adjust the connection string as needed):
```bash
psql postgresql://postgres:postgres@localhost:5432/wuxuxian -f schema.sql
```

## Running locally
```bash
export DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/wuxuxian
uvicorn app.main:app --reload --port 8000
```

## Structure
- `app/core/config.py` – environment-driven settings
- `app/db/session.py` – SQLAlchemy engine and session factory
- `app/models/` – declarative models for `characters` and `techniques`
- `app/api/routes/characters.py` – minimal CRUD for characters under `/api/v1`
- `app/main.py` – FastAPI app with CORS and a `/health` endpoint
