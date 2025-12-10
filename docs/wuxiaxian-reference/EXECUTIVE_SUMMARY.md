# Wuxiaxian TTRPG - Executive Summary

**Project**: Hybrid Visual Novel + Wuxiaxian TTRPG Web Application
**Tech Stack**: FastAPI (Python) + React (TypeScript) + PostgreSQL
**Status**: Alpha - Core combat simulation working, full system in development

---

## What Is This?

A web-based tabletop RPG system inspired by **Mutants & Masterminds 3e** but redesigned for **Xianxia/cultivation fiction**. Combines deep tactical combat with visual novel storytelling, emphasizing "power at a cost" mechanics.

Think: **Fire Emblem** meets **Cradle** (Will Wight novels) meets **M&M 3e**.

---

## Core Design Pillars

### 1. Soul Core Level (SCL) System
Replaces M&M's Power Level with cultivation-flavored progression:
- **SCL = Core Level + Soul Level**
- Determines capability caps (Attack + Power ≤ 2 × SCL)
- Maps to Sequence bands: Cursed → Low → Mid → High → Transcendent

### 2. Power Draws Blood
Optimization comes with mechanical costs:
- **Blood Track**: Physical strain (glass cannon penalty)
- **Fate Track**: Destiny debt (luck manipulation cost)
- **Stain Track**: Corruption (moral erosion)
- Mark tracks when exceeding caps or using forbidden techniques

### 3. Three Conflict Pillars
Violence, Influence, and Revelation are equally supported:
- **Violence**: Physical combat → Body Defense → Physical conditions
- **Influence**: Social/political → Mind Defense → Social conditions
- **Revelation**: Horror/knowledge → Soul Defense → Sanity conditions
- Each has 4-step condition ladder (Wounded → Crippled → Downed → Ruined)

### 4. Tactical Combat
3-stage turn structure with Quick Actions:
- **Stage 1**: Fast SPD characters take Quick Actions
- **Stage 2**: Everyone takes Major Actions (techniques)
- **Stage 3**: Slow SPD characters take Quick Actions
- 7 Quick Action types for tactical depth

### 5. Resource Management
Combat uses four interlocking resources:
- **THP**: Health pool
- **AE**: Technique fuel (regenerates)
- **Strain**: Overexertion (causes death at max)
- **Guard**: Temporary armor

---

## What's Implemented

### ✅ Backend Combat Engine
- Monte Carlo simulation (1000+ trials)
- 1-beat and 3-stage combat modes
- All 7 Quick Action types
- THP/AE/Strain/Guard mechanics
- Damage routing (THP, Guard, Strain)
- Boss templates and party compositions
- Simulation analytics (win rates, damage curves)

### ✅ Database & API
- PostgreSQL schema with UUID keys
- RESTful API (FastAPI)
- Character, Technique, Boss, Simulation models
- SQLAlchemy ORM with JSON columns
- Full CRUD operations

### ✅ Visual Novel UI
- React Router multi-page navigation
- Character profile sheets
- Wiki/SRD browser with search
- Character manager
- Game room launcher

### ✅ Testing & CI/CD
- 29 backend tests (pytest)
- 6 frontend tests (vitest)
- GitHub Actions CI pipeline
- Code linting (Black, Ruff, ESLint, Prettier)

---

## What's Missing (Gap Analysis)

### ❌ Full Stat System
**Current**: Generic "level" field
**Needed**: 9 Primary Stats + 3 Aether Stats → SCL calculation
**Impact**: Can't enforce caps or calculate derived stats

### ❌ Condition Tracking
**Current**: No conditions implemented
**Needed**: 4-step ladders for Violence/Influence/Revelation
**Impact**: Can't model progressive degradation

### ❌ Cost Tracks
**Current**: Not present
**Needed**: Blood/Fate/Stain tracks with thresholds
**Impact**: "Power Draws Blood" not mechanically enforced

### ❌ Player Combat UI
**Current**: Only Monte Carlo simulation
**Needed**: Real-time combat with action/target selection
**Impact**: Players can't experience tactical combat

