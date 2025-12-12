# Battle UI Specification

**Version**: 1.0.0 (Draft)  
**Date**: 2025-12-12  
**Status**: Draft Specification  
**Related**: Combat Engine Spec, COMBAT_UI_DESIGN.md, COMBAT_UI_UX_FLOW.md

---

## Table of Contents

1. [Overview](#1-overview)
2. [UI Screens & Components (MVP)](#2-ui-screens--components-mvp)
3. [Component Specifications](#3-component-specifications)
4. [UX Requirements](#4-ux-requirements)
5. [Styling Guidelines](#5-styling-guidelines)
6. [State Management](#6-state-management)
7. [Implementation Plan](#7-implementation-plan)

---

## 1. Overview

### Purpose

This specification defines the **Battle UI layer** that integrates with the combat engine and can be embedded into the existing VN view as an overlay modal or dedicated screen.

### Design Goals

1. **VN-consistent**: Reuses project's UI theme and styling patterns
2. **Accessible**: Full keyboard navigation, visible focus states, screen reader support
3. **Responsive**: Works on desktop, tablet, and mobile
4. **Modular**: Components can be used independently or composed
5. **Animatable**: Supports animations with `prefers-reduced-motion` respect

### Existing Components (to extend)

From `frontend/src/components/combat/`:
- `CombatView.tsx` - Main combat container
- `CombatantCard.tsx` - Character display with HP bars
- `TurnIndicator.tsx` - Round/phase display
- `TechniqueSelector.tsx` - Technique selection UI
- `QuickActionPanel.tsx` - Quick action buttons
- `CombatLog.tsx` - Combat event history
- `ActionPreview.tsx` - Action cost preview

---

## 2. UI Screens & Components (MVP)

### Screen Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│                         BATTLE HUD OVERLAY                            │
├──────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    TURN INDICATOR                              │   │
│  │     Round 3 • Stage 2: Major Actions • Acting: Wei Lin        │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  ┌─────────────────────┐           ┌─────────────────────┐           │
│  │     PARTY SIDE      │           │     ENEMY SIDE      │           │
│  │                     │    VS     │                     │           │
│  │  ┌───────────────┐  │           │  ┌───────────────┐  │           │
│  │  │ Combatant 1   │  │           │  │ Enemy 1       │  │           │
│  │  │ HP: ████░░    │  │           │  │ HP: ██████░░  │  │           │
│  │  │ AE: ███░░░    │  │           │  │ AE: █████░░   │  │           │
│  │  └───────────────┘  │           │  └───────────────┘  │           │
│  │                     │           │                     │           │
│  │  ┌───────────────┐  │           │  ┌───────────────┐  │           │
│  │  │ Combatant 2   │  │           │  │ Enemy 2       │  │           │
│  │  └───────────────┘  │           │  └───────────────┘  │           │
│  └─────────────────────┘           └─────────────────────┘           │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                      COMMAND MENU                              │   │
│  │  [Attack] [Technique ▼] [Defend] [Item] [Wait]                │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    COMBAT FORECAST                             │   │
│  │  Gu Fangs → Sect Elder                                        │   │
│  │  Hit: 85% | Damage: ~32 | Crit: 15%                           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                      COMBAT LOG                                │   │
│  │  > Wei Lin uses Gu Fangs → Hit! 32 damage                     │   │
│  │  > Sect Elder: 118/150 THP remaining                          │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
BattleScreen (container)
├── TurnIndicator
├── CombatArena
│   ├── PartyPanel
│   │   └── CombatantCard (×N)
│   │       ├── Portrait
│   │       ├── ResourceBars
│   │       │   ├── HPBar
│   │       │   ├── AEBar
│   │       │   └── StrainBar
│   │       └── StatusIcons
│   ├── VSIndicator
│   └── EnemyPanel
│       └── CombatantCard (×M)
├── CommandMenu
│   ├── ActionButton (Attack)
│   ├── TechniqueDropdown
│   ├── ActionButton (Defend)
│   ├── ActionButton (Item)
│   └── ActionButton (Wait)
├── TargetSelector (overlay)
├── ForecastPanel
├── CombatLog
└── ResultsModal (overlay)
```

---

## 3. Component Specifications

### 3.1 TurnIndicator

**Purpose**: Display current round, phase, and active character

**Props**:
```typescript
interface TurnIndicatorProps {
  round: number;
  phase: CombatPhase;
  activeCharacter: string | null;
  isPlayerTurn: boolean;
}
```

**Visual**:
```
┌─────────────────────────────────────────────────────────────┐
│  Round 5 • Stage 2: Major Actions • Acting: Wei Lin (You)   │
└─────────────────────────────────────────────────────────────┘
```

**Styling**:
- Background: Semi-transparent dark
- Text: White with accent color for active character
- Border: Subtle glow during player turn

**Accessibility**:
- `role="status"` for screen reader announcements
- Live region for phase changes

### 3.2 CombatantCard

**Purpose**: Display combatant with real-time resource bars and status

**Props**:
```typescript
interface CombatantCardProps {
  combatant: CombatantState;
  isAlly: boolean;
  isActive: boolean;
  isTargetable: boolean;
  isSelected: boolean;
  onSelect?: () => void;
}
```

**Visual**:
```
┌────────────────────────────┐
│  [Portrait]                │
│  Wei Lin                   │
│  SCL 5 • SPD: Fast         │
├────────────────────────────┤
│  THP ████████░░ 85/100    │
│  AE  ██████░░░░ 15/25     │
│  STR ░░░░░░░░░░ 2/40      │
│  GRD ███░░░░░░░ 15        │
├────────────────────────────┤
│  [🔥 Wounded] [⚡ Fury 3]   │
└────────────────────────────┘
```

**States**:
- **Default**: Normal border
- **Active**: Gold border + glow
- **Targetable**: Pulsing border + pointer cursor
- **Selected**: Highlighted background
- **Defeated**: Greyed out + crossed portrait

**Resource Bars**:
| Resource | Color | Direction |
|----------|-------|-----------|
| THP | Green → Yellow → Red | Left to right |
| AE | Blue | Left to right |
| Strain | Yellow → Orange → Red | Left to right (fills as strain increases) |
| Guard | Grey/Silver | Left to right |

**Animations**:
- Bar transitions: 300ms ease-out
- Damage flash: Red overlay flash on THP loss
- Heal flash: Green overlay flash on THP gain

### 3.3 CommandMenu

**Purpose**: Present action options for active player unit

**Props**:
```typescript
interface CommandMenuProps {
  phase: CombatPhase;
  activeUnit: CombatantState;
  techniques: Technique[];
  items: Item[];
  onAction: (action: Action) => void;
  disabled?: boolean;
}
```

**Visual (Major Phase)**:
```
┌──────────────────────────────────────────────────────────────┐
│  [⚔️ Attack] [📜 Technique ▼] [🛡️ Defend] [🎒 Item] [⏳ Wait] │
└──────────────────────────────────────────────────────────────┘
```

**Visual (Quick Phase)**:
```
┌────────────────────────────────────────────────────────────────────┐
│  [Strike] [Block] [Pressure] [Weaken] [Empower] [Shield] [Move]   │
└────────────────────────────────────────────────────────────────────┘
```

**Button States**:
- **Enabled**: Full opacity, interactive
- **Disabled**: 50% opacity, non-interactive
- **Focused**: Outline + background highlight
- **Hover**: Slight scale + brightness increase

**Keyboard Navigation**:
- Tab/Shift+Tab to navigate buttons
- Enter/Space to activate
- Escape to cancel current selection
- Arrow keys for technique dropdown

### 3.4 TechniqueSelector

**Purpose**: Display available techniques with costs and enable selection

**Props**:
```typescript
interface TechniqueSelectorProps {
  techniques: Technique[];
  currentAE: number;
  onSelect: (techniqueId: string) => void;
  disabled?: boolean;
}
```

**Visual**:
```
┌────────────────────────────────────────────────┐
│  Available Techniques                          │
├────────────────────────────────────────────────┤
│  ✓ Gu Fangs                       [8 AE]      │
│    35 damage • Self-Strain: +1                 │
│                                                │
│  ✓ Swarming Dissection           [10 AE]      │
│    28 damage + Wounded • Self-Strain: +2       │
│    ⚠️ Stain: +1                               │
│                                                │
│  ✗ Insight of Hive               [12 AE]      │
│    Mind Debilitate • (Not enough AE)          │
└────────────────────────────────────────────────┘
```

**Item States**:
- **Affordable**: Checkmark, full opacity
- **Unaffordable**: X mark, 50% opacity, non-interactive
- **Warning**: Yellow/orange warning icon for cost tracks

### 3.5 QuickActionPanel

**Purpose**: Display quick action options for Stage 1/3

**Props**:
```typescript
interface QuickActionPanelProps {
  combatant: CombatantState;
  onSelect: (actionType: QuickActionType) => void;
  disabled?: boolean;
}
```

**Visual**:
```
┌────────────────────────────────────────────────────────────────┐
│  Quick Actions                                                  │
├────────────────────────────────────────────────────────────────┤
│  [🗡️ Strike]  [🛡️ Block]   [💪 Pressure] [📉 Weaken]          │
│  [⚡ Empower] [🔰 Shield] [🏃 Reposition]                       │
│                                                                 │
│  Or: [Skip to Major Action →]                                   │
└────────────────────────────────────────────────────────────────┘
```

**Tooltips**:
Each button shows tooltip on hover/focus:
```
Block
─────
Gain Guard equal to Endurance × 2.
50% damage reduction this round.
Cost: +1 Strain
```

### 3.6 TargetSelector

**Purpose**: Overlay for selecting valid targets

**Props**:
```typescript
interface TargetSelectorProps {
  validTargets: string[];
  combatants: CombatantState[];
  onSelect: (targetId: string) => void;
  onCancel: () => void;
  technique?: Technique;
}
```

**Behavior**:
1. Dims non-valid targets
2. Highlights valid targets with pulsing border
3. Shows "Cancel" button
4. Updates cursor to crosshair over valid targets

**Visual**:
```
┌──────────────────────────────────────────────────────────────┐
│  🎯 SELECT TARGET for: Gu Fangs              [Cancel]        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  [Dimmed Ally]          [GLOWING Enemy] ← Click!             │
│   Wei Lin                Sect Elder                          │
│   (Not targetable)       (Valid target)                      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Keyboard**:
- Tab cycles through valid targets
- Enter selects focused target
- Escape cancels

### 3.7 ForecastPanel

**Purpose**: Preview action outcome before confirming

**Props**:
```typescript
interface ForecastPanelProps {
  attacker: CombatantState;
  target: CombatantState;
  technique: Technique;
  forecast: ActionForecast;
}

interface ActionForecast {
  hitChance: number;
  critChance: number;
  estimatedDamage: { min: number; max: number; avg: number };
  aeCost: number;
  selfStrain: number;
  trackMarks: { blood?: number; fate?: number; stain?: number };
  warnings: string[];
}
```

**Visual**:
```
┌──────────────────────────────────────────────────────────────┐
│  COMBAT FORECAST                                              │
├──────────────────────────────────────────────────────────────┤
│  Wei Lin → Sect Elder                                        │
│  Technique: Gu Fangs                                         │
├──────────────────────────────────────────────────────────────┤
│  Hit: 85%        Crit: 15%                                   │
│  Damage: 28-38 (avg 32)                                      │
│  Cost: 8 AE • Strain: +1                                     │
├──────────────────────────────────────────────────────────────┤
│  [✓ Confirm]                      [✗ Cancel]                 │
└──────────────────────────────────────────────────────────────┘
```

**Warnings Section** (if applicable):
```
⚠️ This will mark your Stain Track (+1)
⚠️ Low hit chance - consider buffing first
```

### 3.8 CombatLog

**Purpose**: Scrollable history of combat events

**Props**:
```typescript
interface CombatLogProps {
  entries: LogEntry[];
  maxHeight?: string;
  onEntryClick?: (entry: LogEntry) => void;
}
```

**Visual**:
```
┌──────────────────────────────────────────────────────────────┐
│  Combat Log                                        [Clear]   │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │ > Round 5 begins. AE regenerated.                    │   │
│  │                                                       │   │
│  │ > Wei Lin uses Gu Fangs on Sect Elder               │   │
│  │   Hit! 32 THP damage dealt.                          │   │
│  │   Sect Elder: 68/100 THP remaining                   │   │
│  │                                                       │   │
│  │ > Sect Elder uses Sky-Rending Palm on Wei Lin       │   │
│  │   Critical! 45 THP damage + Wounded                  │   │
│  │   Wei Lin: 55/100 THP, Condition: Wounded            │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

**Behavior**:
- Auto-scrolls to latest entry
- Color-coded by event type (damage red, heal green, info gray)
- Expandable entries for full details

### 3.9 ResultsModal

**Purpose**: Display combat outcome and consequences

**Props**:
```typescript
interface ResultsModalProps {
  result: 'victory' | 'defeat' | 'escape' | 'timeout';
  stats: CombatStats;
  rewards?: BattleRewards;
  consequences: Consequence[];
  onContinue: () => void;
  onRetry?: () => void;
}
```

**Victory Visual**:
```
┌──────────────────────────────────────────────────────────────┐
│                     ⚔️ VICTORY ⚔️                            │
│                 The Sect Elder yields!                       │
├──────────────────────────────────────────────────────────────┤
│  Combat Statistics:                                          │
│  • Duration: 5 rounds                                        │
│  • Total Damage Dealt: 187                                   │
│  • Total Damage Taken: 85                                    │
├──────────────────────────────────────────────────────────────┤
│  Rewards:                                                    │
│  • 500 XP                                                    │
│  • Sect Elder's Token                                        │
├──────────────────────────────────────────────────────────────┤
│  Consequences:                                               │
│  • Wei Lin: Wounded (1st degree) - needs rest                │
│  • Blood Track: +2 marks                                     │
│  • Stain Track: +1 mark (used corrupting technique)          │
├──────────────────────────────────────────────────────────────┤
│                    [Continue Story]                          │
└──────────────────────────────────────────────────────────────┘
```

**Defeat Visual**:
```
┌──────────────────────────────────────────────────────────────┐
│                     💀 DEFEAT 💀                             │
│                   Party has fallen...                        │
├──────────────────────────────────────────────────────────────┤
│  Consequences:                                               │
│  • Party Wipe: Narrative consequences apply                  │
│  • All party members: Mortally Wounded                       │
├──────────────────────────────────────────────────────────────┤
│           [Retry Combat]     [Return to Story]               │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. UX Requirements

### 4.1 Keyboard Navigation

| Context | Key | Action |
|---------|-----|--------|
| Global | Tab | Focus next element |
| Global | Shift+Tab | Focus previous element |
| Global | Enter/Space | Activate focused button |
| Global | Escape | Cancel/close current overlay |
| Command Menu | 1-5 | Quick select action (Attack, Tech, Defend, Item, Wait) |
| Target Select | Arrow Keys | Navigate targets |
| Technique List | Arrow Up/Down | Navigate techniques |
| Combat Log | Page Up/Down | Scroll log |

### 4.2 Focus Management

- Visible focus indicator on all interactive elements
- Focus trap in modals (Results, Target Select)
- Return focus to trigger element when modal closes
- Announce phase changes via live region

### 4.3 Screen Reader Support

```html
<!-- Turn announcement -->
<div role="status" aria-live="polite">
  Round 5, Stage 2: Major Actions. It is Wei Lin's turn.
</div>

<!-- Combat log entries -->
<div role="log" aria-label="Combat log">
  <p>Wei Lin uses Gu Fangs on Sect Elder. Hit! 32 damage dealt.</p>
</div>

<!-- Resource bars -->
<div role="meter" aria-label="Health" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100">
  85 of 100 health points
</div>
```

### 4.4 Mobile Responsiveness

**Breakpoints**:
| Breakpoint | Layout |
|------------|--------|
| Desktop (>1024px) | Full side-by-side layout |
| Tablet (768-1024px) | Stacked with horizontal scrolling for parties |
| Mobile (<768px) | Single column, collapsible panels |

**Touch Targets**:
- Minimum 44x44px for all interactive elements
- Adequate spacing between targets (8px minimum)

**Mobile Layout**:
```
┌─────────────────────────┐
│    Turn Indicator       │
├─────────────────────────┤
│    [Party Tab] [Enemy]  │
├─────────────────────────┤
│    CombatantCard        │
│    (swipeable list)     │
├─────────────────────────┤
│    Command Menu         │
│    (horizontal scroll)  │
├─────────────────────────┤
│    Combat Log           │
│    (collapsible)        │
└─────────────────────────┘
```

### 4.5 Animation Guidelines

**Motion Preferences**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Standard Animations**:
| Element | Animation | Duration | Timing |
|---------|-----------|----------|--------|
| Resource bars | Width transition | 300ms | ease-out |
| Damage numbers | Float up + fade | 800ms | ease-out |
| Card highlight | Pulse | 1500ms | ease-in-out |
| Modal entry | Fade + scale | 200ms | ease-out |
| Button hover | Scale | 150ms | ease-out |

---

## 5. Styling Guidelines

### 5.1 Color Palette

```css
:root {
  /* Combat-specific colors */
  --combat-bg: #1a1a2e;
  --combat-panel: #16213e;
  --combat-border: #0f3460;
  --combat-accent: #e94560;
  
  /* Resource colors */
  --hp-full: #4ade80;
  --hp-mid: #facc15;
  --hp-low: #ef4444;
  --ae-color: #3b82f6;
  --strain-color: #f97316;
  --guard-color: #a8a29e;
  
  /* Team colors */
  --ally-accent: #22c55e;
  --enemy-accent: #ef4444;
  --neutral-accent: #a855f7;
  
  /* Status colors */
  --active-glow: #fbbf24;
  --targetable-glow: #06b6d4;
  --selected-bg: rgba(59, 130, 246, 0.3);
}
```

### 5.2 Typography

```css
:root {
  /* Combat UI fonts */
  --combat-font-family: 'Inter', system-ui, sans-serif;
  --combat-mono-font: 'JetBrains Mono', monospace;
  
  /* Sizes */
  --combat-text-xs: 0.75rem;   /* 12px - small labels */
  --combat-text-sm: 0.875rem;  /* 14px - body text */
  --combat-text-base: 1rem;    /* 16px - buttons */
  --combat-text-lg: 1.125rem;  /* 18px - headers */
  --combat-text-xl: 1.5rem;    /* 24px - titles */
}
```

### 5.3 Spacing

```css
:root {
  --combat-space-1: 0.25rem;  /* 4px */
  --combat-space-2: 0.5rem;   /* 8px */
  --combat-space-3: 0.75rem;  /* 12px */
  --combat-space-4: 1rem;     /* 16px */
  --combat-space-6: 1.5rem;   /* 24px */
  --combat-space-8: 2rem;     /* 32px */
}
```

### 5.4 Component Styles

**Panel**:
```css
.combat-panel {
  background: var(--combat-panel);
  border: 1px solid var(--combat-border);
  border-radius: 8px;
  padding: var(--combat-space-4);
}
```

**Button**:
```css
.combat-button {
  background: var(--combat-border);
  border: 1px solid var(--combat-accent);
  border-radius: 4px;
  padding: var(--combat-space-2) var(--combat-space-4);
  color: white;
  font-size: var(--combat-text-base);
  cursor: pointer;
  transition: transform 0.15s ease-out, background 0.15s ease-out;
}

.combat-button:hover:not(:disabled) {
  background: var(--combat-accent);
  transform: scale(1.02);
}

.combat-button:focus-visible {
  outline: 2px solid var(--active-glow);
  outline-offset: 2px;
}

.combat-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**Resource Bar**:
```css
.resource-bar {
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
}

.resource-bar-fill {
  height: 100%;
  transition: width 0.3s ease-out;
  border-radius: 6px;
}

.resource-bar-fill.hp {
  background: linear-gradient(90deg, var(--hp-low), var(--hp-mid), var(--hp-full));
  background-size: 300% 100%;
  background-position: calc(100% - var(--fill-percent) * 3) 0;
}
```

---

## 6. State Management

### 6.1 Component State

```typescript
// BattleScreen.tsx state
interface BattleScreenState {
  // Combat engine state
  combatState: CombatState | null;
  
  // UI state
  selectedAction: ActionType | null;
  selectedTechnique: string | null;
  selectedTarget: string | null;
  targetMode: boolean;
  showForecast: boolean;
  showResults: boolean;
  
  // Animation state
  animatingAction: boolean;
  damageNumbers: DamageNumber[];
  
  // Error state
  error: string | null;
  loading: boolean;
}
```

### 6.2 Event Handling

```typescript
// Action flow
function handleActionSelect(action: ActionType): void {
  if (action === 'technique') {
    setShowTechniqueList(true);
  } else if (action === 'attack' || action === 'technique') {
    setTargetMode(true);
  } else {
    executeAction({ type: action, actorId: activeUnitId });
  }
}

function handleTechniqueSelect(techniqueId: string): void {
  setSelectedTechnique(techniqueId);
  setTargetMode(true);
}

function handleTargetSelect(targetId: string): void {
  if (showForecast) {
    const forecast = calculateForecast(selectedTechnique, targetId);
    setForecastData(forecast);
    setShowForecast(true);
  } else {
    executeAction({
      type: 'technique',
      actorId: activeUnitId,
      techniqueId: selectedTechnique,
      targetId
    });
    resetSelection();
  }
}

function handleConfirmAction(): void {
  executeAction(pendingAction);
  setShowForecast(false);
  resetSelection();
}
```

### 6.3 Reducer Integration

```typescript
// Connect to combat engine reducer
function BattleScreen() {
  const [state, dispatch] = useReducer(combatReducer, initialState);
  
  const executeAction = useCallback((action: Action) => {
    // Generate events from action
    const events = resolveAction(state, action, rng);
    
    // Dispatch each event
    events.forEach(event => dispatch(event));
    
    // Play animations
    animateEvents(events);
    
    // Check for combat end
    const result = checkVictory(state);
    if (result) {
      dispatch({ type: 'COMBAT_END', result });
    }
  }, [state, rng]);
  
  // ...
}
```

---

## 7. Implementation Plan

### Phase 1: Core Display (Priority: High)

**Components**:
- [ ] Enhance `CombatView.tsx` with new layout
- [ ] Enhance `CombatantCard.tsx` with all resource bars
- [ ] Enhance `TurnIndicator.tsx` with phase display
- [ ] Enhance `CombatLog.tsx` with styling

**Files**:
```
frontend/src/components/combat/
├── CombatView.tsx (modify)
├── CombatantCard.tsx (modify)
├── TurnIndicator.tsx (modify)
└── CombatLog.tsx (modify)
```

**Acceptance Criteria**:
- [ ] Party and enemy panels display correctly
- [ ] All resource bars animate on value change
- [ ] Turn indicator shows correct phase
- [ ] Combat log shows recent events

### Phase 2: Action Selection (Priority: High)

**Components**:
- [ ] Enhance `TechniqueSelector.tsx` with affordability
- [ ] Enhance `QuickActionPanel.tsx` for all 7 actions
- [ ] Create `TargetSelector.tsx` overlay
- [ ] Add keyboard navigation

**Acceptance Criteria**:
- [ ] Can select attack/technique/defend/item/wait
- [ ] Technique list shows costs and affordability
- [ ] Target selection highlights valid targets
- [ ] Full keyboard navigation works

### Phase 3: Feedback (Priority: Medium)

**Components**:
- [ ] Create `ForecastPanel.tsx`
- [ ] Create `ResultsModal.tsx`
- [ ] Add `StatusIcon.tsx` component
- [ ] Add damage number animations

**Acceptance Criteria**:
- [ ] Forecast shows before confirming attack
- [ ] Results modal displays on combat end
- [ ] Status icons show active conditions
- [ ] Damage numbers float up on hit

### Phase 4: Polish (Priority: Medium)

**Tasks**:
- [ ] Mobile responsive layout
- [ ] Animation refinement
- [ ] Accessibility audit
- [ ] Performance optimization

**Acceptance Criteria**:
- [ ] Works on mobile devices
- [ ] Respects reduced motion preference
- [ ] Passes WCAG 2.1 AA
- [ ] No jank on animations

---

## Appendix A: Existing Component Analysis

### CombatView.tsx (Current)

**Strengths**:
- Basic structure in place
- API integration exists
- State management pattern established

**Gaps**:
- No forecast panel
- No results modal
- Limited styling
- No keyboard navigation

### CombatantCard.tsx (Current)

**Strengths**:
- Shows name, THP, AE, strain, guard
- Active/targetable states

**Gaps**:
- No portrait
- No status icons
- No SPD band display
- No animations

### Recommendations

1. **Extend, don't replace**: Build on existing components
2. **CSS modules**: Add `.module.css` files for scoped styles
3. **Accessibility first**: Add ARIA attributes during development
4. **Mobile first**: Start with mobile layout, enhance for desktop
