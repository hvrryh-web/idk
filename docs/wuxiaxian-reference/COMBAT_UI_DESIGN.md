# Combat UI Design for Wuxiaxian VN + TTRPG Hybrid

## Overview

This document describes the combat UI layer that integrates the Wuxiaxian TTRPG combat engine with the Visual Novel interface. The design reuses existing VN components and patterns while adding tactical combat capabilities.

## Tech Stack Context

**Framework**: React 18 + TypeScript + Vite
**Routing**: React Router 6
**Styling**: Inline styles (currently) + CSS classes in `styles.css`
**State Management**: Local component state with useState hooks
**API Integration**: Centralized fetch functions in `frontend/src/api.ts`

## UX Flow: A Typical Combat Exchange

### Narrative Hook → Combat → Resolution

```
[Visual Novel Scene]
  ↓
  Story decision point: "Duel the Sect Elder?"
  ↓
[Transition to Combat Mode]
  ↓
  Combat UI loads with:
  - Player character(s) on left
  - Enemy character(s) on right
  - Resource bars visible
  ↓
[Turn/Phase Loop]
  ↓
  Phase Indicator: "Stage 1 - Quick Actions (Fast SPD)"
  ↓
  Action Selection:
  - Quick Actions: [Guard Shift] [Dodge] [Brace] [AE Pulse] [Strain Vent] [Stance Switch] [Counter Prep]
  - Or: "Skip to Major Action"
  ↓
  Player selects action → Animation/feedback
  ↓
  Phase Indicator: "Stage 2 - Major Actions"
  ↓
  Action Selection:
  - Techniques: [Gu Fangs (8 AE)] [Swarming Dissection (10 AE)] [Insight of Hive (12 AE)]
  - Quick Actions: [Same list as Stage 1]
  - Item/Special: [Meditation] [Retreat]
  ↓
  Target Selection:
  - Click enemy portrait to target
  - Highlight valid targets
  - Show hit chance estimate
  ↓
  Execute action → Combat log + animations
  ↓
  Enemy turn(s) → Combat log + animations
  ↓
  End of Round:
  - AE regenerates
  - Strain checked
  - Conditions updated
  ↓
  [Repeat until victory/defeat/timeout]
  ↓
[Combat Resolution Screen]
  - Victory: Show rewards, condition consequences
  - Defeat: Show party wipe state, narrative consequences
  ↓
[Return to Visual Novel]
  - Continue story with combat results
  - Applied conditions persist
  - Cost tracks marked
```

## Component Breakdown

### Existing Components to Reuse

From `frontend/src/`:

1. **CharacterDetail.tsx** - Base pattern for displaying character info
   - Already shows character name, type, stats
   - Can be adapted for combat portraits

2. **Routing/Navigation** - React Router setup in App.tsx
   - Add combat route: `/combat/:encounter_id`
   - Support pre-configured or dynamic encounters

3. **API Client** - `api.ts` fetch functions
   - Extend with combat API calls
   - Add WebSocket support for real-time updates (future)

4. **Styling Patterns** - `styles.css`
   - Visual novel aesthetic established
   - Card-based layouts
   - Button styles

### New Components to Create

All in `frontend/src/components/combat/`:

#### 1. **CombatView.tsx** (Main Combat Container)

**Purpose**: Top-level combat page component

**Props**:
```typescript
interface CombatViewProps {
  encounterId?: string;  // Load from API
  party: Character[];    // Player characters
  enemies: Character[];  // Enemy characters
  onCombatEnd: (result: CombatResult) => void;
}
```

**Layout**:
```
┌──────────────────────────────────────────────────┐
│  Combat Encounter: "Duel at Crimson Pavilion"   │
├──────────────────────────────────────────────────┤
│                                                  │
│  [Party Side]          VS        [Enemy Side]   │
│  CombatantCard x N              CombatantCard x M│
│                                                  │
├──────────────────────────────────────────────────┤
│  Turn Indicator: "Round 3, Stage 2 - Major Actions"│
├──────────────────────────────────────────────────┤
│  Action Panel (if player turn)                   │
│  - TechniqueSelector                             │
│  - QuickActionPanel                              │
│  - ItemPanel                                     │
├──────────────────────────────────────────────────┤
│  Combat Log (scrollable)                         │
│  - Recent actions and outcomes                   │
└──────────────────────────────────────────────────┘
```

