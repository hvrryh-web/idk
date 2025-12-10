# Repository Architecture & Mapping to Design

## Current Repository Structure

```
idk/
├── backend/                    # FastAPI + SQLAlchemy backend
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/        # API endpoints
│   │   │       ├── characters.py      # Character CRUD
│   │   │       ├── boss_templates.py  # Boss templates
│   │   │       ├── simulations.py     # Combat simulations
│   │   │       └── techniques.py      # Technique management
│   │   ├── core/
│   │   │   └── config.py      # App configuration
│   │   ├── db/
│   │   │   └── session.py     # Database sessions
│   │   ├── models/            # SQLAlchemy ORM models
│   │   │   ├── characters.py  # Character model
│   │   │   ├── boss_template.py
│   │   │   ├── simulation.py
│   │   │   └── techniques.py
│   │   ├── simulation/        # ⭐ COMBAT ENGINE
│   │   │   ├── combat_state.py    # Combat state management
│   │   │   ├── engine.py          # Monte Carlo simulation
│   │   │   └── quick_actions.py   # Quick action logic
│   │   └── main.py            # FastAPI app entry
│   ├── tests/                 # Backend tests (pytest)
│   └── schema.sql             # Database schema
├── frontend/                  # React + TypeScript + Vite
│   └── src/
│       ├── pages/             # ⭐ VN/UI LAYER
│       │   ├── GameRoom.tsx        # Main menu/launcher
│       │   ├── ProfileSheet.tsx    # Character profile
│       │   ├── CultivationSheet.tsx
│       │   ├── SoulCoreSheet.tsx
│       │   ├── DomainSourceSheet.tsx
│       │   ├── WikiIndex.tsx       # Knowledge base
│       │   ├── HelpPage.tsx
│       │   ├── SRDBook.tsx         # System reference
│       │   └── CharacterManager.tsx
│       ├── components/        # Reusable UI components
│       │   ├── CharacterList.tsx
│       │   ├── CharacterDetail.tsx
│       │   ├── SimulationRunner.tsx
│       │   └── TechniqueList.tsx
│       ├── api.ts             # API client
│       ├── types.ts           # TypeScript types
│       └── App.tsx            # React Router setup
├── WUXUXIANXIA TTRPG/         # ⭐ DESIGN DOCUMENTS (Source of Truth)
│   ├── Wuxianxia Game Full Chat Context.md  # Complete system design
│   ├── Wuxianxia Game Chat Start (long).md
│   ├── Wuxianxia Game Chat Start (2).md
│   ├── Wuxianxia Game Chat Part (3).md
│   ├── Wuxianxia Game Chat Part (4).md
│   ├── Wuxianxia Game Chat Part (5).md
│   └── Wuxianxia Game Chat Part (6).md
├── infra/
│   └── docker-compose.yml     # PostgreSQL container
└── docs/                      # Documentation (newly created)
    └── wuxiaxian-reference/
```

## Architectural Style

### Backend: Layered Architecture

**Layer 1: API/Routes** (`app/api/routes/`)
- HTTP request handling
- Request validation with Pydantic
- Response serialization
- RESTful endpoint design

**Layer 2: Business Logic** (`app/simulation/`)
- Combat state management
- Monte Carlo simulation engine
- Decision-making algorithms
- Game rule enforcement

**Layer 3: Data Access** (`app/models/`, `app/db/`)
- SQLAlchemy ORM models
- Database session management
- CRUD operations
- PostgreSQL integration

### Frontend: Component-Based SPA

**Pattern**: React Router + Page Components + Shared Components

**Current UI Components:**
- **Pages**: Full-screen views with routing
- **Components**: Reusable widgets (lists, details, runners)
- **API Layer**: Centralized fetch functions in `api.ts`
- **Types**: Shared TypeScript interfaces in `types.ts`

**State Management**: Local component state with `useState`, no global state library yet

### Database: PostgreSQL with JSON columns

**Schema Approach:**
- Relational tables for main entities
- JSON columns for flexible nested data (stats, techniques arrays)
- UUID primary keys
- Timestamps for audit trails

## Combat/System Logic Location

### Primary Combat Engine: `backend/app/simulation/`

