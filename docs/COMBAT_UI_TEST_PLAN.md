# Combat UI Test Plan

## Manual Test Checklist

### Test 1: Combat Initialization ✓
**Objective**: Verify combat view loads correctly

**Steps**:
1. Navigate to `/combat/:encounterId` with valid encounter ID
2. Observe loading state
3. Wait for combat state to load

**Expected Results**:
- Loading indicator displays
- Combat view appears with all components
- Character cards show on both sides (party left, enemies right)
- Turn indicator shows "Round 1"
- No console errors

**Pass Criteria**: All character data displays correctly within 2 seconds

---

### Test 2: Resource Bar Display ✓
**Objective**: Verify resource bars accurately reflect character state

**Steps**:
1. Load combat view
2. Inspect each character card
3. Verify resource bar percentages match actual values

**Expected Results**:
- THP bar: Green, shows X/Y format
- AE bar: Blue, shows X/Y format
- Strain bar: Yellow/Red, shows X/10 format
- Guard bar: Gray (if present)
- Bar width matches percentage (e.g., 75/100 THP = 75% width)

**Pass Criteria**: All bars display correctly, no overlaps or visual glitches

---

### Test 3: Action Selection with Cost Preview ✓
**Objective**: Test technique selection and cost display

**Steps**:
1. Start player turn (Major Action phase)
2. View available techniques
3. Hover over each technique
4. Note cost previews

**Expected Results**:
- Affordable techniques marked with green ✓
- Unaffordable techniques grayed out with red ✗
- Cost preview shows:
  - AE cost
  - Self-strain
  - Estimated damage
  - Cost track warnings (Blood/Fate/Stain)
- Hover shows tooltip with full details

**Pass Criteria**: Cost calculations accurate, UI clear and readable

---

### Test 4: Target Selection ✓
**Objective**: Verify targeting mode works correctly

**Steps**:
1. Select a technique that requires a target
2. Enter targeting mode
3. Observe enemy highlighting
4. Click valid target
5. Test "Cancel" button

**Expected Results**:
- Valid targets highlighted with glow
- Invalid targets dimmed
- Cursor changes to crosshair
- Clicking valid target executes action
- Cancel button returns to action selection

**Pass Criteria**: Targeting intuitive, no accidental clicks

---

### Test 5: Action Execution and Feedback ✓
**Objective**: Test technique execution and UI updates

**Steps**:
1. Select technique and target
2. Confirm action
3. Observe feedback

**Expected Results**:
- API call succeeds (check network tab)
- Combat log entry appears
- Resource bars update smoothly
- Damage numbers accurate
- Animation/flash effect on cards (optional)
- Updated combat state reflects action

**Pass Criteria**: All UI elements update within 1 second, no errors

---

### Test 6: AE Regeneration at Round End ✓
**Objective**: Verify end-of-round processing

**Steps**:
1. Complete a full round (all characters act)
2. Observe end-of-round updates

**Expected Results**:
- Round number increments
- AE regenerates for all living characters
- Strain persists
- Temporary modifiers cleared
- Combat log shows "Round X begins"

**Pass Criteria**: AE values increase by ae_reg amount, round transitions smoothly

---

## Unit Test Cases

### Frontend Unit Tests

#### Test: CombatView Component Rendering
**File**: `frontend/src/test/combat/CombatView.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CombatView from '../../components/combat/CombatView';

describe('CombatView', () => {
  it('renders loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/combat/test-id']}>
        <CombatView />
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading combat/i)).toBeInTheDocument();
  });

  it('displays combatant cards when loaded', async () => {
    // Mock API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          party: [{ id: '1', name: 'Wei Lin', thp: 100, max_thp: 100 }],
          enemies: [{ id: '2', name: 'Sect Elder', thp: 150, max_thp: 150 }],
          round: 1,
          phase: 'Major'
        })
      })
    );

    render(
      <MemoryRouter initialEntries={['/combat/test-id']}>
        <CombatView />
      </MemoryRouter>
    );

    expect(await screen.findByText('Wei Lin')).toBeInTheDocument();
    expect(await screen.findByText('Sect Elder')).toBeInTheDocument();
  });
});
```

**Assertion**: Component renders without errors and displays combat state

---

#### Test: TechniqueSelector Disables Unaffordable Techniques
**File**: `frontend/src/test/combat/TechniqueSelector.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import TechniqueSelector from '../../components/combat/TechniqueSelector';

describe('TechniqueSelector', () => {
  it('disables techniques when AE insufficient', () => {
    const techniques = [
      { id: '1', name: 'Cheap Move', ae_cost: 5, base_damage: 20 },
      { id: '2', name: 'Expensive Move', ae_cost: 15, base_damage: 50 }
    ];

    render(
      <TechniqueSelector
        techniques={techniques}
        currentAE={10}
        onSelectTechnique={jest.fn()}
      />
    );

    const cheapButton = screen.getByText(/Cheap Move/i).closest('button');
    const expensiveButton = screen.getByText(/Expensive Move/i).closest('button');

    expect(cheapButton).not.toBeDisabled();
    expect(expensiveButton).toBeDisabled();
  });
});
```

**Assertion**: Techniques with cost > current AE are disabled

---

### Backend Unit Tests

#### Test: Player Action Execution
**File**: `backend/tests/test_player_combat.py`

