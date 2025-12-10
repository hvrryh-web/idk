# WuXuxian TTRPG webapp scaffold

FastAPI + SQLAlchemy backend, Vite + React + TypeScript frontend, and local Postgres via Docker Compose.

## 📖 Design Documentation

**NEW**: Comprehensive design analysis and implementation roadmap now available!

See **[docs/wuxiaxian-reference/](./docs/wuxiaxian-reference/)** for:
- **Design Intent**: Complete Wuxiaxian system mechanics (SCL, stats, combat, conditions)
- **Current State**: Gap analysis between design and implementation
- **Combat UI**: Complete component breakdown and implementation plan
- **Actionable Improvements**: Prioritized tasks with code examples (19-27 hours to MVP)
- **Quick Start**: [Executive Summary](./docs/wuxiaxian-reference/EXECUTIVE_SUMMARY.md)

## Architecture
- Treat `backend/openapi.yaml` and `backend/schema.sql` as canonical inputs; paste the provided specs verbatim without modifying them.
- Backend: FastAPI application with settings in `app/core/config.py`, DB session management in `app/db/session.py`, and SQLAlchemy models in `app/models/`. Character CRUD lives under `app/api/routes/characters.py` and is mounted at `/api/v1`.
- Frontend: Vite + React + TypeScript in `frontend/`, calling the backend at `http://localhost:8000/api/v1`.
- Infra: Docker Compose in `infra/` to start a local Postgres instance; optionally connect the backend to it via `DATABASE_URL`.
- **Design Docs**: See [WUXUXIANXIA TTRPG/](./WUXUXIANXIA%20TTRPG/) for original design documents and [docs/wuxiaxian-reference/](./docs/wuxiaxian-reference/) for implementation analysis.

## 🚀 LAUNCH ALPHA TEST

Get up and running quickly with the WuXuxian TTRPG alpha test!

### Quick Start

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
   cd backend
   pip install -r requirements.txt
   python -m uvicorn app.main:app --reload --port 8000
   ```

4. **Run the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **🎮 Play the Alpha Test**
   - Open your browser to [http://localhost:5173](http://localhost:5173)
   - Click the big green **"🚀 LAUNCH ALPHA TEST"** button on the Game Room page
   - Explore the multi-page UI:
     - **Character Sheets**: View detailed profiles, cultivation paths, soul cores, and domain sources
     - **Wiki & Help**: Browse the knowledge base with search functionality
     - **SRD Book**: Read the full System Reference Document with rendered/raw toggle
     - **Character Manager**: Create and manage characters, run simulations

### What's Included

The alpha test includes:
- ✅ Multi-page visual novel–style UI with routing
- ✅ Player character sheet system (Profile, Cultivation, Soul Core, Domain Source)
- ✅ Knowledge Wiki with searchable SRD articles
- ✅ Help page with intelligent search
- ✅ SRD book viewer with Markdown rendering toggle
- ✅ Character and simulation management
- ✅ Backend API with FastAPI + SQLAlchemy
- ✅ Full CORS support for local development

## Getting started (Detailed)
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

## Tasks

- Masterdocs segmentation: See [masterdocs/README.md](./masterdocs/README.md) for the task and instructions to split large Masterdoc files into ingestible chunks for indexing and QA systems.

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

## Code Quality

### Linting and Formatting

**Python (Backend):**
```bash
cd backend
source .venv/bin/activate
pip install -r requirements-dev.txt

# Format code
black .
isort .

# Lint code
ruff check .
ruff check . --fix  # Auto-fix issues
```
This launches Postgres on `localhost:5432` with user `postgres`, password `postgres`, and database `wuxuxian`.

**TypeScript (Frontend):**
```bash
cd frontend

# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint
npm run lint:fix  # Auto-fix issues
```

### Pre-commit Hooks

Install pre-commit hooks to automatically format and lint code before commits:
```bash
pip install pre-commit
pre-commit install
```

Now code will be automatically checked and formatted on every commit.

### Continuous Integration

The project uses GitHub Actions for CI/CD. On every push and pull request:
- ✅ Backend tests run with pytest
- ✅ Frontend tests run with vitest
- ✅ Code is linted (Python with Ruff, TypeScript with ESLint)
- ✅ Code formatting is checked (Black, Prettier)
- ✅ Frontend build is verified

See `.github/workflows/ci.yml` for the full CI configuration.

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
The API will be available at `http://localhost:8000`. Health check: `http://localhost:8000/health`.

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
The dev server runs at `http://localhost:5173`.

### 5) See the vertical slice
Open your browser to `http://localhost:5173`. The page loads characters by calling `GET http://localhost:8000/api/v1/characters`. If the list is empty, it will say "No characters yet." Use the "Refresh" button after you add data.

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

## Documentation

For more detailed information, see:
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and design decisions
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute to the project
- **[SECURITY.md](SECURITY.md)** - Security policy and best practices
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

## API Documentation

When the backend is running, interactive API documentation is available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Spec**: http://localhost:8000/openapi.json

The full OpenAPI specification is also available in `backend/openapi.yaml`.

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
