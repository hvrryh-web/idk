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

## Combat Simulation Engine

The application includes a Monte Carlo combat simulation engine for testing party compositions against boss encounters.

### Features
- **1-Beat Combat**: Simple turn-based combat (PCs act → Boss acts)
- **3-Stage Combat**: Advanced SPD-aware combat with Quick Actions
- **Monte Carlo Trials**: Run thousands of simulations to calculate win rates and statistics
- **Detailed Analytics**: Track damage dealt, AE/Strain curves, and combat metrics

### API Endpoints

**Boss Templates** (`/api/v1/boss-templates`):
- `POST /` - Create a boss template with combat stats
- `GET /` - List all boss templates
- `GET /{id}` - Get a specific boss template

**Simulations** (`/api/v1/simulations`):
- `POST /configs` - Create a simulation configuration
- `GET /configs/{id}` - Get a simulation configuration
- `POST /run/{config_id}` - Run a simulation and store results
- `GET /results/{id}` - Get simulation results
- `GET /configs/{config_id}/results` - List all results for a configuration

### Example Usage

```python
# 1. Create a boss template
POST /api/v1/boss-templates
{
  "name": "Ancient Dragon",
  "thp": 500,
  "ae": 20,
  "ae_reg": 3,
  "dr": 0.3,
  "basic_technique_id": "tech-uuid",
  "spike_technique_id": "tech-uuid"
}

# 2. Create a simulation config
POST /api/v1/simulations/configs
{
  "name": "Test Combat",
  "party_character_ids": ["char-uuid-1", "char-uuid-2"],
  "boss_template_id": "boss-uuid",
  "trials": 1000,
  "max_rounds": 50,
  "random_seed": 42,
  "enable_3_stage": false
}

# 3. Run the simulation
POST /api/v1/simulations/run/{config-uuid}

# Returns:
{
  "win_rate": 0.67,
  "avg_rounds": 12.5,
  "damage_by_character": {...},
  "ae_curves": {...},
  "strain_curves": {...},
  "boss_kills": 670,
  "party_wipes": 280,
  "timeouts": 50
}
```

### Combat Mechanics

**1-Beat Mode** (default):
- Each round: PCs act once, then Boss acts once
- Simple and fast for basic simulations

**3-Stage Mode** (`enable_3_stage: true`):
- Stage 1: Quick Actions for Fast SPD_band actors
- Stage 2: Major Actions for all actors
- Stage 3: Quick Actions for Slow SPD_band actors

**Quick Actions**:
- `GUARD_SHIFT`: Increase Guard value
- `DODGE`: Temporarily boost DR
- `BRACE`: Increase both Guard and DR
- `AE_PULSE`: Gain extra AE
- `STRAIN_VENT`: Reduce Strain
- `STANCE_SWITCH`: Adjust DR (offensive/defensive)
- `COUNTER_PREP`: Prepare for counter-attacks

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
The backend uses **pytest** for testing. Tests cover API endpoints, database operations, simulation engine, and business logic.

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
- `backend/tests/test_simulation.py` - Tests for simulation engine and combat mechanics
- `backend/tests/test_3stage_combat.py` - Tests for 3-stage combat and quick actions

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
- ✅ Combat state management (THP, AE, DR, Strain, Guard)
- ✅ Damage routing (THP, Guard, Strain)
- ✅ Technique selection and execution
- ✅ 1-beat combat rounds
- ✅ Quick actions (all 7 types)
- ✅ 3-stage combat with SPD bands
- ✅ Monte Carlo simulation engine
- ✅ Frontend component rendering
- ✅ Frontend API integration
- ✅ User interactions (refresh button)

**Test Coverage**: 35 tests (29 backend + 6 frontend)

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