```python
import pytest
from app.simulation.player_combat import execute_player_action
from app.simulation.combat_state import CombatState, CombatantState
from uuid import uuid4

def test_execute_technique_reduces_ae():
    """Test that executing a technique reduces attacker AE."""
    attacker = CombatantState(
        id=uuid4(),
        name="Wei Lin",
        is_boss=False,
        thp=100,
        max_thp=100,
        ae=25,
        max_ae=25,
        ae_reg=2,
        dr=0.2,
        strain=0,
        guard=0,
        spd_band="Fast"
    )
    
    target = CombatantState(
        id=uuid4(),
        name="Enemy",
        is_boss=True,
        thp=100,
        max_thp=100,
        ae=20,
        max_ae=20,
        ae_reg=2,
        dr=0.3,
        strain=0,
        guard=0,
        spd_band="Normal"
    )
    
    state = CombatState(round_number=1, party=[attacker], boss=target)
    
    # Technique with 8 AE cost
    technique_data = {
        'ae_cost': 8,
        'base_damage': 35,
        'self_strain': 1,
        'damage_routing': 'THP'
    }
    
    execute_player_action(attacker, target, technique_data, state)
    
    assert attacker.ae == 17  # 25 - 8
    assert attacker.strain == 1  # self-strain applied
    assert target.thp < 100  # damage dealt
```

**Assertion**: Action execution correctly updates combat state

---

#### Test: AE Regeneration
**File**: `backend/tests/test_combat_state.py`

```python
def test_ae_regeneration():
    """Test that AE regenerates at end of round."""
    combatant = CombatantState(
        id=uuid4(),
        name="Test",
        is_boss=False,
        thp=100,
        max_thp=100,
        ae=10,
        max_ae=25,
        ae_reg=3,
        dr=0.2,
        strain=0,
        guard=0,
        spd_band="Normal"
    )
    
    combatant.regenerate_ae()
    
    assert combatant.ae == 13  # 10 + 3 (ae_reg)
```

**Assertion**: AE increases by ae_reg amount, capped at max_ae

---

## Integration Test Cases

### Test: Full Combat Flow
**File**: `backend/tests/test_combat_integration.py`

**Test Scenario**: Complete a full combat from start to victory

```python
@pytest.mark.integration
async def test_full_combat_flow(client, test_db):
    """Test complete combat flow from creation to victory."""
    # 1. Create party character
    char_response = await client.post("/api/v1/characters", json={
        "name": "Test Hero",
        "thp": 100,
        "ae": 25,
        "ae_reg": 2,
        "dr": 0.2
    })
    char_id = char_response.json()["id"]
    
    # 2. Create boss template
    boss_response = await client.post("/api/v1/boss-templates", json={
        "name": "Test Boss",
        "thp": 80,
        "ae": 20,
        "ae_reg": 2,
        "dr": 0.1
    })
    boss_id = boss_response.json()["id"]
    
    # 3. Create combat encounter
    combat_response = await client.post("/api/v1/combat/encounters", json={
        "party_ids": [char_id],
        "enemy_ids": [boss_id],
        "enable_3_stage": False
    })
    encounter_id = combat_response.json()["encounter_id"]
    
    # 4. Execute actions until combat ends
    for _ in range(10):  # Max 10 rounds
        state_response = await client.get(f"/api/v1/combat/encounters/{encounter_id}")
        state = state_response.json()
        
        if state["combat_ended"]:
            break
        
        # Player action
        await client.post(f"/api/v1/combat/encounters/{encounter_id}/actions", json={
            "actor_id": char_id,
            "action_type": "technique",
            "technique_id": state["available_techniques"][0]["id"],
            "target_id": boss_id
        })
    
    # 5. Verify combat ended
    final_state = await client.get(f"/api/v1/combat/encounters/{encounter_id}")
    assert final_state.json()["combat_ended"] == True
```

**Assertion**: Combat progresses through all phases and ends correctly

---

## Performance Tests

### Test: Combat State Update Latency
**Objective**: Verify API response times are acceptable

**Method**: Measure API call durations

**Acceptance Criteria**:
- `GET /combat/encounters/{id}`: < 100ms
- `POST /combat/encounters/{id}/actions`: < 200ms
- `GET /combat/encounters/{id}/log`: < 50ms

---

### Test: Combat Log Scrolling
**Objective**: Ensure smooth scrolling with many log entries

**Method**: Generate 100+ combat log entries, test scroll performance

**Acceptance Criteria**:
- Smooth scrolling (60 FPS)
- Auto-scroll to latest entry works
- No memory leaks

---

## Regression Tests

### Test: Existing Simulation Endpoints Unaffected
**Objective**: Verify new combat UI doesn't break existing features

**Steps**:
1. Run existing simulation tests
2. Test Monte Carlo simulation endpoints
3. Verify character/technique CRUD operations

**Pass Criteria**: All existing tests pass, no regressions

---

## Test Execution Summary

**Before Release Checklist**:
- [ ] All manual tests pass (6/6)
- [ ] All unit tests pass (frontend + backend)
- [ ] Integration test passes
- [ ] Performance benchmarks met
- [ ] No regressions in existing features
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Responsive design testing (desktop only for alpha)

**Known Issues / Future Work**:
- Advanced animations not implemented (acceptable for MVP)
- WebSocket real-time updates (future enhancement)
- Condition tooltips (future enhancement)
- Combat replay viewer (future enhancement)
