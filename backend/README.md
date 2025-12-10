# Backend

FastAPI + SQLAlchemy backend implementing the WuXuxian TTRPG API from `openapi.yaml` and `schema.sql`.

Routes implemented:
- Characters and techniques
- Fate cards (death/body/seed)
- Effect modules and boss templates
- Simulation configs/runs and a simple power-builder helper

## Prerequisites
- Python 3.12
- Postgres (with `pgcrypto` or `uuid-ossp` to support `gen_random_uuid()`)

## Setup
```bash
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic
```

Apply the schema to your database:
```bash
psql $DATABASE_URL -f schema.sql
```

## Running (local)
```bash
export DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/wuxuxian
uvicorn app.main:app --reload --app-dir backend/app --port 8000
```

## Running with Docker Compose

From the repo root:

```bash
docker-compose up --build
```

The backend will start on port 8000 with Postgres already configured via the Compose file.

Sample request (list characters):
```bash
curl http://localhost:8000/api/v1/characters
```