**State Management**:
```typescript
const [combatState, setCombatState] = useState<CombatState>();
const [currentPhase, setCurrentPhase] = useState<CombatPhase>();
const [selectedAction, setSelectedAction] = useState<Action | null>();
const [targetMode, setTargetMode] = useState<boolean>(false);
const [combatLog, setCombatLog] = useState<LogEntry[]>([]);
```

#### 2. **CombatantCard.tsx** (Character Portrait + Stats)

**Purpose**: Display combatant with real-time resource bars

**Props**:
```typescript
interface CombatantCardProps {
  combatant: CombatantState;
  isAlly: boolean;
  isActive: boolean;      // Is it this character's turn?
  isTargetable: boolean;  // Can this character be targeted?
  isSelected: boolean;    // Is this character selected as target?
  onSelect?: () => void;  // Click handler for targeting
}
```

**Visual Structure**:
```
┌─────────────────────────┐
│  [Portrait/Avatar]      │
│  Character Name         │
│  Sequence: Mid-Seq 6    │
├─────────────────────────┤
│  ████████░░ THP: 85/100 │ ← Green bar
│  ██████░░░░ AE:  15/25  │ ← Blue bar
│  ░░░░░░░░░░ Strain: 2/10│ ← Red/Yellow bar
│  ███░░░░░░░ Guard: 15   │ ← Gray bar
├─────────────────────────┤
│  SPD Band: Fast         │
│  Conditions: [Wounded]  │ ← Condition badges
└─────────────────────────┘
```

**Reuse Pattern**: Extend CharacterDetail.tsx with real-time updates

#### 3. **TechniqueSelector.tsx** (Technique List with AE Cost)

**Purpose**: Show available techniques, disable unaffordable ones

**Props**:
```typescript
interface TechniqueSelectorProps {
  techniques: Technique[];
  currentAE: number;
  onSelectTechnique: (techId: string) => void;
  disabled?: boolean;
}
```

**Visual Structure**:
```
┌────────────────────────────────────────┐
│  Available Techniques                  │
├────────────────────────────────────────┤
│  ✓ Gu Fangs                            │
│    [8 AE] THP Damage: 35               │
│    Click to use                        │
├────────────────────────────────────────┤
│  ✓ Swarming Dissection                 │
│    [10 AE] Wound → Cripple             │
│    Click to use                        │
├────────────────────────────────────────┤
│  ✗ Insight of Hive (Not enough AE)    │
│    [12 AE] Mind Debilitate             │
│    Grayed out                          │
└────────────────────────────────────────┘
```

**New Component**: No direct reuse, but follows TechniqueList.tsx pattern

#### 4. **QuickActionPanel.tsx** (7 Quick Action Buttons)

**Purpose**: Show quick action options, highlight available ones

**Props**:
```typescript
interface QuickActionPanelProps {
  combatant: CombatantState;
  phase: CombatPhase;  // Only show in Quick Action phases
  onSelectQuickAction: (action: QuickActionType) => void;
  disabled?: boolean;
}
```

**Visual Structure**:
```
┌──────────────────────────────────────────────────────────┐
│  Quick Actions (Available in Stage 1 & 3)               │
├──────────────────────────────────────────────────────────┤
│  [🛡️ Guard Shift]  [⚡ Dodge]  [🔰 Brace]  [⚡ AE Pulse] │
│  [💨 Strain Vent]  [🔄 Stance]  [⚔️ Counter Prep]       │
└──────────────────────────────────────────────────────────┘
```

**Behavior**:
- Highlight on hover with tooltip
- Show effect description
- Disable if not in Quick Action phase
- Gray out if not applicable (e.g., Guard Shift when Guard maxed)

