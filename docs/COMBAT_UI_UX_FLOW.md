# Combat UI UX Flow

## Overview
This document details the step-by-step user experience for a typical combat exchange in the Wuxianxia TTRPG combat UI.

## Full UX Flow: One Combat Exchange

### Step 1: Combat Initialization (Entry Point)
**Trigger**: User navigates to `/combat/:encounterId` or clicks "Start Combat" from character profile

**UI State**:
- Loading indicator while fetching combat state from API
- Background fades to combat scene
- Title: "Combat Encounter: [Encounter Name]"

**Backend**: `GET /api/v1/combat/encounters/{encounterId}`

**Transition**: Once loaded → Step 2

---

### Step 2: Combat View Display (Initial State)
**Visual Layout**:
```
┌──────────────────────────────────────────────────┐
│  Combat: Duel at Crimson Pavilion               │
├──────────────────────────────────────────────────┤
│                                                  │
│  [Party Side]          VS        [Enemy Side]   │
│   Wei Lin (100/100 THP)         Sect Elder      │
│   AE: 25/25                     (150/150 THP)   │
│   Strain: 0/10                  AE: 30/30       │
│   SPD: Fast                     Strain: 0/10    │
│                                                  │
├──────────────────────────────────────────────────┤
│  Round 1 - Stage 1: Quick Actions (Fast SPD)    │
│  Acting: Wei Lin (Player)                       │
├──────────────────────────────────────────────────┤
│  [Quick Actions Available]                      │
│  [Skip to Major Action]                         │
└──────────────────────────────────────────────────┘
```

**User Actions**:
- View character stats and resources
- Read turn indicator
- Choose between Quick Action or skip

**Transition**: User selects action type → Step 3

---

### Step 3: Action Selection with Cost Preview
**Scenario A: Major Action Phase**

**Visual**:
```
┌──────────────────────────────────────────────────┐
│  Available Techniques                           │
├──────────────────────────────────────────────────┤
│  ✓ [Gu Fangs]                                   │
│     Cost: 8 AE | Self-Strain: +1                │
│     Damage: ~35 THP (after enemy DR 0.3)        │
│     Blood Track: +0 | Fate: +0 | Stain: +0     │
│                                                  │
│  ✓ [Swarming Dissection]                        │
│     Cost: 10 AE | Self-Strain: +2               │
│     Damage: 28 THP + Apply "Wounded"            │
│     Blood Track: +0 | Fate: +0 | Stain: +1     │
│     ⚠️ Stain Warning: This technique corrupts   │
│                                                  │
│  ✗ [Insight of Hive] (Not enough AE)           │
│     Cost: 12 AE | Self-Strain: +3               │
│     Effect: Mind Debilitate (Unavailable)       │
└──────────────────────────────────────────────────┘
```

**Resource Preview Features**:
- **Green ✓**: Technique is affordable (sufficient AE)
- **Red ✗**: Not affordable (insufficient AE, grayed out)
- **Cost Details**: Shows AE cost, self-strain, estimated damage
- **Cost Track Warnings**: Shows Blood/Fate/Stain marks
- **Special Warnings**: Color-coded alerts for high-cost actions

**Scenario B: Quick Action Phase**

**Visual**:
```
┌──────────────────────────────────────────────────┐
│  Quick Actions (No AE Cost)                     │
├──────────────────────────────────────────────────┤
│  [🛡️ Guard Shift]   - Increase Guard by 10     │
│  [⚡ Dodge]         - +20% DR this round        │
│  [🔰 Brace]         - +5 Guard + 10% DR         │
│  [⚡ AE Pulse]      - Gain +3 AE immediately    │
│  [💨 Strain Vent]   - Reduce Strain by 1       │
│  [🔄 Stance Switch] - Toggle Defensive/Offensive│
│  [⚔️ Counter Prep]  - Prepare counter-attack    │
└──────────────────────────────────────────────────┘
```

**User Actions**:
- Hover over actions to see tooltips
- Click to select action
- For techniques: Triggers target selection (→ Step 4)
- For quick actions: Execute immediately (→ Step 5)

**Transition**: User clicks technique → Step 4 (Target Selection)

---

