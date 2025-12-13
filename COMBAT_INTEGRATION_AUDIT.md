# Combat Integration Audit Report

**Date**: 2025-12-12  
**Purpose**: Assess current repo structure for combat engine integration  
**Status**: Complete

---

## Executive Summary

This audit examines the existing repository structure to inform the design and implementation of a turn-based combat engine for the Visual Novel (VN) webapp. The repo is a hybrid VN + TTRPG system with existing combat UI components and comprehensive game mechanics documentation.

---

## 1. Current Page Structure and Routing

### Framework & Router
- **Framework**: React 18 + TypeScript + Vite
- **Router**: React Router 6 (BrowserRouter with `<Routes>`)
- **Entry Point**: `frontend/src/main.tsx` → `frontend/src/App.tsx`

### Existing Routes (from `App.tsx`)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `GameRoom` | Main game lobby |
| `/game` | `GameScreen` | Primary game screen |
| `/combat/:encounterId` | `CombatView` | **Combat UI (already exists)** |
| `/map` | `MapScreen` | World navigation |
| `/war-map` | `WarMapScreen` | Tactical war view |
| `/city` | `CityScreen` | City exploration |
| `/region` | `RegionalMapScreen` | Regional map |
| `/world` | `WorldMapScreen` | World map |
| `/personal` | `PersonalViewScreen` | Character personal view |
| `/conversation` | `ConversationScreen` | VN conversation mode |
| `/profile/:id` | `ProfileSheet` | Character profile |
| `/cultivation/:id` | `CultivationSheet` | Cultivation progress |
| `/characters` | `CharacterManager` | Character management |
| `/characters/create` | `CharacterCreation` | Character creation flow |
| `/character/create` | `CharacterCreatorPage` | Alternative creation |
| `/fate-card-builder` | `FateCardBuilderPage` | Fate card system |
| `/ascii-art` | `ASCIIArtManager` | ASCII art management |
| `/srd` | `SRDBook` | System Reference Document |
| `/wiki` | `WikiIndex` | Game wiki |

### Findings
- ✅ **Combat route already exists**: `/combat/:encounterId`
- ✅ **Router is modular**: Easy to add new routes or modify existing
- ✅ **VN integration possible**: `ConversationScreen` can trigger combat

---

## 2. State Management Approach

### Current Approach
- **Primary**: Local component state with `useState` hooks
- **Zustand Stores**: Used for specific features
  - `frontend/src/asciiStore.ts` - ASCII art state
  - `frontend/src/fateCardBuilder/store/useFateCardBuilderStore.ts` - Fate card builder
  - `frontend/src/character/state/useCharacterCreatorStore.ts` - Character creation

### Combat-Related State (from `CombatView.tsx`)
```typescript
const [combatState, setCombatState] = useState<CombatState | null>(null);
const [techniques, setTechniques] = useState<Technique[]>([]);
const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
const [targetMode, setTargetMode] = useState(false);
const [combatLog, setCombatLog] = useState<LogEntry[]>([]);
```

### API Integration
- **Centralized API**: `frontend/src/api.ts`
- **Combat API functions exist**:
  - `getCombatState(encounterId)`
  - `executeAction(encounterId, actorId, actionType, techniqueId, targetId)`
  - `executeQuickAction(encounterId, actorId, actionType)`
  - `fetchTechniques()`

### Findings
- ✅ **State management is flexible**: Can add new stores or keep local state
- ✅ **Combat API layer exists**: Ready for backend integration
- ⚠️ **No event-sourcing**: Current approach is imperative, not reducer-based
- 📋 **Recommendation**: Add event-driven reducer for combat engine (replay/testing)

---

## 3. Current UI Components Relevant to Overlays/Modals

### Existing Combat Components (`frontend/src/components/combat/`)

| Component | Purpose | Status |
|-----------|---------|--------|
| `CombatView.tsx` | Main combat container | ✅ Implemented |
| `CombatantCard.tsx` | Character display with HP bars | ✅ Implemented |
| `TurnIndicator.tsx` | Round/phase display | ✅ Implemented |
| `TechniqueSelector.tsx` | Technique selection UI | ✅ Implemented |
| `QuickActionPanel.tsx` | Quick action buttons | ✅ Implemented |
| `CombatLog.tsx` | Combat event history | ✅ Implemented |
| `ActionPreview.tsx` | Action cost preview | ✅ Implemented |