**New Component**: Simple button grid with tooltips

#### 5. **TargetSelector.tsx** (Target Highlighting Overlay)

**Purpose**: Handle target selection logic, highlight valid targets

**Props**:
```typescript
interface TargetSelectorProps {
  combatants: CombatantState[];
  validTargets: string[];  // IDs of valid targets
  onSelectTarget: (targetId: string) => void;
  onCancel: () => void;
}
```

**Behavior**:
- Overlay on CombatantCards
- Highlight valid targets with glow effect
- Dim invalid targets
- Show "Cancel" button to exit targeting mode

**Implementation**: Renders as overlay, uses z-index to appear above cards

#### 6. **TurnIndicator.tsx** (Current Phase Display)

**Purpose**: Show whose turn it is and what phase

**Props**:
```typescript
interface TurnIndicatorProps {
  round: number;
  phase: CombatPhase;  // "Quick1" | "Major" | "Quick2"
  activeCharacter: string | null;  // Current actor's name
}
```

**Visual Structure**:
```
┌──────────────────────────────────────────────┐
│  Round 5 - Stage 2: Major Actions           │
│  Acting: Wei Lin (Player)                   │
└──────────────────────────────────────────────┘
```

**Style**: Banner at top of combat view, animated when phase changes

#### 7. **CombatLog.tsx** (Action History Feed)

**Purpose**: Scrollable log of combat actions and results

**Props**:
```typescript
interface CombatLogProps {
  entries: LogEntry[];
  maxHeight?: string;
}

interface LogEntry {
  timestamp: number;
  actor: string;
  action: string;
  target?: string;
  result: string;
  damage?: number;
  conditions?: string[];
}
```

**Visual Structure**:
```
┌──────────────────────────────────────────────┐
│  Combat Log                      [Clear]     │
├──────────────────────────────────────────────┤
│  > Wei Lin uses Gu Fangs on Sect Elder     │
│    Hit! 32 THP damage dealt.                 │
│    Sect Elder: 68/100 THP remaining          │
│                                              │
│  > Sect Elder uses Sky-Rending Palm         │
│    Critical! 45 THP damage + Wounded         │
│    Wei Lin: 55/100 THP, Condition: Wounded   │
│                                              │
│  > Round 5 begins. AE regenerated.           │
└──────────────────────────────────────────────┘
```

**Auto-scroll**: Latest entry always visible

#### 8. **CombatResultModal.tsx** (Victory/Defeat Screen)

**Purpose**: Show combat outcome and consequences

**Props**:
```typescript
interface CombatResultModalProps {
  result: "victory" | "defeat" | "timeout";
  rewards?: Reward[];
  consequences: Consequence[];
  onContinue: () => void;
}
```

**Visual Structure**:
```
┌──────────────────────────────────────────────┐
│         VICTORY                             │
│    The Sect Elder yields!                   │
├──────────────────────────────────────────────┤
│  Rewards:                                    │
│  - 500 XP                                    │
│  - Sect Elder's Token                       │
│                                              │
│  Consequences:                               │
│  - Wei Lin: Wounded (1st degree)            │
│  - Blood Track: +2 marks                    │
│                                              │
│  [Continue Story]                            │
└──────────────────────────────────────────────┘
```

**Modal Overlay**: Blocks entire screen, requires acknowledgment

## API Integration

### New Endpoints Needed

**In `backend/app/api/routes/combat.py`** (NEW FILE):

