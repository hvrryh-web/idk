# WuXuxian TTRPG webapp scaffold

FastAPI + SQLAlchemy backend, Vite + React + TypeScript frontend, and local Postgres via Docker Compose.

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

## Testing

Automated tests are available for both backend and frontend components. Use the provided scripts to run tests easily.

### Quick Start - Run All Tests
```bash
# Start and run all tests
./start-tests.sh

# Stop any running test processes and clean up
./stop-tests.sh
```

### Backend Tests
The backend uses **pytest** for testing. Tests cover API endpoints, database operations, and business logic.

**Run backend tests manually:**
```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
pytest tests/ -v
```

**Test files:**
- `backend/tests/test_main.py` - Tests for main application endpoints (health check)
- `backend/tests/test_characters.py` - Tests for character CRUD operations

### Frontend Tests
The frontend uses **vitest** and **React Testing Library** for testing.

**Run frontend tests manually:**
```bash
cd frontend
npm install
npm test          # Run tests once
npm run test:watch # Run tests in watch mode
```

**Test files:**
- `frontend/src/App.test.tsx` - Tests for the main App component

### What's Tested
- ✅ Backend health check endpoint
- ✅ Character listing (empty and with data)
- ✅ Character creation
- ✅ Character retrieval by ID
- ✅ Error handling (404, server errors)
- ✅ Frontend component rendering
- ✅ Frontend API integration
- ✅ User interactions (refresh button)

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
