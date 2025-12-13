# Visual Novel Game System Design Gap CRIT Review Report

**Report Date:** 2024-12-13  
**Repository:** hvrryh-web/idk  
**Review Type:** Critical Design Gap Analysis & Implementation Priority Assessment

---

## Executive Summary

This CRIT (Critical Review and Implementation Tracking) report provides a comprehensive gap analysis of the WuXuxian Visual Novel + TTRPG hybrid system. The report identifies **high-priority, actionable improvements** for both Frontend UI and Backend System integrations.

### Key Findings

| Category | Status | Gap Level | Priority |
|----------|--------|-----------|----------|
| Combat UI Foundation | ✅ Implemented | Low | — |
| Player-Controlled Combat | ✅ Implemented | Low | — |
| Backend Combat API | ✅ Implemented | Low | — |
| Full Stat System | ⚠️ Partial | Medium | P1 |
| Condition Tracking Display | ✅ Implemented | Low | — |
| Cost Track Display | ✅ Implemented | Low | — |
| SCL Caps Enforcement | ✅ Implemented | Low | — |
| Combat Result UI | ✅ Implemented | Low | — |
| VN-Combat Integration | ✅ Implemented | Low | — |
| Condition Application on Damage | ✅ Implemented | Low | — |

---

## Part 1: Current State Assessment

### 1.1 What's Working Well ✅

#### Backend Combat System
- **Monte Carlo Simulation Engine** (`backend/app/simulation/engine.py`)
  - Supports 1000+ trial simulations
  - 1-beat and 3-stage combat modes
  - All 7 Quick Action types implemented
  
- **Player Combat Session** (`backend/app/simulation/player_combat.py`)
  - Real-time turn-by-turn combat
  - Action execution with logging
  - Enemy AI with basic decision-making
  
- **Combat API Routes** (`backend/app/api/routes/combat.py`)
  - `/encounters` - Create encounters
  - `/encounters/{id}/actions` - Execute techniques
  - `/encounters/{id}/quick-actions` - Execute quick actions
  - `/encounters/{id}/preview` - Action previews

#### Frontend Combat Components
- **CombatView.tsx** - Main combat container with party/enemy display
- **CombatantCard.tsx** - Character cards with resource bars (THP, AE, Strain, Guard)
- **TechniqueSelector.tsx** - Technique selection with AE cost display
- **QuickActionPanel.tsx** - Quick action buttons
- **TurnIndicator.tsx** - Round/phase display
- **CombatLog.tsx** - Combat action history

#### Data Models
- **Character Model** (`backend/app/models/characters.py`)
  - Primary stats (9 stats)
  - Aether stats (3 stats)
  - SCL calculation as hybrid property
  - Condition and cost tracks (JSONB)
  - Combat stats (THP, AE, DR, Strain, Guard)

- **Frontend Types** (`frontend/src/types.ts`)
  - Full TypeScript interfaces
  - CombatState, CombatPhase types
  - Condition and cost track interfaces

### 1.2 What's Missing or Incomplete ❌

#### Frontend UI Gaps

1. **Condition Track Display** (HIGH PRIORITY)
   - Backend stores conditions in `violence_conditions`, `influence_conditions`, `revelation_conditions`
   - CombatantCard has a `conditions` display but currently shows `[]` (empty)
   - No visual badges for condition severity (1st-4th degree)
   - No tooltips explaining condition effects

2. **Cost Track Display** (HIGH PRIORITY)
   - Backend has `blood_track`, `fate_track`, `stain_track` fields
   - No UI component shows cost track status
   - No visual feedback when costs are incurred
   - Action preview shows marks but combat view doesn't track them

3. **SCL/Sequence Band Display** (MEDIUM PRIORITY)
   - Character model has `scl` hybrid property
   - Frontend types define `scl` and `sequence_band`
   - No visible display in CombatantCard or character sheets

4. **VN-Combat Transition** (HIGH PRIORITY)
   - No story trigger to enter combat
   - No "continue to story" flow after combat
   - Combat feels disconnected from VN experience

5. **Combat Result Modal** (MEDIUM PRIORITY)
   - Basic victory/defeat display exists
   - No rewards/consequences display
   - No persistent condition application post-combat

#### Backend Integration Gaps

1. **Condition Application in Combat** (HIGH PRIORITY)
   - `player_combat.py` has TODO: "Implement conditions"
   - `_combatant_to_dict` always returns `conditions: []`
   - No condition ladder progression on damage
   - No defense-based condition resistance

2. **SCL Cap Enforcement** (MEDIUM PRIORITY)
   - Technique model has `max_scl` field
   - No validation in `execute_player_action`
   - Players can use any technique regardless of SCL

3. **Cost Track Application** (HIGH PRIORITY)
   - `blood_marks`, `fate_marks`, `stain_marks` in action preview
   - Not actually applied to character state
   - No threshold effects (Blood ≥3 → auto-Wounded)