**`combat_state.py`** - State Management
```python
@dataclass
class CombatantState:
    # Core combat stats
    thp: int              # Total Hit Points
    max_thp: int
    ae: int               # Action Energy
    max_ae: int
    ae_reg: int           # AE regeneration per round
    dr: float             # Damage Reduction (0.0-1.0)
    strain: int           # Strain accumulation
    guard: int            # Guard value
    spd_band: str         # "Fast", "Normal", "Slow"
    technique_ids: List[UUID]
    
    # Methods for damage application, AE management
```

**`engine.py`** - Monte Carlo Simulation
- Loads characters and boss templates
- Runs N trials of combat
- Tracks win rates, damage stats, AE/Strain curves
- Supports 1-beat and 3-stage combat modes
- Decision algorithms for technique selection

**`quick_actions.py`** - Quick Action Logic
- 7 quick action types (Guard Shift, Dodge, Brace, AE Pulse, Strain Vent, Stance Switch, Counter Prep)
- Selection logic based on combat state
- Effects on combatant stats

### Data Models: `backend/app/models/`

**`characters.py`**
```python
class Character(Base):
    # Identity
    name: str
    type: CharacterType  # pc, npc, boss
    level: int
    
    # Combat stats (matches CombatantState)
    thp: int
    ae: int
    ae_reg: int
    dr: float
    strain: int
    guard: int
    spd_band: SPDBand  # Fast, Normal, Slow
    
    # Techniques (JSON array of UUIDs)
    techniques: List[UUID]
```

**`techniques.py`**
```python
class Technique(Base):
    name: str
    technique_type: str
    base_damage: int
    ae_cost: int
    self_strain: int
    damage_routing: str  # "THP", "Guard", "Strain"
    boss_strain_on_hit: int
    dr_debuff: float
    is_quick_action: bool
```

### API Endpoints: `backend/app/api/routes/`

**Characters** (`/api/v1/characters`)
- GET / - List all characters
- POST / - Create character
- GET /{id} - Get character by ID

**Techniques** (`/api/v1/techniques`)
- Full CRUD for technique management
- Filtering by type, quick action status

**Boss Templates** (`/api/v1/boss-templates`)
- Pre-configured boss enemies for simulations

**Simulations** (`/api/v1/simulations`)
- POST /configs - Create simulation configuration
- POST /run/{config_id} - Execute Monte Carlo simulation
- GET /results/{id} - Retrieve simulation results

## VN/UI Logic Location

### Frontend Pages: `frontend/src/pages/`

**Current Visual Novel UI:**

1. **GameRoom.tsx** - Main launcher
   - "LAUNCH ALPHA TEST" button
   - Character roster display
   - Navigation to Wiki, Help, Character Manager

2. **ProfileSheet.tsx** - Character profile viewer
   - Display character identity and stats
   - Visual novel style presentation

3. **CultivationSheet.tsx** - Cultivation progress
   - (Structure exists, needs implementation)

4. **SoulCoreSheet.tsx** - Soul Core details
   - (Structure exists, needs implementation)

5. **DomainSourceSheet.tsx** - Domain Source info
   - (Structure exists, needs implementation)

6. **WikiIndex.tsx** - Knowledge base browser
   - Searchable SRD articles
   - Visual novel style information presentation

7. **CharacterManager.tsx** - Character CRUD UI
   - Create/edit characters
   - Run simulations
   - Technical interface (less VN-style)

**UI Style**: Currently minimal inline styles, visual novel aesthetic partially implemented

## Alpha Implementation vs. Design Intent

### ✅ What's Implemented

**Combat Mechanics:**
- ✅ THP, AE, DR, Strain, Guard resources
- ✅ Damage routing (THP, Guard, Strain)
- ✅ AE regeneration per round
- ✅ 3-stage combat with SPD bands (Fast, Normal, Slow)
- ✅ Quick Actions (all 7 types)
- ✅ Technique system with AE costs and damage types
- ✅ Monte Carlo simulation engine (1000+ trials)
- ✅ Boss templates for testing

**Data Architecture:**
- ✅ Database schema with characters, techniques, bosses
- ✅ RESTful API with FastAPI
- ✅ SQLAlchemy ORM models
- ✅ JSON storage for flexible nested data

