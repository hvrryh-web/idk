# Combat Engine Implementation Roadmap

**Version**: 1.0.0  
**Date**: 2025-12-12  
**Status**: Planning Phase  

---

## Overview

This roadmap outlines the phased implementation of the turn-based combat engine for the Wuxiaxian VN + TTRPG hybrid. Each phase builds on the previous one, with clear acceptance criteria and risk mitigations.

---

## Phase 0: Foundations ✅

**Status**: Complete  
**Duration**: Initial setup  
**Goal**: Establish core combat engine infrastructure

### Scope

- [x] Seeded RNG implementation (Mulberry32)
- [x] Combat state model and type definitions
- [x] Event type definitions for event-sourcing
- [x] State reducer for immutable state transitions
- [x] Combat rules modules:
  - [x] Bonus composition (ADR-0003)
  - [x] Hit/crit resolution
  - [x] Damage calculation
  - [x] Condition management
- [x] VN ↔ Combat integration bridge
- [x] Data schemas (techniques, units, encounters)

### Files Created

```
frontend/src/combat/
├── engine/
│   ├── index.ts              ✅ Main exports
│   ├── combatState.ts        ✅ State interfaces
│   ├── events.ts             ✅ Event types
│   ├── reducer.ts            ✅ State reducer
│   ├── rng.ts                ✅ Seeded RNG
│   └── rules/
│       ├── bonus.ts          ✅ ADR-0003 bonus composition
│       ├── hit.ts            ✅ Hit/crit logic
│       ├── damage.ts         ✅ Damage calculation
│       └── conditions.ts     ✅ Condition management
├── data/
│   ├── techniques.json       ✅ Technique definitions
│   ├── encounters.json       ✅ Encounter definitions
│   └── units.json            ✅ Unit templates
└── integration/
    └── battleBridge.ts       ✅ VN integration
```

### Acceptance Criteria

- [x] RNG produces deterministic results from seed
- [x] State transitions are immutable
- [x] Events can be replayed to reconstruct state
- [x] Bonus calculation follows ADR-0003 formula

### Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Type complexity | Keep interfaces simple, use discriminated unions |
| Performance | Use immutable updates, avoid deep cloning |

---

## Phase 1: MVP Battle Loop

**Status**: Not Started  
**Duration**: ~2-3 days  
**Goal**: Complete player action → enemy AI → resolution loop

### Scope

- [ ] Combat flow controller (round/phase management)
- [ ] Player turn handler (wait for action input)
- [ ] Enemy AI (simple priority targeting)
- [ ] Action resolution (attack, technique, defend)
- [ ] Quick action execution
- [ ] Victory/defeat detection
- [ ] Return outcome to VN

### Files to Create/Modify

```
frontend/src/combat/
├── engine/
│   ├── combatController.ts   NEW: Flow control
│   ├── actionResolver.ts     NEW: Action execution
│   └── victoryChecker.ts     NEW: Victory detection
├── ai/
│   └── enemyAI.ts            NEW: Simple AI
└── integration/
    └── battleBridge.ts       MODIFY: Add run loop
```

### Key Implementation

#### Combat Controller

```typescript
class CombatController {
  async runCombat(): Promise<BattleResult> {
    while (!this.isComplete()) {
      await this.runRound();
    }
    return this.getResult();
  }

  async runRound(): Promise<void> {
    this.startRound();
    await this.runPhase('Quick1');
    await this.runPhase('Major');
    await this.runPhase('Quick2');
    this.endRound();
  }

  async runPhase(phase: CombatPhase): Promise<void> {
    for (const unitId of this.getPhaseUnits(phase)) {
      await this.runTurn(unitId, phase);
    }
  }
}
```

#### Enemy AI

```typescript
function selectEnemyAction(
  unit: CombatUnit,
  state: CombatState,
  aiProfile: string
): Action {
  // Simple priority: attack lowest HP player unit
  const targets = getValidTargets(state, unit);
  const lowestHpTarget = targets.sort((a, b) => a.thp - b.thp)[0];
  
  return {
    type: 'attack',
    actorId: unit.id,
    targetId: lowestHpTarget.id,
  };
}
```

### Acceptance Criteria

- [ ] Combat progresses through phases automatically
- [ ] Player can select action during their turn
- [ ] Enemy AI selects and executes actions
- [ ] Combat ends when victory condition met
- [ ] Result returned to bridge

### Testing Strategy