### ❌ Social & Horror Mechanics
**Current**: Only Violence conflict implemented
**Needed**: Influence and Revelation conflict systems
**Impact**: 2/3 of conflict types unavailable

---

## Roadmap

### Phase 1: Foundation (Weeks 1-2)
**Expand data models with full stat system**
- Add 9 Primary Stats + 3 Aether Stats to Character model
- Implement SCL calculation as property
- Add condition tracking (Violence/Influence/Revelation)
- Add cost tracks (Blood/Fate/Stain)

**Estimated Effort**: 4-6 hours
**Priority**: Critical - Blocks everything else

### Phase 2: Combat Refactoring (Weeks 2-3)
**Make combat engine data-driven and reusable**
- Split technique "base_damage" into attack_bonus + effect_rank
- Extract reusable combat functions from simulation engine
- Create player_combat.py for turn-by-turn combat
- Enforce SCL caps in technique validation

**Estimated Effort**: 7-10 hours
**Priority**: High - Enables combat UI

### Phase 3: Combat UI (Weeks 3-5)
**Build player-controlled combat interface**
- Create CombatView.tsx with turn/phase display
- Add CombatantCard.tsx with resource bars
- Add TechniqueSelector and QuickActionPanel
- Add TargetSelector with highlighting
- Add CombatLog and CombatResultModal

**Estimated Effort**: 8-12 hours
**Priority**: High - Core user experience

### Phase 4: Alignment & Polish (Weeks 5-6)
**Align terminology and add missing features**
- Rename "level" to "scl" throughout
- Add Wuxiaxian glossary/tooltips
- Create full character sheet UI
- Add condition badge display
- Comprehensive testing

**Estimated Effort**: 5-8 hours
**Priority**: Medium - Quality & accessibility

### Phase 5: Extension (Months 2-3)
**Implement remaining conflict types**
- Influence conflict mechanics
- Revelation conflict mechanics
- Clocks/fronts for arc-level play
- Character creation wizard with playbooks

**Estimated Effort**: 20+ hours
**Priority**: Medium-Low - Feature completeness

---

## Technical Architecture

### Backend (Python 3.12)
```
FastAPI app
  ├─ API Layer: Routes with Pydantic validation
  ├─ Business Logic: Simulation engine, combat rules
  └─ Data Layer: SQLAlchemy ORM + PostgreSQL
```

**Key Files**:
- `backend/app/simulation/engine.py` - Monte Carlo simulation
- `backend/app/simulation/combat_state.py` - Combat state management
- `backend/app/models/characters.py` - Character data model

### Frontend (React 18 + TypeScript)
```
React SPA
  ├─ Pages: Full-screen VN/UI views
  ├─ Components: Reusable widgets
  └─ API Client: Centralized fetch functions
```

**Key Files**:
- `frontend/src/pages/GameRoom.tsx` - Main launcher
- `frontend/src/components/` - Shared components
- `frontend/src/api.ts` - API integration

### Database (PostgreSQL 15)
```
Tables:
  ├─ characters (UUID, stats, combat resources)
  ├─ techniques (UUID, attack/effect, AE cost)
  ├─ boss_templates (UUID, pre-configured enemies)
  └─ simulations (UUID, config + results)
```

---

## Code Quality Metrics

**Test Coverage**: 35 tests (29 backend + 6 frontend)
**Linting**: Black, Ruff, ESLint, Prettier configured
**CI/CD**: GitHub Actions on every push/PR
**Documentation**: README, ARCHITECTURE, design docs
**Type Safety**: Python type hints + TypeScript throughout

---

## Key Design Documents

All located in `docs/wuxiaxian-reference/`:

1. **DESIGN_SUMMARY.md** (10k chars)
   - Complete system mechanics
   - Stats, SCL, combat resources
   - Conflict pillars and conditions

2. **REPO_ARCHITECTURE_ANALYSIS.md** (16k chars)
   - Current codebase structure
   - What's implemented vs. missing
   - Gap analysis and recommendations