**Frontend:**
- ✅ React Router for multi-page navigation
- ✅ Basic character viewing pages
- ✅ Wiki/SRD browser
- ✅ Character manager with simulation runner

### ⚠️ Partial Implementation (Needs Alignment)

**Terminology Mismatch:**
- ❌ No "SCL" (Soul Core Level) - uses generic "level"
- ❌ No "Sequence" bands labeled (Cursed, Low, Mid, High)
- ❌ No Core Stats (Mind, Body, Soul) or Aether Stats (Control, Fate, Spirit)
- ❌ Generic "stats" JSON field instead of 9 Primary Stats + 3 Aether Stats
- ⚠️ "THP" matches, "AE" matches, but "Strain" and "Guard" need clearer docs
- ❌ No "CL" or "SL" calculation visible

**Missing Combat Concepts:**
- ❌ No Condition Tracks (Wounded→Crippled→Downed→Ruined Body)
- ❌ No Influence or Revelation conflict types (only Violence)
- ❌ No Body/Mind/Soul Defense stats
- ❌ No Attack bonus + Power rank separation (just "base_damage")
- ❌ No Cost Tracks (Blood, Fate, Stain)
- ❌ No Power Draws Blood profiles (Glass Cannon vs Tank)

**Missing VN/Narrative Integration:**
- ❌ No combat UI for player-controlled battles
- ❌ Combat only available through Monte Carlo simulation
- ❌ No narrative hooks for condition application
- ❌ No visual feedback for strain/guard/ae in combat
- ❌ No turn-by-turn combat viewer
- ❌ No target selection UI

### ❌ Not Yet Implemented

**From Design Docs:**
- ❌ 9 Primary Stats system (Essence, Resolve, Presence, Strength, Endurance, Agility, Technique, Willpower, Focus)
- ❌ SCL-based caps (Attack + Power ≤ 2 × SCL)
- ❌ Three conflict pillars (Violence, Influence, Revelation)
- ❌ Condition ladder progression (4-step tracks)
- ❌ Cost tracks with narrative consequences
- ❌ Playbooks/archetypes for character creation
- ❌ Social and horror conflict mechanics
- ❌ Clocks/fronts for arc-level play
- ❌ Hero Points equivalent (Momentum or similar)
- ❌ Character sheet UI showing all stats
- ❌ Combat UI with action selection, target selection
- ❌ Visual feedback for conditions, buffs, debuffs

## Mismatches Between Design Intent and Implementation

### Critical Mismatches

1. **Stats Architecture**
   - **Design**: 9 Primary Stats → 3 Core Stats → SCL calculation
   - **Implementation**: Single "level" field, generic JSON "stats"
   - **Impact**: Can't enforce SCL-based caps or calculate derived stats

2. **Technique System**
   - **Design**: Attack bonus + Effect rank ≤ 2 × SCL per pillar
   - **Implementation**: Single "base_damage" value, no attack/effect separation
   - **Impact**: Can't model accuracy vs power trade-offs

3. **Combat Scope**
   - **Design**: Three equal conflict types (Violence, Influence, Revelation)
   - **Implementation**: Only Violence implemented
   - **Impact**: Social and horror encounters not mechanically supported

4. **Condition System**
   - **Design**: 4-step condition ladders per pillar
   - **Implementation**: No condition tracking at all
   - **Impact**: Can't model progressive degradation or narrative stakes

5. **Cost Tracks**
   - **Design**: Blood/Fate/Stain tracks for "Power Draws Blood"
   - **Implementation**: Not present
   - **Impact**: No mechanical enforcement of power-at-cost theme

### Minor Mismatches

6. **Terminology**
   - **Design**: SCL, Sequence, Core/Soul Level, AetherCore
   - **Implementation**: Generic RPG terms (level, stats, health)
   - **Impact**: Loses Wuxiaxian flavor and design intent communication

7. **VN Integration**
   - **Design**: Visual Novel with embedded TTRPG combat
   - **Implementation**: Separate VN pages and simulation engine, not integrated
   - **Impact**: Player can't experience tactical combat in VN context