### Other Relevant Components

| Component | Path | Reusable For |
|-----------|------|--------------|
| `CharacterPreview` | `components/CharacterPreview.tsx` | Character portraits |
| `StyleBoard` | `components/StyleBoard.tsx` | Theme/style overlay |
| `CharacterCodex` | `components/CharacterCodex.tsx` | Character reference |
| `ErrorBoundary` | `ErrorBoundary.tsx` | Error handling |
| `ApiErrorBanner` | `ApiErrorBanner.tsx` | API error display |
| `DebugPanel` | `DebugPanel.tsx` | Debug overlay |

### Styling Approach
- **CSS Files**: Component-specific CSS in `frontend/src/styles/`
- **Inline Styles**: Some components use inline React styles
- **CSS Variables**: `frontend/src/styles/variables.css`
- **Theme**: `frontend/src/styles/theme.ts`

### Findings
- ✅ **Combat UI components exist**: Can extend/modify existing components
- ✅ **Modal/overlay patterns available**: Debug panel, error banner as examples
- ✅ **Consistent styling**: CSS files with variables for theming
- 📋 **Missing**: Combat result modal, forecast panel, status icons

---

## 4. Existing Data Format for Scenes

### Character Data
- **Frontend**: `frontend/src/data/characters.ts`, `frontend/src/data/sampleCharacters.ts`
- **Types**: `frontend/src/types.ts`

### Technique Data
- **Frontend**: `frontend/src/data/techniques.ts`
- **Schema**: `docs/schemas/technique.schema.json`

### Fate Cards
- **Data**: `frontend/src/data/fateCards.ts`
- **Builder**: `frontend/src/fateCardBuilder/`

### Scene/Encounter Format
- No explicit scene JSON files found
- Combat state is fetched from API: `getCombatState(encounterId)`
- VN conversations likely use `ConversationScreen` component

### Game Mechanics Documentation
Located in `docs/wuxiaxian-reference/`:
- `SRD_UNIFIED.md` - Complete game rules (Alpha v0.3)
- `COMBAT_UI_DESIGN.md` - Combat UI specification
- `COMBAT_UI_UX_FLOW.md` - User experience flow

### Findings
- ✅ **Typed data structures**: TypeScript interfaces for all entities
- ✅ **Comprehensive SRD**: Game rules are well-documented
- ⚠️ **No encounter JSON files**: Need to create encounter data format
- 📋 **Recommendation**: Create JSON schemas for units, skills, encounters

---

## 5. Backend Structure

### Backend Location
- **Path**: `backend/`
- **Framework**: FastAPI + SQLAlchemy (Python)
- **API Docs**: `backend/API_DOCS.md`
- **Schema**: `backend/schema.sql`

### ASCII Art Backend (Node.js)
- **Path**: `src/backend/ascii/`
- **Purpose**: ASCII art generation service
- **Combat Integration**: `src/backend/ascii/combat-integration.ts`

### Landing Backend
- **Path**: `landing-backend/`
- **Purpose**: Landing page API

### Findings
- ✅ **Backend exists**: Can extend with combat endpoints
- ✅ **ASCII combat integration**: Already has combat-related ASCII code
- 📋 **Focus**: Frontend-first combat engine (static-web compatible)

---

## 6. ADR Documentation

### Existing ADRs
- **ADR-0003**: Created in `docs/adr/ADR-0003-bonus-composition-contest-roles.md`
  - Defines contest roles (Actor/Opposition)
  - Bonus composition formula
  - Check type → trait mapping
  - Status quo rule for ties

### Referenced ADRs (not yet in repo)
- **ADR-0001**: Opposed-first core engine (ActorTotal vs OppTotal, DoS bands)
- **ADR-0002**: Canonical stat spine and pillar→defense/resilience mapping

---

## 7. Constraints for Combat Engine

