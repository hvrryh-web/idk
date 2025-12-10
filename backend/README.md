# Backend

FastAPI + SQLAlchemy backend implementing the WuXuxian TTRPG API from `openapi.yaml` and `schema.sql`.

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

## Running
```bash
export DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/wuxuxian
uvicorn app.main:app --reload --app-dir backend/app --port 8000
```

Sample request (list characters):
```bash
curl http://localhost:8000/api/v1/characters
```