8. **Data-Driven Design**
   - **Design**: Techniques should be easily added/modified
   - **Implementation**: Partially data-driven (DB-stored techniques) but hardcoded logic
   - **Impact**: Adding new technique types requires code changes

## Current System Strengths

### Well-Implemented Areas

1. **Monte Carlo Simulation**
   - Excellent for balance testing
   - Tracks detailed analytics (win rates, damage curves, AE/Strain over time)
   - Supports both 1-beat and 3-stage combat modes

2. **Database Architecture**
   - Clean ORM models with proper relationships
   - UUID-based keys for distributed systems
   - JSON columns for flexible nested data

3. **API Design**
   - RESTful structure
   - Clear separation of concerns
   - Good documentation (OpenAPI/Swagger)

4. **Testing Infrastructure**
   - 29 backend tests covering combat mechanics
   - 6 frontend tests for UI components
   - CI/CD with GitHub Actions

5. **Foundation for Extension**
   - Modular code structure
   - Clear separation of simulation logic from data models
   - React component library started

## Recommendations for Alignment

### High Priority (Core Mechanics)

1. **Expand Character Model to Include Full Stat System**
   - Add fields for 9 Primary Stats
   - Add fields for 3 Aether Stats
   - Calculate Core Stats and SCL as properties
   - Label Sequence band based on SCL

2. **Refactor Technique Model for Attack/Effect Separation**
   - Split "base_damage" into "attack_bonus" and "effect_rank"
   - Add conflict_type field: "Violence", "Influence", "Revelation"
   - Enforce SCL caps in validation

3. **Implement Condition Tracking**
   - Add condition_tracks to Character/CombatantState
   - Track Violence/Influence/Revelation conditions separately
   - Implement condition application logic in combat

4. **Add Cost Track System**
   - Add blood_track, fate_track, stain_track to Character
   - Implement marking logic when using specialized profiles
   - Add narrative consequences at thresholds

### Medium Priority (Combat UI)

5. **Create Combat UI Layer**
   - New CombatView.tsx page for player-controlled battles
   - Action selection UI (techniques, quick actions)
   - Target selection UI
   - Resource display (THP, AE, Strain, Guard)
   - Turn/phase indicator

6. **Integrate VN and Combat Layers**
   - Trigger combat from VN story points
   - Return to VN after combat resolution
   - Show narrative consequences of conditions

### Low Priority (Polish & Extension)

7. **Terminology Cleanup**
   - Rename "level" to "scl" throughout
   - Add "sequence_band" labels
   - Use Wuxiaxian terms in UI text

8. **Playbook System**
   - Character creation wizard with playbook selection
   - Pre-configured stat distributions
   - Balanced starting technique sets

9. **Social & Horror Mechanics**
   - Implement Influence conflict resolution
   - Implement Revelation conflict resolution
   - Add clocks/fronts system for arc play

## Technical Debt & Code Quality

### Current Technical Debt

1. **Hardcoded Logic**: Decision algorithms hardcoded in engine.py
2. **Limited Validation**: No SCL cap enforcement in technique creation
3. **No Migration System**: Schema changes require manual SQL updates
4. **Minimal Frontend State**: No Redux/Context for shared state
5. **Inline Styles**: CSS should be in separate files or styled-components

### Code Quality Strengths

1. **Type Safety**: Python type hints, TypeScript throughout
2. **Testing**: Good test coverage for critical paths
3. **Documentation**: Comprehensive README, ARCHITECTURE docs
4. **Linting**: Black, Ruff, ESLint, Prettier configured
5. **CI/CD**: Automated testing and formatting checks

## Summary: Current State vs. Design Vision

**Current State**: Solid technical foundation with working combat simulation engine and VN UI skeleton. Implements core resource management (THP, AE, Strain, Guard) and 3-stage combat with Quick Actions. Monte Carlo simulation provides excellent balance testing.

**Gap to Vision**: Missing the full stat system (SCL, Primary/Core/Aether stats), condition tracks, cost tracks, and three conflict types. No player-controlled combat UI. Terminology doesn't match Wuxiaxian design language. Social and horror mechanics not implemented.

**Path Forward**: Expand data models to support full stat system, implement condition and cost tracking, build combat UI layer, refactor for data-driven extensibility, and align terminology throughout.
