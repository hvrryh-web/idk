# Architecture Documentation

## Overview

WuXuxian TTRPG Webapp is a full-stack web application for managing tabletop RPG characters, combat simulations, and game mechanics. The application follows a modern three-tier architecture with clear separation of concerns.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                  (React + TypeScript + Vite)                │
│                    Port: 5173 (dev)                        │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                         Backend                             │
│                    (FastAPI + SQLAlchemy)                   │
│                       Port: 8000                            │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQL/ORM
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                        Database                             │
│                      (PostgreSQL 15)                        │
│                       Port: 5432                            │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Styling**: Inline styles (minimal UI framework)

### Backend
- **Framework**: FastAPI 0.110.0
- **Language**: Python 3.12
- **ORM**: SQLAlchemy 2.0
- **Database Driver**: psycopg2
- **Testing**: pytest + pytest-asyncio
- **API Client**: httpx (for testing)

### Database
- **RDBMS**: PostgreSQL 15
- **Connection Pooling**: SQLAlchemy engine
- **Schema Management**: SQL scripts (schema.sql)

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Code Quality**: Black, isort, Ruff, ESLint, Prettier

## Directory Structure

```
idk/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py         # Dependency injection
│   │   │   └── routes/         # API route handlers
│   │   │       ├── characters.py
│   │   │       ├── boss_templates.py
│   │   │       ├── simulations.py
│   │   │       └── techniques.py
│   │   ├── core/
│   │   │   └── config.py       # Application settings
│   │   ├── db/
│   │   │   └── session.py      # Database session management
│   │   ├── models/             # SQLAlchemy models
│   │   │   ├── base.py
│   │   │   ├── characters.py
│   │   │   ├── boss_template.py
│   │   │   ├── simulation.py
│   │   │   └── techniques.py
│   │   ├── simulation/         # Combat simulation engine
│   │   │   ├── combat_state.py
│   │   │   ├── engine.py
│   │   │   └── quick_actions.py
│   │   └── main.py             # FastAPI application entry
│   ├── tests/                  # Backend tests
│   ├── requirements.txt        # Production dependencies
│   ├── requirements-dev.txt    # Development dependencies
│   ├── Dockerfile             # Backend container definition
│   └── schema.sql             # Database schema
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main application component
│   │   ├── main.tsx           # Application entry point
│   │   └── test/              # Test utilities
│   ├── package.json           # Node dependencies
│   ├── vite.config.ts         # Vite configuration
│   ├── vitest.config.ts       # Vitest configuration
│   └── Dockerfile            # Frontend container definition
├── infra/
│   └── docker-compose.yml     # Database-only compose file
├── docker-compose.yml         # Full-stack compose file
├── CONTRIBUTING.md           # Contribution guidelines
├── SECURITY.md              # Security policy
├── ARCHITECTURE.md          # This file
└── README.md               # Project documentation
```

## Component Details

### Frontend Architecture

The frontend is a single-page application (SPA) built with React and TypeScript:

**Key Components:**
- `App.tsx`: Main application component handling character listing
- Future: React Router for navigation between pages
- Future: State management with Context API or Redux

**Data Flow:**
1. User interacts with UI
2. Component state updates (useState hooks)
3. API calls made with fetch()
4. Response updates component state
5. UI re-renders with new data

### Backend Architecture

The backend follows a layered architecture pattern:

**Layers:**
1. **API Layer** (`app/api/routes/`): HTTP request handling, validation, response formatting
2. **Business Logic Layer** (`app/simulation/`): Domain logic, combat engine
3. **Data Access Layer** (`app/models/`, `app/db/`): Database operations, ORM models

**Key Patterns:**
- **Dependency Injection**: Database sessions injected via FastAPI's Depends
- **Pydantic Models**: Request/response validation and serialization
- **SQLAlchemy ORM**: Type-safe database operations
- **Repository Pattern**: Database access through SQLAlchemy models

### Database Schema

**Core Entities:**

1. **Characters** (`characters`)
   - Player characters, NPCs, and basic character data
   - Combat stats: THP, AE, DR, Strain, Guard
   - Links to techniques via JSON array

2. **Techniques** (`techniques`)
   - Combat techniques/abilities
   - Damage, AE cost, effects
   - Quick action vs major action

3. **Boss Templates** (`boss_templates`)
   - Pre-configured boss enemies
   - Combat stats and technique assignments
   - Used in simulations

4. **Simulation Configuration** (`simulation_configs`)
   - Parameters for combat simulations
   - Party composition, boss selection
   - Trial count, round limits, game mode

5. **Simulation Results** (`simulation_results`)
   - Outcomes of simulation runs
   - Win rates, damage statistics
   - AE/Strain curves over time

### API Endpoints

**Characters** (`/api/v1/characters`)
- `GET /` - List all characters
- `POST /` - Create new character
- `GET /{id}` - Get character by ID

**Techniques** (`/api/v1/techniques`)
- `GET /` - List all techniques (with filters)
- `POST /` - Create new technique
- `GET /{id}` - Get technique by ID
- `PATCH /{id}` - Update technique
- `DELETE /{id}` - Delete technique

**Boss Templates** (`/api/v1/boss-templates`)
- `GET /` - List all boss templates
- `POST /` - Create new boss template
- `GET /{id}` - Get boss template by ID