```python
# Create a player-controlled combat encounter
POST /api/v1/combat/encounters
{
  "party_ids": ["char-uuid-1", "char-uuid-2"],
  "enemy_ids": ["enemy-uuid-1"],
  "enable_3_stage": true
}
→ Returns encounter_id, initial combat state

# Get current combat state
GET /api/v1/combat/encounters/{encounter_id}
→ Returns full CombatState

# Execute a player action
POST /api/v1/combat/encounters/{encounter_id}/actions
{
  "actor_id": "char-uuid-1",
  "action_type": "technique",
  "technique_id": "tech-uuid",
  "target_id": "enemy-uuid-1"
}
→ Returns updated CombatState, combat log entries

# Execute a quick action
POST /api/v1/combat/encounters/{encounter_id}/quick-actions
{
  "actor_id": "char-uuid-1",
  "quick_action_type": "GUARD_SHIFT"
}
→ Returns updated CombatState

# End turn (triggers enemy AI)
POST /api/v1/combat/encounters/{encounter_id}/end-turn
→ Returns updated CombatState after all enemy actions

# Get combat log
GET /api/v1/combat/encounters/{encounter_id}/log
→ Returns array of LogEntry objects
```

### Frontend API Functions

**In `frontend/src/api.ts`**, add:

```typescript
export async function createCombatEncounter(
  partyIds: string[],
  enemyIds: string[],
  enable3Stage: boolean = true
): Promise<CombatEncounter> {
  const response = await fetch(`${API_BASE}/combat/encounters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      party_ids: partyIds,
      enemy_ids: enemyIds,
      enable_3_stage: enable3Stage
    })
  });
  return response.json();
}

export async function getCombatState(encounterId: string): Promise<CombatState> {
  const response = await fetch(`${API_BASE}/combat/encounters/${encounterId}`);
  return response.json();
}