### Step 4: Target Selection
**Visual State Change**:
```
┌──────────────────────────────────────────────────┐
│  SELECT TARGET for: Gu Fangs                    │
│  [Cancel]                                        │
├──────────────────────────────────────────────────┤
│                                                  │
│  [Dimmed Ally]          [GLOWING Enemy]         │
│   Wei Lin                Sect Elder ← Click!    │
│   (Not targetable)       (Valid target)         │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Targeting Mode**:
- Valid targets highlighted with glow effect
- Invalid targets dimmed and unclickable
- Cursor changes to crosshair over valid targets
- "Cancel" button to return to action selection
- Hit chance estimate shown on hover (optional)

**User Actions**:
- Click valid target to confirm
- Click "Cancel" to return to action selection

**Backend**: N/A (client-side only)

**Transition**: User clicks target → Step 5 (Execute)

---

### Step 5: Action Execution and Feedback
**API Call**: `POST /api/v1/combat/encounters/{encounterId}/actions`
```json
{
  "actor_id": "wei-lin-uuid",
  "action_type": "technique",
  "technique_id": "gu-fangs-uuid",
  "target_id": "sect-elder-uuid"
}
```

**Visual Feedback**:
```
┌──────────────────────────────────────────────────┐
│  [Animation: Attack Effect]                     │
│   Wei Lin → Gu Fangs → Sect Elder              │
├──────────────────────────────────────────────────┤
│  Combat Log:                                     │
│  > Wei Lin uses Gu Fangs on Sect Elder         │
│    Hit! 32 THP damage dealt.                    │
│    Sect Elder: 118/150 THP remaining            │
│                                                  │
│  [Updated Resource Bars]                        │
│   Wei Lin AE: 25 → 17 (spent 8)                │
│   Wei Lin Strain: 0 → 1 (self-strain)          │
│   Sect Elder THP: 150 → 118 (damaged)          │
└──────────────────────────────────────────────────┘
```

**UI Updates**:
1. Brief animation/flash on attacker and target cards
2. Combat log entry added (auto-scrolls to latest)
3. Resource bars update with smooth transitions
4. Numbers briefly highlight changed values

**Duration**: ~1-2 seconds for feedback

**Transition**: Automatically → Step 6 (Enemy Turn) or End of Round

---

### Step 6: Enemy Turn (Automated)
**Backend AI Decision**: Enemy selects technique and target

**Visual**:
```
┌──────────────────────────────────────────────────┐
│  Round 1 - Stage 2: Major Actions               │
│  Acting: Sect Elder (Enemy)                     │
├──────────────────────────────────────────────────┤
│  [Thinking indicator...]                        │
│   ↓                                              │
│  Enemy Action Executed:                         │
│   Sect Elder → Sky-Rending Palm → Wei Lin      │
│                                                  │
│  Combat Log:                                     │
│  > Sect Elder uses Sky-Rending Palm             │
│    Critical! 45 THP damage + Wounded condition  │
│    Wei Lin: 55/100 THP, Condition: Wounded      │
└──────────────────────────────────────────────────┘
```

**User Actions**: None (watch enemy turn)

**Duration**: 2-3 seconds per enemy action

**Transition**: End of round → Step 7 (Round End) or Step 2 (Next Turn)

---

### Step 7: End of Round Processing
**Automatic Updates**:
```
┌──────────────────────────────────────────────────┐
│  Round 1 Complete                               │
├──────────────────────────────────────────────────┤
│  End of Round Effects:                          │
│  - Wei Lin AE regenerated: 17 → 19 (+2)        │
│  - Sect Elder AE regenerated: 23 → 26 (+3)     │
│  - Strain checked: No lethal strain            │
│  - Conditions updated: Wounded persists         │
│                                                  │
│  Round 2 begins...                              │
└──────────────────────────────────────────────────┘
```

**Processing**:
- AE regeneration for all living combatants
- Strain checks (death if strain ≥ 10)
- Condition duration updates
- Temporary modifiers cleared

**Transition**: Automatically → Step 2 (Next Round) or Step 8 (Combat End)

---

### Step 8: Combat Resolution (Victory/Defeat)
**Victory Screen**:
```
┌──────────────────────────────────────────────────┐
│              ⚔️ VICTORY ⚔️                      │
│         The Sect Elder yields!                  │
├──────────────────────────────────────────────────┤
│  Combat Statistics:                             │
│  - Duration: 5 rounds                           │
│  - Damage Dealt: 187 THP                        │
│  - Wei Lin: 55/100 THP, Strain 3/10            │
│                                                  │
│  Consequences:                                   │
│  - Wei Lin: Wounded (1st degree)                │
│  - Blood Track: +2 marks (high strain)          │
│  - Stain Track: +1 mark (used corrupting tech) │
│                                                  │
│  [Continue Story]                               │
└──────────────────────────────────────────────────┘
```

**Defeat Screen**:
```
┌──────────────────────────────────────────────────┐
│              💀 DEFEAT 💀                       │
│          Party has fallen...                    │
├──────────────────────────────────────────────────┤
│  Combat Statistics:                             │
│  - Duration: 8 rounds                           │
│  - Wei Lin: 0/100 THP (Unconscious)            │
│                                                  │
│  Consequences:                                   │
│  - Party Wipe: Narrative consequences apply     │
│  - All party members gain "Downed" condition    │
│                                                  │
│  [Retry Combat] [Return to Story]              │
└──────────────────────────────────────────────────┘
```

**User Actions**:
- Read combat summary
- View applied conditions and cost tracks
- Click "Continue Story" to return to VN
- (Optional) Click "Retry" to restart combat

**Backend**: `GET /api/v1/combat/encounters/{encounterId}/results`

**Transition**: User clicks button → Return to VN/Profile page

---

## Simplified 3-Step Flow (Quick Reference)

For users familiar with the system:

1. **Select Action**: Choose technique or quick action (with cost preview)
2. **Select Target**: Click enemy portrait (if technique requires target)
3. **Confirm**: Watch execution → See feedback → Continue

## Flow Variations

### Fast SPD Characters
- Get extra Quick Action phase at start of round (Stage 1)
- Can use defensive/offensive quick actions before enemies act

### Slow SPD Characters
- Get extra Quick Action phase at end of round (Stage 3)
- Can react after seeing enemy actions

### Multiple Enemies
- Target selection shows all valid enemies
- Highlight shows which enemies are in range/valid

### Multiple Party Members
- Turn order indicator shows whose turn is next
- Can switch between party members' actions
- Each party member acts once per phase

## Accessibility Notes

- **Keyboard Navigation**: Tab through actions, Enter to select, Esc to cancel
- **Screen Reader**: Combat log readable, action descriptions clear
- **Color Blind**: Cost track warnings use symbols + color
- **Low Vision**: Large text mode, high contrast option

## Performance Considerations

- Combat state updates use optimistic UI updates
- Resource bars animate smoothly (CSS transitions)
- Combat log limited to last 50 entries (scroll for more)
- API calls debounced to prevent spam clicks