### Must Support
1. **Static-web compatible**: No server-side combat resolution required
2. **Deterministic**: Seeded RNG for reproducibility
3. **Event-sourced**: Reducer-style state transitions for replay/testing
4. **Accessible**: Keyboard navigation, visible focus states
5. **Mobile responsive**: Touch-friendly layout

### Must Integrate With
1. **VN narrative state**: Trigger combat from conversations, return results
2. **Existing combat UI**: Extend `CombatView` and related components
3. **Type system**: Use existing TypeScript interfaces
4. **Styling**: Follow existing CSS patterns

### Must Follow
1. **ADR-0003**: Bonus composition and contest roles
2. **SRD mechanics**: THP, AE, Strain, Guard, conditions, pillars
3. **3-Stage combat**: Quick1 → Major → Quick2 action phases

---

## 8. Gap Analysis

### What Exists
| Component | Status | Notes |
|-----------|--------|-------|
| Combat route | ✅ Exists | `/combat/:encounterId` |
| Combat UI components | ✅ Exists | 7 components in place |
| Combat types | ✅ Exists | `CombatState`, `CombatantState`, etc. |
| Combat API functions | ✅ Exists | Need backend or local implementation |
| Game mechanics docs | ✅ Exists | Comprehensive SRD |
| ADR-0003 | ✅ Created | Contest roles and bonus composition |

### What's Missing
| Component | Priority | Notes |
|-----------|----------|-------|
| Seeded RNG | High | Needed for determinism |
| Event log/reducer | High | Needed for replay/testing |
| Damage/hit/crit rules | High | Core combat math |
| Encounter JSON schema | Medium | Data-driven encounters |
| Combat result modal | Medium | Victory/defeat screen |
| VN ↔ Combat bridge | Medium | Integration contract |
| Forecast panel | Low | Pre-action preview |
| Status icons | Low | Condition visualization |

---

## 9. Recommended Architecture

### Directory Structure
```
frontend/src/
├── combat/
│   ├── engine/
│   │   ├── combatState.ts      # State interfaces
│   │   ├── events.ts           # Event types
│   │   ├── reducer.ts          # State reducer
│   │   ├── rng.ts              # Seeded RNG
│   │   └── rules/
│   │       ├── damage.ts       # Damage calculation
│   │       ├── hit.ts          # Hit/crit logic
│   │       └── statuses.ts     # Condition effects
│   ├── data/
│   │   ├── encounters.json     # Encounter definitions
│   │   ├── skills.json         # Skill/technique data
│   │   └── units.json          # Unit templates
│   ├── ui/                     # (Existing components)
│   │   └── components/
│   └── integration/
│       └── battleBridge.ts     # VN ↔ Combat bridge
```

### State Flow
```
VN Scene → startBattle(encounterId) → Combat Engine → Combat UI
                                                           ↓
VN Scene ← battleResult(outcome, rewards, flags) ← Combat Engine
```

---

## 10. Next Steps

1. **Create Combat Engine Spec** (`docs/combat_engine_spec.md`)
2. **Create Battle UI Spec** (`docs/battle_ui_spec.md`)
3. **Implement Scaffolding**:
   - Seeded RNG
   - Event types and reducer
   - Combat rules (damage, hit, crit)
4. **Create Data Schemas**:
   - Encounter JSON format
   - Unit/skill definitions
5. **Add VN Integration**:
   - `battleBridge.ts` with `startBattle()` API
6. **Create Roadmap** (`docs/combat_roadmap.md`)

---

## Appendix: Key File References

### Frontend
- `frontend/src/App.tsx` - Main app with routes
- `frontend/src/api.ts` - API client
- `frontend/src/types.ts` - Type definitions
- `frontend/src/components/combat/` - Combat UI components

### Documentation
- `docs/wuxiaxian-reference/SRD_UNIFIED.md` - Game rules
- `docs/wuxiaxian-reference/COMBAT_UI_DESIGN.md` - UI design
- `docs/COMBAT_UI_UX_FLOW.md` - UX flow
- `docs/adr/ADR-0003-bonus-composition-contest-roles.md` - Contest roles

### Backend
- `backend/` - FastAPI backend (optional for static-web)
- `src/backend/ascii/combat-integration.ts` - ASCII combat