export async function executeAction(
  encounterId: string,
  actorId: string,
  actionType: string,
  techniqueId?: string,
  targetId?: string
): Promise<CombatState> {
  const response = await fetch(
    `${API_BASE}/combat/encounters/${encounterId}/actions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actor_id: actorId,
        action_type: actionType,
        technique_id: techniqueId,
        target_id: targetId
      })
    }
  );
  return response.json();
}

// ... similar functions for quick actions, end turn, get log
```

## Implementation Plan

### Phase 1: Core Combat Display (High Priority)

**Files to Create:**
1. `frontend/src/components/combat/CombatView.tsx` - Main container
2. `frontend/src/components/combat/CombatantCard.tsx` - Character display
3. `frontend/src/components/combat/TurnIndicator.tsx` - Phase display
4. `frontend/src/components/combat/CombatLog.tsx` - Action history

**Files to Modify:**
1. `frontend/src/App.tsx` - Add route for `/combat/:encounterId`
2. `frontend/src/api.ts` - Add combat API functions
3. `frontend/src/types.ts` - Add CombatState, CombatPhase types

**Backend Changes:**
1. Create `backend/app/api/routes/combat.py` - Player combat endpoints
2. Create `backend/app/simulation/player_combat.py` - Player-controlled combat logic
3. Modify `backend/app/simulation/engine.py` - Extract reusable combat step functions

**Estimated Lines**: ~800 lines frontend, ~400 lines backend

### Phase 2: Action Selection (High Priority)

**Files to Create:**
1. `frontend/src/components/combat/TechniqueSelector.tsx` - Technique list
2. `frontend/src/components/combat/QuickActionPanel.tsx` - Quick actions
3. `frontend/src/components/combat/TargetSelector.tsx` - Target highlighting

**Files to Modify:**
1. `frontend/src/components/combat/CombatView.tsx` - Integrate selectors
2. `backend/app/simulation/player_combat.py` - Action execution logic

**Estimated Lines**: ~500 lines frontend, ~200 lines backend

### Phase 3: Combat Resolution & Polish (Medium Priority)

**Files to Create:**
1. `frontend/src/components/combat/CombatResultModal.tsx` - End screen
2. `frontend/src/components/combat/ConditionBadge.tsx` - Condition display
3. `frontend/src/components/combat/ResourceBar.tsx` - Reusable stat bar

**Files to Modify:**
1. `frontend/src/components/combat/CombatView.tsx` - Handle combat end
2. `frontend/src/pages/GameRoom.tsx` - Add "Start Combat" option
3. `frontend/src/styles.css` - Combat-specific styles

**Estimated Lines**: ~400 lines frontend, ~100 lines backend

### Phase 4: VN Integration (Medium Priority)

**Files to Modify:**
1. `frontend/src/pages/ProfileSheet.tsx` - Add "Enter Combat" button
2. `frontend/src/components/combat/CombatView.tsx` - Return to profile after combat
3. Create encounter configuration UI

**New Feature**: Story-driven combat triggers

**Estimated Lines**: ~200 lines

### Phase 5: Advanced Features (Low Priority)

**Future Enhancements:**
- WebSocket support for real-time updates
- Combat replay viewer
- Combat log export
- Spectator mode for AI simulations
- Condition tooltips with detailed effects
- Animation system for attacks
- Sound effects and music

## Styling Approach

### Option A: Extend Current Inline Styles (Quick)

**Pros**: No new dependencies, consistent with current code
**Cons**: Harder to maintain, less reusable

```typescript
const combatViewStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  height: '100vh',
  backgroundColor: '#1a1a1a',
  color: '#e0e0e0'
};
```

### Option B: CSS Modules (Recommended)

**Pros**: Scoped styles, better organization, good TypeScript support
**Cons**: Requires Vite configuration

```typescript
import styles from './CombatView.module.css';

<div className={styles.combatView}>
  {/* ... */}
</div>
```

### Option C: Styled-Components (Advanced)

**Pros**: Dynamic styling, theme support
**Cons**: New dependency, learning curve

```typescript
const CombatViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${props => props.theme.background};
`;
```

**Recommendation**: Use **CSS Modules** for new combat components, gradually migrate existing inline styles.

## Example Code Snippets

### CombatView.tsx (Skeleton)

```typescript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCombatState, executeAction } from '../api';
import CombatantCard from '../components/combat/CombatantCard';
import TurnIndicator from '../components/combat/TurnIndicator';
import TechniqueSelector from '../components/combat/TechniqueSelector';
import CombatLog from '../components/combat/CombatLog';
import type { CombatState, CombatPhase, LogEntry } from '../types';

export default function CombatView() {
  const { encounterId } = useParams<{ encounterId: string }>();
  const navigate = useNavigate();
  
  const [combatState, setCombatState] = useState<CombatState | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [targetMode, setTargetMode] = useState(false);
  const [combatLog, setCombatLog] = useState<LogEntry[]>([]);

  // Load combat state when encounter ID changes
  useEffect(() => {
    const loadCombatState = async () => {
      if (!encounterId) return;
      try {
        const state = await getCombatState(encounterId);
        setCombatState(state);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load combat state:', error);
      }
    };
    
    loadCombatState();
  }, [encounterId]); // Only re-run when encounterId changes

  const handleTechniqueSelect = (techId: string) => {
    setSelectedTechnique(techId);
    setTargetMode(true);
  };

  const handleTargetSelect = async (targetId: string) => {
    if (!encounterId || !selectedTechnique || !combatState) return;
    
    try {
      const updated = await executeAction(
        encounterId,
        combatState.activeCharacterId,
        'technique',
        selectedTechnique,
        targetId
      );
      setCombatState(updated);
      setSelectedTechnique(null);
      setTargetMode(false);
      
      // Add to combat log
      setCombatLog(prev => [...prev, {
        timestamp: Date.now(),
        actor: combatState.activeCharacterId,
        action: selectedTechnique,
        target: targetId,
        result: 'Hit!',  // Would come from API
        damage: 35       // Would come from API
      }]);
    } catch (error) {
      console.error('Failed to execute action:', error);
    }
  };

  if (loading) return <div>Loading combat...</div>;
  if (!combatState) return <div>Combat not found</div>;

  return (
    <div className="combat-view">
      <TurnIndicator
        round={combatState.round}
        phase={combatState.phase}
        activeCharacter={combatState.activeCharacterName}
      />
      
      <div className="combatants-container">
        <div className="party-side">
          {combatState.party.map(char => (
            <CombatantCard
              key={char.id}
              combatant={char}
              isAlly={true}
              isActive={char.id === combatState.activeCharacterId}
              isTargetable={false}
              isSelected={false}
            />
          ))}
        </div>
        
        <div className="enemy-side">
          {combatState.enemies.map(char => (
            <CombatantCard
              key={char.id}
              combatant={char}
              isAlly={false}
              isActive={false}
              isTargetable={targetMode}
              isSelected={false}
              onSelect={() => handleTargetSelect(char.id)}
            />
          ))}
        </div>
      </div>

      {combatState.isPlayerTurn && (
        <div className="action-panel">
          <TechniqueSelector
            techniques={combatState.availableTechniques}
            currentAE={combatState.activeCharacter.ae}
            onSelectTechnique={handleTechniqueSelect}
            disabled={targetMode}
          />
        </div>
      )}

      <CombatLog entries={combatLog} maxHeight="200px" />
    </div>
  );
}
```

### CombatantCard.tsx (Skeleton)

```typescript
import type { CombatantState } from '../types';

interface CombatantCardProps {
  combatant: CombatantState;
  isAlly: boolean;
  isActive: boolean;
  isTargetable: boolean;
  isSelected: boolean;
  onSelect?: () => void;
}

export default function CombatantCard({
  combatant,
  isAlly,
  isActive,
  isTargetable,
  isSelected,
  onSelect
}: CombatantCardProps) {
  const cardStyle = {
    border: isActive ? '3px solid gold' : '1px solid gray',
    opacity: isTargetable ? 1.0 : 0.7,
    cursor: isTargetable ? 'pointer' : 'default',
    padding: '10px',
    margin: '5px',
    backgroundColor: isSelected ? '#444' : '#222',
    borderRadius: '8px',
    width: '200px'
  };

  const thpPercent = (combatant.thp / combatant.max_thp) * 100;
  const aePercent = (combatant.ae / combatant.max_ae) * 100;

  return (
    <div style={cardStyle} onClick={isTargetable ? onSelect : undefined}>
      <h3>{combatant.name}</h3>
      <p>SCL {combatant.scl || '?'}</p>
      
      <div className="resource-bar">
        <div className="bar-label">THP: {combatant.thp}/{combatant.max_thp}</div>
        <div className="bar-container">
          <div
            className="bar-fill thp-bar"
            style={{ width: `${thpPercent}%` }}
          />
        </div>
      </div>

      <div className="resource-bar">
        <div className="bar-label">AE: {combatant.ae}/{combatant.max_ae}</div>
        <div className="bar-container">
          <div
            className="bar-fill ae-bar"
            style={{ width: `${aePercent}%` }}
          />
        </div>
      </div>

      {combatant.strain > 0 && (
        <div className="resource-bar">
          <div className="bar-label">Strain: {combatant.strain}/10</div>
          <div className="bar-container">
            <div
              className="bar-fill strain-bar"
              style={{ width: `${(combatant.strain / 10) * 100}%` }}
            />
          </div>
        </div>
      )}

      {combatant.guard > 0 && (
        <div className="resource-bar">
          <div className="bar-label">Guard: {combatant.guard}</div>
        </div>
      )}

      <div className="spd-band">SPD: {combatant.spd_band}</div>
      
      {combatant.conditions && combatant.conditions.length > 0 && (
        <div className="conditions">
          {combatant.conditions.map((cond, i) => (
            <span key={i} className="condition-badge">{cond}</span>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Summary

This combat UI design:
1. **Reuses existing patterns**: Extends CharacterDetail, follows React Router structure
2. **Integrates with VN flow**: Can be triggered from story points, returns to VN
3. **Visualizes core mechanics**: THP, AE, Strain, Guard, SPD bands, conditions
4. **Supports tactical play**: Action selection, target selection, quick actions
5. **Provides feedback**: Combat log, resource bars, condition badges
6. **Scales incrementally**: Can implement in phases, starting with core display

Next steps: Implement Phase 1 components and backend endpoints.