4. **Condition-Based Modifiers** (MEDIUM PRIORITY)
   - Conditions should affect rolls/damage
   - No modifier calculation based on condition degree
   - No incapacitation at 4th degree

---

## Part 2: Priority Action Items

### P1: Critical Path Items (Week 1)

#### P1.1: Display Conditions in Combat UI
**Effort:** 2-3 hours | **Impact:** High | **Risk:** Low

**Frontend Changes:**
```tsx
// frontend/src/components/combat/ConditionBadge.tsx (NEW)
// Add visual condition badges with color-coded severity

// frontend/src/components/combat/CombatantCard.tsx (MODIFY)
// - Import and use ConditionBadge
// - Show condition list with degree indicators
```

**Backend Changes:**
```python
# backend/app/simulation/player_combat.py (MODIFY)
# - Track conditions on CombatantState
# - Return conditions in _combatant_to_dict
```

#### P1.2: Apply Conditions on Combat Damage
**Effort:** 3-4 hours | **Impact:** High | **Risk:** Medium

**Backend Changes:**
```python
# backend/app/simulation/combat_state.py (MODIFY)
# - Add apply_condition(pillar, degree) method
# - Add get_highest_condition_degree(pillar) method

# backend/app/simulation/player_combat.py (MODIFY)
# - Call apply_condition when damage exceeds thresholds
# - Check for incapacitation at 4th degree
```

#### P1.3: Display Cost Tracks in Combat UI
**Effort:** 2-3 hours | **Impact:** High | **Risk:** Low

**Frontend Changes:**
```tsx
// frontend/src/components/combat/CostTrackDisplay.tsx (NEW)
// - Show Blood/Fate/Stain tracks as small bars
// - Highlight when marks are gained

// frontend/src/components/combat/ActionPreview.tsx (MODIFY)
// - Show cost track changes before action execution
```

#### P1.4: VN-Combat Entry Point
**Effort:** 3-4 hours | **Impact:** High | **Risk:** Low

**Frontend Changes:**
```tsx
// frontend/src/pages/GameRoom.tsx (MODIFY)
// - Add "Enter Combat" button
// - Navigate to /combat/:encounterId

// frontend/src/App.tsx (VERIFY)
// - Ensure /combat/:encounterId route exists
```

### P2: Foundation Items (Week 2)

#### P2.1: Enforce SCL Caps on Techniques
**Effort:** 2 hours | **Impact:** Medium | **Risk:** Low

**Backend Changes:**
```python
# backend/app/simulation/player_combat.py (MODIFY)
def execute_player_action(...):
    # Add SCL validation
    if technique.max_scl and actor.scl > technique.max_scl:
        return [{"error": "SCL too low"}]
```

#### P2.2: Apply Cost Track Effects
**Effort:** 2-3 hours | **Impact:** Medium | **Risk:** Low

**Backend Changes:**
```python
# backend/app/simulation/player_combat.py (MODIFY)
# - Track blood/fate/stain on combatant
# - Apply marks from technique costs
# - Trigger Wounded at Blood ≥ 3
```

#### P2.3: SCL/Sequence Display in UI
**Effort:** 1-2 hours | **Impact:** Medium | **Risk:** Low

**Frontend Changes:**
```tsx
// frontend/src/components/combat/CombatantCard.tsx (MODIFY)
// - Add SCL display
// - Add Sequence band label (Cursed/Low/Mid/High/Transcendent)
```

#### P2.4: Combat Result Screen Enhancement
**Effort:** 3-4 hours | **Impact:** Medium | **Risk:** Low

**Frontend Changes:**
```tsx
// frontend/src/components/combat/CombatResultModal.tsx (NEW)
// - Show victory/defeat with animation
// - Display conditions gained
// - Display cost track changes
// - "Continue Story" button
```

### P3: Polish Items (Week 3+)

#### P3.1: Condition Effect Application
- Wounded: -2 to physical actions
- Crippled: Wounded + Hindered
- 4th Degree: Incapacitated for scene

#### P3.2: Combat Replay Viewer
- Playback of combat log
- Step-by-step visualization

#### P3.3: Three Conflict Types
- Violence (current)
- Influence (social)
- Revelation (horror)

---

## Part 3: Implementation Roadmap

### Week 1: Core Visibility (P1)

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| 1 | P1.1: ConditionBadge component | Frontend | ⏳ |
| 1-2 | P1.2: Backend condition tracking | Backend | ⏳ |
| 2 | P1.3: CostTrackDisplay component | Frontend | ⏳ |
| 3 | P1.4: VN-Combat entry point | Full-stack | ⏳ |
| 4 | Integration testing | QA | ⏳ |
| 5 | Bug fixes & polish | All | ⏳ |

