# ROTK UI System - Documentation

> Romance of the Three Kingdoms themed UI system for the WuXuxian TTRPG webapp.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Theme Configuration](#theme-configuration)
4. [Component Library](#component-library)
5. [Demo Scenes](#demo-scenes)
6. [Asset Pipeline](#asset-pipeline)
7. [Customization Guide](#customization-guide)

---

## Overview

This UI system provides a complete set of React components styled with Chinese period-piece aesthetics inspired by the Han Dynasty and Three Kingdoms era. The design features:

- **Ornamental frames** with gold/bronze filigree
- **Lacquered panels** with cinnabar red accents
- **Jade green** highlights for positive states
- **Parchment textures** for light panels and tooltips
- **Ink-wash overlays** for atmospheric depth

### Key Files

| File | Purpose |
|------|---------|
| `frontend/src/styles/rotkTheme.ts` | TypeScript theme tokens |
| `frontend/src/styles/rotkTheme.css` | CSS custom properties and utilities |
| `frontend/src/components/rotk/` | React component library |
| `frontend/src/pages/rotk/` | Demo scenes |
| `docs/UI_STYLE_GUIDE.md` | Complete style guide |

---

## Quick Start

### Import the Theme

```tsx
// In your component or global styles
import '../styles/rotkTheme.css';

// Or import TypeScript tokens
import { rotkTheme, rotkColors } from '../styles/rotkTheme';
```

### Use a Component

```tsx
import { Panel9Slice, ROTKButton, StatBar } from '../components/rotk';

function MyComponent() {
  return (
    <Panel9Slice variant="parchment" corners={true}>
      <h2>My Panel Title</h2>
      <StatBar type="hp" current={85} max={120} label="HP" />
      <ROTKButton variant="primary" onClick={handleClick}>
        Action
      </ROTKButton>
    </Panel9Slice>
  );
}
```

### View Demo Scenes

Navigate to these routes in your browser:

- `/rotk/city` - City Hub with building pins
- `/rotk/war` - War Council with map markers
- `/rotk/battle` - Battle HUD with character plates
- `/rotk/siege` - Siege overlay with tactical map

---

## Theme Configuration

### Changing Theme Tokens

Edit `frontend/src/styles/rotkTheme.ts` to modify:

```typescript
export const rotkColors = {
  // Primary ornamental colors
  gold: '#D4AF37',        // Change this to adjust gold hue
  cinnabar: '#C41E3A',    // Primary action color
  jade: '#00A86B',        // Buff/positive state color
  // ... etc
};
```

### CSS Custom Properties

All tokens are also available as CSS variables in `rotkTheme.css`:

```css
:root {
  --rotk-gold: #D4AF37;
  --rotk-cinnabar: #C41E3A;
  --rotk-jade: #00A86B;
  /* ... */
}

/* Use in your CSS */
.my-element {
  color: var(--rotk-gold);
  background: var(--rotk-gradient-parchment);
}
```

### Typography

The theme uses these font families (all OFL licensed):

1. **Cinzel** - Headings (period serif)
2. **Noto Serif SC** - CJK headings
3. **Inter** - Body/UI text
4. **JetBrains Mono** - Numerals/damage

Load them via Google Fonts or self-host:

```html
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
```

---

## Component Library

### Core Components

#### Panel9Slice

9-slice panel with ornate corner decorations.

```tsx
import { Panel9Slice } from '../components/rotk';

<Panel9Slice 
  variant="parchment"  // 'parchment' | 'lacquer' | 'ink'
  corners={true}        // Show bronze corner decorations
>
  Content here
</Panel9Slice>
```

#### ROTKButton

Period-styled button with states.

```tsx
import { ROTKButton } from '../components/rotk';
import { Swords } from 'lucide-react';

<ROTKButton
  variant="primary"   // 'primary' | 'secondary' | 'gold'
  size="medium"       // 'small' | 'medium' | 'large'
  icon={Swords}
  iconPosition="left"
  onClick={handleClick}
  disabled={false}
>
  Attack
</ROTKButton>
```

#### StatBar

HP/AE/Guard/Strain bar with gradient fill.

```tsx
import { StatBar } from '../components/rotk';

<StatBar
  type="hp"          // 'hp' | 'ae' | 'guard' | 'strain'
  current={85}
  max={120}
  label="HP"
  showValue={true}
  size="medium"      // 'small' | 'medium' | 'large'
/>
```

#### StatusChip

Buff/debuff indicator chips.

```tsx
import { StatusChip } from '../components/rotk';

<StatusChip
  variant="buff"     // 'buff' | 'debuff' | 'neutral'
  label="ATK"
  value="+15%"
  showArrow={true}
/>
```

#### DamageNumber

Floating damage/heal numbers with animation.

```tsx
import { useDamageNumbers } from '../components/rotk';

function BattleScene() {
  const { addDamage, DamageContainer } = useDamageNumbers();
  
  const handleHit = () => {
    addDamage(45, 'damage', { x: 400, y: 200 });
    // Or: 'critical' | 'heal' | 'block'
  };
  
  return (
    <div>
      <DamageContainer />
      <button onClick={handleHit}>Hit!</button>
    </div>
  );
}
```

### City/Map Components

#### BuildingPin

Circular building pins for city view.

```tsx
import { BuildingPin } from '../components/rotk';
import { Home } from 'lucide-react';

<BuildingPin
  id="farm"
  icon={<Home size={24} />}
  label="Farm"
  level={3}
  position={{ left: '25%', top: '45%' }}
  isSelected={false}
  isDisabled={false}
  onClick={() => handleBuildingClick('farm')}
/>
```

#### MapMarker

Faction-colored map markers.

```tsx
import { MapMarker } from '../components/rotk';

<MapMarker
  id="luoyang"
  label="Luoyang"
  faction="red"       // 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'neutral'
  position={{ left: '45%', top: '35%' }}
  size="medium"       // 'small' | 'medium' | 'large'
  isSelected={false}
  isHighlighted={false}
  onClick={() => handleMarkerClick('luoyang')}
/>
```

### Navigation

#### NavBar

Bottom navigation bar with icon+label tabs.

```tsx
import { NavBar, NavTab } from '../components/rotk';
import { Users, Swords, Brain } from 'lucide-react';

const tabs: NavTab[] = [
  { id: 'personnel', label: 'Personnel', labelCjk: '人事', icon: Users },
  { id: 'military', label: 'Military', labelCjk: '军事', icon: Swords },
  { id: 'plots', label: 'Plots', labelCjk: '谋略', icon: Brain },
];

<NavBar
  tabs={tabs}
  activeTab="military"
  onTabChange={(tabId) => setActiveTab(tabId)}
/>
```

#### ResourceHUD

Top resource HUD bar.

```tsx
import { ResourceHUD } from '../components/rotk';

const resources = [
  { id: 'gold', icon: '💰', value: 12500 },
  { id: 'grain', icon: '🌾', value: 8900 },
];

<ResourceHUD
  year={200}
  season="spring"     // 'spring' | 'summer' | 'autumn' | 'winter'
  actionPoints={{ current: 3, max: 5 }}
  resources={resources}
  onSettingsClick={() => {}}
  onMenuClick={() => {}}
/>
```

### Battle Components

#### CharacterPlate

Battle HUD character panel.

```tsx
import { CharacterPlate, CharacterPlateUnit } from '../components/rotk';

const unit: CharacterPlateUnit = {
  id: 'player-1',
  name: 'Zhao Yun',
  nameCjk: '赵云',
  title: 'Five Tiger General',
  unitType: 'Cavalry',
  hp: 85,
  maxHp: 120,
  guard: 12,
  strain: 8,
  ae: 45,
  maxAe: 60,
  skill: 'Dragon Spear',
  skillCjk: '龙胆',
  buffs: [{ label: 'ATK', value: '+15%' }],
};

<CharacterPlate
  unit={unit}
  side="left"         // 'left' | 'right'
  isActive={true}
/>
```

#### ClashIndicator

Center battle clash indicator.

```tsx
import { ClashIndicator } from '../components/rotk';

<ClashIndicator
  advantage="left"    // 'left' | 'right' | 'neutral'
  statusText="Attack!"
  linkedCombo={3}
/>
```

---

## Demo Scenes

### CityHubScene (`/rotk/city`)

- 3D city background placeholder
- Circular building pins (Farm, Market, Tavern, etc.)
- Top resource HUD with date/season
- Left character portrait with dialogue panel
- Building info panel on selection

### WarCouncilScene (`/rotk/war`)

- War room background with lanterns
- Map table centerpiece with rivers
- Faction-colored map markers (Wei/Shu/Wu)
- Bottom navigation bar (6 tabs)
- Legend and selection panels

### BattleHUDScene (`/rotk/battle`)

- Battle atmosphere background
- Left/right character plates with stats
- Center clash indicator with advantage arrows
- Interactive attack/heal buttons
- Floating damage numbers with animation
- Victory/defeat overlay

### SiegeOverlayScene (`/rotk/siege`)

- Tactical grid overlay
- City walls/gates map
- Siege point markers (gate/tower/camp)
- Status indicators (intact/damaged/breached/controlled)
- Siege progress and morale bars
- Action buttons for assault/capture

### ComponentShowcaseScene (`/rotk/showcase`)

- Complete showcase of all new UI components
- Draggable token demo with interactive map
- Initiative panel (both horizontal and vertical orientations)
- Scroll/paper/ink overlay variants with ink blot transitions
- NPC event choice dialog with typewriter effect
- Control buttons to demonstrate each component

---

## New Components (Latest Update)

### DraggableToken

Draggable token component for tactical maps and courts.

```tsx
import { DraggableToken } from '../components/rotk';

<DraggableToken
  id="token-1"
  label="Zhao Yun"
  labelCjk="赵云"
  variant="character"   // 'character' | 'npc' | 'enemy' | 'object' | 'marker'
  size="medium"         // 'small' | 'medium' | 'large'
  position={{ x: 150, y: 200 }}
  onPositionChange={(id, pos) => handleMove(id, pos)}
  onSelect={(id) => handleSelect(id)}
  isSelected={true}
  isDraggable={true}
  showLabel={true}
/>
```

### ScrollOverlay

Overlay component with scroll/parchment styling and ink blot transitions.

```tsx
import { ScrollOverlay } from '../components/rotk';

<ScrollOverlay
  isOpen={showOverlay}
  onClose={() => setShowOverlay(false)}
  variant="scroll"       // 'scroll' | 'paper' | 'ink'
  size="medium"          // 'small' | 'medium' | 'large' | 'fullscreen'
  title="Imperial Decree"
  titleCjk="皇帝诏书"
  transition="inkBlot"   // 'fade' | 'inkBlot' | 'brushReveal' | 'none'
  showCloseButton={true}
  closeOnBackdrop={true}
>
  <p>Your content here...</p>
</ScrollOverlay>
```

### InitiativePanel

Combat turn order display with character portraits and status.

```tsx
import { InitiativePanel, InitiativeEntry } from '../components/rotk';

const entries: InitiativeEntry[] = [
  { id: 'char-1', name: 'Zhao Yun', nameCjk: '赵云', initiative: 18, isAlly: true },
  { id: 'char-2', name: 'Zhang Liao', nameCjk: '张辽', initiative: 16, isAlly: false, hasActed: true },
];

<InitiativePanel
  entries={entries}
  currentTurn={0}
  roundNumber={3}
  orientation="vertical"  // 'horizontal' | 'vertical'
  showInitiativeValue={true}
  onEntryClick={(id) => handleClick(id)}
/>
```

### EventChoiceDialog

NPC conversation dialog with typewriter effect and choice buttons.

```tsx
import { EventChoiceDialog, DialogChoice } from '../components/rotk';

const choices: DialogChoice[] = [
  { id: 'accept', text: 'Accept the alliance', textCjk: '接受联盟', consequence: 'positive' },
  { id: 'negotiate', text: 'Negotiate terms', consequence: 'neutral' },
  { id: 'reject', text: 'Reject outright', consequence: 'negative' },
  { id: 'consult', text: 'Consult advisors', isDisabled: true, disabledReason: 'Unavailable' },
];

<EventChoiceDialog
  isOpen={showDialog}
  onClose={() => setShowDialog(false)}
  speakerName="Sun Quan"
  speakerNameCjk="孙权"
  speakerTitle="Lord of Wu"
  dialogueText="My lord, shall we form an alliance?"
  dialogueTextCjk="主公，我们是否应该结盟？"
  choices={choices}
  onChoiceSelect={(id) => handleChoice(id)}
  showTypewriter={true}
  typewriterSpeed={30}
/>
```

---

## Asset Pipeline

### Naming Convention

```
[category]-[name]-[variant]_[state].[ext]

Examples:
- panel-parchment-9slice.png
- btn-lacquer-primary_hover.png
- icon-building-farm.svg
- chip-buff-attack.svg
```

### Directory Structure

```
frontend/public/assets/ui/
├── icons/
│   ├── nav/          # Navigation icons
│   ├── buildings/    # Building icons
│   ├── resources/    # Resource icons
│   └── status/       # Status icons
├── panels/
│   ├── parchment/    # Parchment 9-slice panels
│   └── lacquer/      # Lacquer 9-slice panels
├── decorations/
│   ├── corners/      # Bronze corner ornaments
│   ├── dividers/     # Divider lines
│   └── frames/       # Frame elements
├── bars/             # Stat bar graphics
├── overlays/         # Ink wash, vignette
└── textures/         # Noise, grain textures
```

### Export Settings

| Type | Format | Max Size |
|------|--------|----------|
| Icons | SVG | <10KB |
| Panels | PNG-24 w/ alpha | <50KB |
| Backgrounds | WebP | <200KB |
| Textures | PNG | <20KB |

---

## Customization Guide

### Adding a New Building Pin

1. Import or create an icon:
```tsx
import { Factory } from 'lucide-react';
```

2. Add to your buildings array:
```tsx
const buildings = [
  // ... existing buildings
  { 
    id: 'factory', 
    icon: <Factory size={24} />, 
    label: 'Factory', 
    level: 1, 
    position: { left: '60%', top: '40%' } 
  },
];
```

3. Use BuildingPin component as shown above.

### Adding a New Nav Tab

1. Import the icon:
```tsx
import { Warehouse } from 'lucide-react';
```

2. Add to tabs array:
```tsx
const tabs: NavTab[] = [
  // ... existing tabs
  { id: 'logistics', label: 'Logistics', labelCjk: '后勤', icon: Warehouse },
];
```

### Adding a New Battle Unit Card

1. Create the unit data:
```tsx
const newUnit: CharacterPlateUnit = {
  id: 'ally-2',
  name: 'Guan Yu',
  nameCjk: '关羽',
  title: 'God of War',
  unitType: 'Heavy Infantry',
  hp: 150,
  maxHp: 200,
  guard: 20,
  strain: 5,
  ae: 60,
  maxAe: 80,
  skill: 'Green Dragon',
  skillCjk: '青龙偃月',
};
```

2. Render with CharacterPlate:
```tsx
<CharacterPlate unit={newUnit} side="left" isActive={false} />
```

### Creating a Custom Panel Variant

1. Add to `rotkTheme.ts`:
```typescript
export const rotkComponents = {
  panel: {
    // ... existing variants
    jade: {
      background: rotkGradients.jade,
      border: `2px solid ${rotkColors.jadeDark}`,
      borderRadius: rotkBorders.radius.md,
      shadow: rotkShadows.raised,
      padding: rotkSpacing[6],
    },
  },
};
```

2. Add CSS class in `rotkTheme.css`:
```css
.rotk-panel-jade {
  background: var(--rotk-gradient-jade);
  border: var(--rotk-border-md) solid var(--rotk-jade-dark);
  /* ... */
}
```

3. Update Panel9Slice component to support new variant.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2025-12-13 | Added DraggableToken, ScrollOverlay, InitiativePanel, EventChoiceDialog components. New ComponentShowcaseScene demo. Added ink blot and overlay animations. |
| 1.0.0 | 2025-12-12 | Initial release with core components and 4 demo scenes |

---

*For questions or issues, see the main project documentation or open a GitHub issue.*