```typescript
describe('Combat Controller', () => {
  it('completes combat with deterministic outcome', () => {
    const seed = 12345;
    const result1 = runTestCombat(seed);
    const result2 = runTestCombat(seed);
    expect(result1).toEqual(result2);
  });
});
```

### Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Infinite loops | Add max round limit (100 rounds) |
| Async complexity | Use promise-based flow control |
| UI blocking | Consider web workers for AI |

---

## Phase 2: UI Completion

**Status**: Not Started  
**Duration**: ~3-4 days  
**Goal**: Complete battle UI with all components

### Scope

- [ ] Enhance `CombatView.tsx` with new layout
- [ ] Add `ForecastPanel.tsx` (pre-action preview)
- [ ] Add `StatusIcons.tsx` (condition display)
- [ ] Add `ResultsModal.tsx` (victory/defeat)
- [ ] Combat log improvements
- [ ] Accessibility (keyboard navigation)
- [ ] Mobile responsive layout

### Files to Create/Modify

```
frontend/src/components/combat/
├── CombatView.tsx            MODIFY: New layout
├── ForecastPanel.tsx         NEW: Action preview
├── StatusIcons.tsx           NEW: Condition icons
├── ResultsModal.tsx          NEW: Combat result
├── CombatView.module.css     NEW: Scoped styles
└── components/
    └── ResourceBar.tsx       NEW: Reusable bar
```

### Acceptance Criteria

- [ ] Forecast panel shows hit%, damage, crit%
- [ ] Status icons display active conditions
- [ ] Results modal shows victory/defeat with rewards
- [ ] Full keyboard navigation works
- [ ] Layout works on mobile (320px minimum)
- [ ] Respects `prefers-reduced-motion`

### Accessibility Checklist

- [ ] All buttons focusable via Tab
- [ ] Action selection with 1-5 number keys
- [ ] Target selection with arrow keys
- [ ] Escape to cancel
- [ ] Live region for phase announcements
- [ ] ARIA labels on resource bars

### Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Layout complexity | Use CSS Grid for responsive |
| Animation performance | CSS transitions only, no JS |
| Accessibility gaps | Audit with axe-core |

---

## Phase 3: Content Tools

**Status**: Not Started  
**Duration**: ~2 days  
**Goal**: Enable content authoring and scripting

### Scope

- [ ] Encounter authoring conventions documentation
- [ ] Technique authoring guide
- [ ] VN script hooks for mid-battle events
- [ ] Encounter validation tooling
- [ ] Debug mode for testing

### Deliverables

1. **Authoring Guide** (`docs/combat_authoring_guide.md`)
   - JSON schema documentation
   - Example encounters
   - Best practices

2. **Script Hooks**
   ```typescript
   // In VN scene
   const result = await startBattle({
     encounterId: 'boss_fight',
     onScriptTrigger: (trigger, data) => {
       if (trigger === 'boss_phase_2') {
         showDialogue('The boss transforms!');
       }
     }
   });
   ```

3. **Debug Mode**
   - View full event log
   - Step through events
   - Modify state mid-combat
   - RNG seed display

### Acceptance Criteria

- [ ] Authors can create encounters from JSON only
- [ ] Script triggers work during combat
- [ ] Debug panel shows all combat info
- [ ] Validation catches schema errors

### Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Schema drift | Use JSON Schema validation |
| Trigger timing | Clear event ordering rules |

---

## Phase 4: Advanced Mechanics (Optional)

**Status**: Not Started  
**Duration**: ~5+ days  
**Goal**: Enhanced tactical depth

### Scope

- [ ] Initiative system upgrade (per-unit ordering)
- [ ] Formations (position-based bonuses)
- [ ] Multi-effect techniques
- [ ] Boss phases (multi-stage bosses)
- [ ] Buff/debuff stacking rules
- [ ] Environmental effects

### Implementation Priority

1. **Boss Phases** (High - needed for boss fights)
   - Health threshold triggers
   - Ability unlocks
   - Phase transition events

2. **Buff/Debuff Stacking** (Medium - needed for build variety)
   - Same-source rules
   - Different-source rules
   - Duration management

3. **Initiative System** (Low - adds tactical depth)
   - Per-unit speed ordering
   - Speed modifiers
   - Interrupt actions

4. **Formations** (Low - optional tactical layer)
   - Front/back row
   - Position bonuses
   - Movement costs

### Acceptance Criteria

- [ ] Bosses transition between phases
- [ ] Buffs stack correctly per rules
- [ ] Initiative creates meaningful choices
- [ ] Formations affect targeting

### Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Scope creep | Clear feature boundaries |
| Complexity explosion | Simple rules, no exceptions |
| Balance issues | Playtest extensively |

---

## Test Battle Entry Point

**Location**: `/combat/test_battle`

To add a "Test Battle" menu option:

### Option 1: Add Route (Recommended)

In `frontend/src/App.tsx`:

```typescript
// Import test battle component
import TestBattle from './pages/TestBattle';

// Add route
<Route path="/combat/test" element={<TestBattle />} />
```

Create `frontend/src/pages/TestBattle.tsx`:

```typescript
import { useNavigate } from 'react-router-dom';
import { createTestEncounter, startBattle } from '../combat/integration/battleBridge';

export default function TestBattle() {
  const navigate = useNavigate();

  const handleStartBattle = async () => {
    const options = createTestEncounter();
    // Navigate to combat view with encounter
    navigate(`/combat/${options.encounterId}`);
  };

  return (
    <div style={{ padding: '24px', textAlign: 'center' }}>
      <h1>⚔️ Test Battle</h1>
      <p>Start a test combat encounter to verify the combat engine.</p>
      <button onClick={handleStartBattle} style={{ padding: '16px 32px', fontSize: '1.2em' }}>
        Start Test Battle
      </button>
    </div>
  );
}
```

### Option 2: Add to Existing Menu

In `frontend/src/pages/GameRoom.tsx` (or main menu):

```typescript
<Link to="/combat/test_battle">⚔️ Test Battle</Link>
```

---

## Summary: File-by-File Changes

### Created in Phase 0

| File | Purpose |
|------|---------|
| `docs/adr/ADR-0003-bonus-composition-contest-roles.md` | ADR-0003 documentation |
| `COMBAT_INTEGRATION_AUDIT.md` | Repo audit findings |
| `docs/combat_engine_spec.md` | Engine specification |
| `docs/battle_ui_spec.md` | UI specification |
| `docs/combat_roadmap.md` | This roadmap |
| `frontend/src/combat/engine/rng.ts` | Seeded RNG |
| `frontend/src/combat/engine/combatState.ts` | State types |
| `frontend/src/combat/engine/events.ts` | Event types |
| `frontend/src/combat/engine/reducer.ts` | State reducer |
| `frontend/src/combat/engine/index.ts` | Module exports |
| `frontend/src/combat/engine/rules/bonus.ts` | ADR-0003 bonus |
| `frontend/src/combat/engine/rules/hit.ts` | Hit/crit logic |
| `frontend/src/combat/engine/rules/damage.ts` | Damage calc |
| `frontend/src/combat/engine/rules/conditions.ts` | Conditions |
| `frontend/src/combat/integration/battleBridge.ts` | VN bridge |
| `frontend/src/combat/data/techniques.json` | Technique data |
| `frontend/src/combat/data/encounters.json` | Encounter data |
| `frontend/src/combat/data/units.json` | Unit templates |

### To Create in Later Phases

| Phase | Files |
|-------|-------|
| 1 | `combatController.ts`, `actionResolver.ts`, `enemyAI.ts` |
| 2 | `ForecastPanel.tsx`, `StatusIcons.tsx`, `ResultsModal.tsx` |
| 3 | `docs/combat_authoring_guide.md`, debug tools |
| 4 | Phase triggers, formation system |

---

## Next Recommended Steps

1. **Immediate**: Add unit tests for RNG and reducer
2. **Short-term**: Implement Phase 1 combat loop
3. **Medium-term**: Complete Phase 2 UI
4. **Long-term**: Content tools and advanced mechanics

### Quick Start Commands

```bash
# Run frontend dev server
cd frontend && npm run dev

# Run tests (when added)
cd frontend && npm test

# Type check
cd frontend && npx tsc --noEmit
```

---

## Appendix: Related Documents

- [ADR-0003: Bonus Composition and Contest Roles](./adr/ADR-0003-bonus-composition-contest-roles.md)
- [Combat Engine Spec](./combat_engine_spec.md)
- [Battle UI Spec](./battle_ui_spec.md)
- [Combat UI Design (existing)](./wuxiaxian-reference/COMBAT_UI_DESIGN.md)
- [Combat UI UX Flow (existing)](./COMBAT_UI_UX_FLOW.md)
- [SRD Unified](./wuxiaxian-reference/SRD_UNIFIED.md)