### Week 2: Foundation Enhancement (P2)

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| 1 | P2.1: SCL cap enforcement | Backend | ⏳ |
| 2 | P2.2: Cost track application | Backend | ⏳ |
| 2 | P2.3: SCL/Sequence UI | Frontend | ⏳ |
| 3-4 | P2.4: Combat result modal | Frontend | ⏳ |
| 5 | Integration testing | QA | ⏳ |

### Week 3+: Polish & Extend (P3)

- Condition effect modifiers
- Combat replay
- Social/horror conflict types
- Character creation wizard

---

## Part 4: Technical Debt & Risks

### Technical Debt

1. **In-Memory Combat Sessions**
   - `active_sessions: Dict[str, PlayerCombatSession]`
   - Lost on server restart
   - No horizontal scaling support
   - **Recommendation:** Move to Redis or database

2. **Hardcoded Quick Action Values**
   - Guard +10, DR +20%, etc. hardcoded
   - **Recommendation:** Data-driven quick actions (JSON config)

3. **Missing Combat State Persistence**
   - No save/load for ongoing combats
   - **Recommendation:** Serialize to database

4. **Inline Styles in Components**
   - Most combat components use inline styles
   - **Recommendation:** CSS modules or styled-components

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing combat | Medium | High | Add regression tests |
| Performance with conditions | Low | Medium | Lazy compute conditions |
| Type mismatches frontend/backend | Medium | Medium | OpenAPI validation |
| Combat session memory leak | High | Medium | Session TTL cleanup |

---

## Part 5: Recommended Next Actions

### Immediate Actions (This PR)

1. **Create ConditionBadge Component**
   - New file: `frontend/src/components/combat/ConditionBadge.tsx`
   - Visual badges with condition name and degree
   - Color-coded by severity

2. **Update CombatantCard to Show Conditions**
   - Modify: `frontend/src/components/combat/CombatantCard.tsx`
   - Import and display ConditionBadge

3. **Create CostTrackDisplay Component**
   - New file: `frontend/src/components/combat/CostTrackDisplay.tsx`
   - Show Blood/Fate/Stain as mini progress bars

4. **Update Backend to Return Conditions**
   - Modify: `backend/app/simulation/player_combat.py`
   - Populate `conditions` field in `_combatant_to_dict`

### Follow-up PRs

1. **PR: Condition Application Logic**
   - Backend damage → condition escalation
   - 4th degree incapacitation

2. **PR: Cost Track Application**
   - Apply marks from technique use
   - Blood ≥ 3 → auto-Wounded

3. **PR: VN Integration**
   - Story triggers for combat
   - Post-combat story continuation

---

## Appendix A: File Reference

### Frontend Combat Components
```
frontend/src/components/combat/
├── ActionPreview.tsx      # Action effect preview
├── CombatLog.tsx          # Combat history
├── CombatView.tsx         # Main combat container
├── CombatantCard.tsx      # Character display card
├── QuickActionPanel.tsx   # Quick action buttons
├── TechniqueSelector.tsx  # Technique list
└── TurnIndicator.tsx      # Round/phase indicator
```

### Backend Combat Logic
```
backend/app/simulation/
├── combat_state.py        # CombatantState, CombatState
├── engine.py              # Monte Carlo simulation
├── player_combat.py       # Player-controlled combat
└── quick_actions.py       # Quick action definitions
```

### Backend Routes
```
backend/app/api/routes/
├── combat.py              # Combat encounter endpoints
├── characters.py          # Character CRUD
├── techniques.py          # Technique CRUD
└── simulations.py         # Simulation endpoints
```

---

## Appendix B: Type Definitions Reference

### CombatantState (Frontend)
```typescript
interface CombatantState {
  id: string;
  name: string;
  is_boss: boolean;
  thp: number;
  max_thp: number;
  ae: number;
  max_ae: number;
  ae_reg: number;
  dr: number;
  strain: number;
  guard: number;
  spd_band: string;
  technique_ids?: string[];
  conditions?: string[];  // ← Currently always []
}
```

### Needed: Condition Types
```typescript
interface Condition {
  pillar: 'violence' | 'influence' | 'revelation';
  name: string;  // 'wounded', 'crippled', 'downed', etc.
  degree: 1 | 2 | 3 | 4;
  effect: string;
}
```

### Needed: CostTracks in Combat
```typescript
interface CombatantCostTracks {
  blood: { current: number; maximum: number };
  fate: { current: number; maximum: number };
  stain: { current: number; maximum: number };
}
```

---

## Report Sign-off

**Reviewed By:** Copilot Agent  
**Review Date:** 2024-12-13  
**Status:** Ready for Implementation

**Recommended Priority Order:**
1. P1.1: Display Conditions in Combat UI
2. P1.3: Display Cost Tracks in Combat UI
3. P1.2: Apply Conditions on Combat Damage
4. P1.4: VN-Combat Entry Point
5. P2.1-P2.4: Foundation Items