**Simulations** (`/api/v1/simulations`)
- `POST /configs` - Create simulation configuration
- `GET /configs/{id}` - Get configuration by ID
- `POST /run/{config_id}` - Run simulation
- `GET /results/{id}` - Get simulation results
- `GET /configs/{config_id}/results` - List results for config

## Combat Simulation Engine

### Architecture

The simulation engine is a Monte Carlo simulator that runs thousands of combat trials to estimate outcomes:

```
┌────────────────────────────────────────────────────────┐
│          Simulation Configuration                       │
│  (Party, Boss, Trials, Mode, etc.)                    │
└───────────────────┬────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│          Combat State Initialization                    │
│  Create CombatantState for each character/boss        │
└───────────────────┬────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│          Trial Loop (N iterations)                      │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Round Loop (until win/loss/timeout)             │ │
│  │  ┌────────────────────────────────────────────┐  │ │
│  │  │  1-Beat Mode: PCs → Boss                   │  │ │
│  │  │  or                                         │  │ │
│  │  │  3-Stage Mode: Quick → Major → Quick       │  │ │
│  │  └────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────┘ │
└───────────────────┬────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│          Result Aggregation                             │
│  Win rate, avg rounds, damage stats, curves           │
└────────────────────────────────────────────────────────┘
```

### Combat Modes

**1-Beat Combat** (Simple)
- Each round: All PCs act, then Boss acts
- Fast execution for basic simulations

**3-Stage Combat** (Advanced)
- Stage 1: Quick Actions (Fast SPD_band)
- Stage 2: Major Actions (All)
- Stage 3: Quick Actions (Slow SPD_band)
- SPD-aware turn ordering
- Strategic quick action choices

### Combat Mechanics

**Resources:**
- **THP** (Total Hit Points): Health pool
- **AE** (Action Energy): Resource for techniques
- **Strain**: Accumulates from damage/actions, causes death at max
- **Guard**: Temporary damage absorption

**Damage Routing:**
1. **THP Routing**: Damage → DR reduction → THP
2. **Guard Routing**: Damage → Guard → THP (overflow)
3. **Strain Routing**: Direct strain accumulation

**Decision Making:**
- Technique selection based on AE availability
- Quick action selection based on combat state
- Configurable decision policies (balanced, aggressive, defensive)

## Security Considerations

### Current Security Features
- ✅ CORS configured for localhost development
- ✅ SQL injection protection via SQLAlchemy ORM
- ✅ Input validation with Pydantic
- ✅ Parameterized database queries

### Security Gaps (To Be Implemented)
- ⚠️ No authentication/authorization
- ⚠️ No rate limiting
- ⚠️ No API key validation
- ⚠️ No request signing
- ⚠️ No audit logging
- ⚠️ No security headers (CSP, HSTS, etc.)

See [SECURITY.md](SECURITY.md) for detailed security policy.

## Performance Considerations

### Backend Performance
- Database connection pooling via SQLAlchemy
- Async request handling with FastAPI
- Efficient ORM queries with proper indexing
- Pagination support for list endpoints

### Frontend Performance
- Code splitting with Vite
- Lazy loading for routes (future)
- Memoization for expensive computations (future)
- Debounced API calls (future)

### Simulation Performance
- Cached technique data during simulation
- Efficient combat state updates
- Parallel trial execution (future optimization)
- Result streaming for long simulations (future)

## Testing Strategy

### Backend Testing
- **Unit Tests**: Model logic, combat mechanics
- **Integration Tests**: API endpoints, database operations
- **Simulation Tests**: Combat engine, quick actions
- Coverage target: >80%

### Frontend Testing
- **Component Tests**: React component rendering
- **Integration Tests**: User interactions, API mocking
- **E2E Tests**: Full user workflows (future)
- Coverage target: >70%

### CI/CD Testing
- Automated test runs on every push/PR
- Linting and formatting checks
- Build verification
- Test result reporting

## Deployment

### Development
```bash
# Start database
cd infra && docker-compose up -d

# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install && npm run dev
```

### Production (Docker Compose)
```bash
# Full stack with one command
docker-compose up -d

# Includes:
# - PostgreSQL database
# - FastAPI backend
# - Nginx-served frontend
```

### Cloud Deployment (Future)
- Container orchestration: Kubernetes/ECS
- Database: Managed PostgreSQL (RDS/Cloud SQL)
- Static assets: CDN
- Load balancing: ALB/Cloud Load Balancer
- Secrets management: Vault/Secret Manager

## Monitoring & Observability (Future)

### Planned Monitoring
- Application metrics (request rate, latency, errors)
- Database metrics (connections, query time)
- System metrics (CPU, memory, disk)
- Custom business metrics (simulations run, characters created)

### Logging
- Structured JSON logging
- Log aggregation and search
- Error tracking and alerting
- Audit trail for sensitive operations

## Future Enhancements

### Short Term
1. Complete OpenAPI specification
2. Populate database schema
3. Add database migrations (Alembic)
4. Implement authentication
5. Add rate limiting

### Medium Term
1. Frontend routing and navigation
2. Real-time updates (WebSockets)
3. Enhanced simulation visualizations
4. Character builder UI
5. Battle replay system

### Long Term
1. Multi-player campaign management
2. Mobile application
3. AI-powered encounter balancing
4. Social features (sharing, leaderboards)
5. Modding/plugin system
