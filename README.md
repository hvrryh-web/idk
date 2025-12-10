# idk

Developer environment for the WuXuxian TTRPG API. The project includes a FastAPI backend with Postgres storage and tooling to spin everything up quickly for local exploration.

## Prerequisites
- Docker and Docker Compose
- `make` (for the provided helper commands)

## Quick start
1. Start the stack (builds the backend image and starts Postgres):
   ```bash
   make up
   ```
   The API will be available at http://localhost:8000 and the OpenAPI docs at http://localhost:8000/api/v1/openapi.json.

2. Apply the schema and sample data (use a second terminal while the stack is running):
   ```bash
   make migrate
   make seed
   ```
   The migration applies `backend/schema.sql` (which also enables `pgcrypto` for UUID generation). The seed step loads the sample data from `backend/seed.sql` so you can immediately query characters, techniques, and cards.

3. Stream logs from the running services:
   ```bash
   make logs
   ```

4. Stop and clean up containers/volumes:
   ```bash
   make down
   ```

## Service details
- **Backend**: FastAPI served via Uvicorn on port 8000. It reloads automatically when editing code under `backend/` because the directory is mounted into the container.
- **Database**: Postgres on port 5432 with credentials `postgres/postgres` and database `wuxuxian`.
- **Docker Compose**: see `docker-compose.yml` for service definitions. Schema and seed SQL files are mounted into the database container and can be re-run with the `make migrate` / `make seed` targets.

## Working without Docker
If you prefer running locally:
1. Create a virtual environment and install dependencies:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Ensure Postgres is running locally and apply the schema/seed files:
   ```bash
   psql postgresql://postgres:postgres@localhost:5432/wuxuxian -f schema.sql
   psql postgresql://postgres:postgres@localhost:5432/wuxuxian -f seed.sql
   ```
3. Start the dev server:
   ```bash
   DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/wuxuxian \
   uvicorn app.main:app --reload --app-dir backend/app --port 8000
   ```

With the sample data loaded, try listing characters:
```bash
curl http://localhost:8000/api/v1/characters
```