3. **COMBAT_UI_DESIGN.md** (24k chars)
   - Complete UI component breakdown
   - UX flow and implementation plan
   - Code examples and API design

4. **ACTIONABLE_IMPROVEMENTS.md** (33k chars)
   - Prioritized improvements with code
   - 5 priority levels with effort estimates
   - 19-27 hours total for all priorities

---

## Quick Start for Developers

### 1. Read the Docs
```bash
# Start here for design context
docs/wuxiaxian-reference/README.md

# Then read in order:
DESIGN_SUMMARY.md           # System mechanics
REPO_ARCHITECTURE_ANALYSIS.md  # Current state
COMBAT_UI_DESIGN.md         # UI implementation
ACTIONABLE_IMPROVEMENTS.md  # What to do next
```

### 2. Set Up Environment
```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pytest tests/  # Should pass 29 tests

# Frontend
cd frontend
npm install
npm test  # Should pass 6 tests

# Database
cd infra
docker-compose up -d
```

### 3. Pick a Task
See `ACTIONABLE_IMPROVEMENTS.md` for prioritized work items.

**Quick Wins** (< 2 hours):
- Add cost tracks to Character model
- Rename "level" to "scl" throughout
- Add condition badge display
- Write stat calculation tests

**Foundation Work** (required first):
- Expand Character model with full stat system
- Refactor technique system (attack/effect separation)
- Extract reusable combat functions

---

## Design Philosophy

### Balance Taxonomy
From M&M 3e Character Guide:
- **Broken**: Game-breaking (banned)
- **Overpowered**: Clearly superior (GM approval)
- **Strong**: Above baseline (limited)
- **Balanced**: Core design target ⭐
- **Niche**: Situational but valuable
- **Weak**: Rarely worth taking
- **Useless**: Never take

**Goal**: Keep core system in Balanced range, allow Strong builds with cost track penalties.

### Non-Negotiable Constraints

1. **SCL caps must be enforced** - No free power increases
2. **Cost tracks must matter** - Optimization has consequences
3. **4th-degree conditions require story** - Not just a recovery roll
4. **Three pillars are equal** - Violence, Influence, Revelation all viable
5. **Xianxia flavor is essential** - Cultivation, Sequence, soul-based powers

---

## Success Criteria

### MVP (Minimum Viable Product)
- ✅ Core combat simulation (done)
- ⏳ Full stat system with SCL calculation
- ⏳ Player-controlled combat UI
- ⏳ Condition tracking (Violence only)
- ⏳ Character sheet with all stats visible

### v1.0 (Feature Complete)
- ✅ MVP criteria
- ⏳ All three conflict types (Violence, Influence, Revelation)
- ⏳ Cost tracks with mechanical effects
- ⏳ Character creation wizard
- ⏳ Comprehensive testing

### v2.0 (Polish & Extension)
- ✅ v1.0 criteria
- ⏳ Playbook system
- ⏳ Combat replay viewer
- ⏳ Social and horror conflict UI
- ⏳ GM tools for encounter building

---

## Contact & Resources

**Repository**: https://github.com/hvrryh-web/idk
**Documentation**: `/docs/wuxiaxian-reference/`
**Design Docs**: `/WUXUXIANXIA TTRPG/`
**API Docs**: http://localhost:8000/docs (when running)

**For Questions**:
- System design: See DESIGN_SUMMARY.md
- Implementation: See REPO_ARCHITECTURE_ANALYSIS.md
- Next steps: See ACTIONABLE_IMPROVEMENTS.md

---

## TL;DR

**What**: Xianxia-flavored TTRPG with visual novel UI
**Status**: Alpha - Combat simulation works, full system in progress
**Gap**: Need full stat system, combat UI, condition tracking
**Next**: Implement Phase 1 (data models) from ACTIONABLE_IMPROVEMENTS.md
**Effort**: 19-27 hours to reach MVP
**Docs**: Read `docs/wuxiaxian-reference/README.md` first
