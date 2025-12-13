# UI Style Guide - Romance of the Three Kingdoms Theme

> A comprehensive design system inspired by Chinese period-piece aesthetics (Han–Three Kingdoms era) featuring lacquered wood, carved bronze, jade accents, silk banners, and ink-brush textures.

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Elevation & Materials](#elevation--materials)
5. [Iconography](#iconography)
6. [Motion & Animation](#motion--animation)
7. [Component Library](#component-library)
8. [Implementation Guide](#implementation-guide)

---

## Design Philosophy

The UI system recreates the premium strategy-game HUD feel with:

- **Ornamental frames**: Gold/bronze filigree borders and corner decorations
- **Period materials**: Cinnabar lacquer, jade highlights, aged parchment, ink-wash overlays
- **Layered depth**: Subtle bevel/emboss, soft bloom highlights
- **Modern clarity**: Highly readable stats/labels while maintaining historical flavor
- **Restrained VFX**: Subtle particle accents for combat feedback

---

## Color Palette

### Primary Tokens

| Token Name | Hex Code | CSS Variable | Usage |
|------------|----------|--------------|-------|
| **Gold/Bronze** | `#D4AF37` | `--rotk-gold` | Ornamental frames, icon rims, highlights |
| **Bronze Dark** | `#CD7F32` | `--rotk-bronze` | Secondary frames, weathered accents |
| **Cinnabar Red** | `#C41E3A` | `--rotk-cinnabar` | Primary actions, selected states, critical alerts |
| **Jade Green** | `#00A86B` | `--rotk-jade` | Buffs, positive deltas, faction accents |
| **Jade Dark** | `#006B3F` | `--rotk-jade-dark` | Secondary jade elements |
| **Ink Black** | `#1A1A1A` | `--rotk-ink-black` | Text, shadows, deep backgrounds |
| **Charcoal** | `#2D2D2D` | `--rotk-charcoal` | Panel backgrounds, cards |
| **Parchment Beige** | `#FDF6E3` | `--rotk-parchment` | Panels, tables, tooltips, light backgrounds |
| **Parchment Aged** | `#D4C5A9` | `--rotk-parchment-aged` | Burnt/aged paper effects |
| **Cool Blue** | `#4682B4` | `--rotk-blue` | Neutral UI counters, secondary highlights |

### Status Colors

| Token Name | Hex Code | CSS Variable | Usage |
|------------|----------|--------------|-------|
| **HP Red** | `#8B0000` | `--rotk-hp` | Health bars, damage indicators |
| **AE Blue** | `#4169E1` | `--rotk-ae` | Action Energy, mana bars |
| **Guard Silver** | `#C0C0C0` | `--rotk-guard` | Guard/shield values |
| **Strain Amber** | `#DAA520` | `--rotk-strain` | Strain accumulation |

### Gradient Tokens

```css
--rotk-gradient-gold: linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%);
--rotk-gradient-cinnabar: linear-gradient(135deg, #C41E3A 0%, #8B0000 100%);
--rotk-gradient-jade: linear-gradient(135deg, #00A86B 0%, #006B3F 100%);
--rotk-gradient-parchment: linear-gradient(135deg, #FDF6E3 0%, #D4C5A9 100%);
--rotk-gradient-ink: linear-gradient(180deg, #1A1A1A 0%, #424242 50%, #757575 100%);
```

---

## Typography

### Font Stack

| Purpose | Font Family | CSS Variable | Fallback |
|---------|------------|--------------|----------|
| **Headings** | Cinzel | `--rotk-font-heading` | Georgia, "Times New Roman", serif |
| **CJK Headings** | Noto Serif SC | `--rotk-font-heading-cjk` | SimSun, serif |
| **Body/UI** | Inter | `--rotk-font-body` | -apple-system, BlinkMacSystemFont, sans-serif |
| **Numerals** | JetBrains Mono | `--rotk-font-mono` | "Courier New", monospace |
| **Damage Popups** | Cinzel (Bold) | `--rotk-font-damage` | Georgia, serif |

### Font Sizes

| Token | Size | Usage |
|-------|------|-------|
| `--rotk-text-xs` | 0.75rem (12px) | Chip labels, micro text |
| `--rotk-text-sm` | 0.875rem (14px) | Secondary labels, tooltips |
| `--rotk-text-base` | 1rem (16px) | Body text, stat values |
| `--rotk-text-lg` | 1.25rem (20px) | Section headers |
| `--rotk-text-xl` | 1.5rem (24px) | Panel titles |
| `--rotk-text-2xl` | 2rem (32px) | Character names |
| `--rotk-text-3xl` | 2.5rem (40px) | Damage numbers |
| `--rotk-text-4xl` | 3rem (48px) | Critical damage numbers |

### Licensing Notes

- **Cinzel**: OFL (Open Font License) - Free for commercial use
- **Inter**: OFL - Free for commercial use
- **Noto Serif SC**: OFL - Free for commercial use
- **JetBrains Mono**: OFL - Free for commercial use

---

## Elevation & Materials

### Panel Depth Levels

| Level | Shadow | Usage |
|-------|--------|-------|
| **Base** | `0 2px 4px rgba(0,0,0,0.1)` | Flat panels, tooltips |
| **Raised** | `0 4px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)` | Cards, buttons |
| **Elevated** | `0 8px 16px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1)` | Modals, overlays |
| **Floating** | `0 16px 32px rgba(0,0,0,0.25), 0 8px 16px rgba(0,0,0,0.15)` | Popups, dropdowns |

### Material Effects

```css
/* Lacquer Panel */
.rotk-panel-lacquer {
  background: var(--rotk-cinnabar);
  border: 2px solid var(--rotk-gold);
  border-radius: 4px;
  box-shadow: 
    inset 0 1px 0 rgba(255,255,255,0.1),
    inset 0 -1px 0 rgba(0,0,0,0.2),
    0 4px 8px rgba(0,0,0,0.2);
}

/* Parchment Panel */
.rotk-panel-parchment {
  background: var(--rotk-gradient-parchment);
  border: 2px solid var(--rotk-bronze);
  border-radius: 4px;
  box-shadow: 
    inset 0 0 20px rgba(0,0,0,0.05);
}

/* Bronze Frame */
.rotk-frame-bronze {
  border: 3px solid var(--rotk-bronze);
  border-image: linear-gradient(135deg, #D4AF37, #CD7F32, #D4AF37) 1;
  box-shadow: 
    0 0 0 1px var(--rotk-ink-black),
    0 4px 8px rgba(0,0,0,0.2);
}

/* Ink Wash Overlay */
.rotk-overlay-ink {
  background: radial-gradient(ellipse at top, rgba(26,26,26,0.8), rgba(26,26,26,0.95));
}

/* Grain/Noise Texture */
.rotk-texture-grain {
  position: relative;
}
.rotk-texture-grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url('/assets/ui/textures/noise-grain.png');
  opacity: 0.03;
  pointer-events: none;
}
```

---

## Iconography

### Style Rules

- **Silhouette-first**: Clear, recognizable shapes
- **Period motifs**: Incorporate seal stamps, bronze inlay patterns
- **Consistent stroke**: 2px stroke width at 24px size
- **Corner radius**: Minimal (0-2px) for authenticity
- **Color treatment**: Monochrome with gold/bronze accents

### Icon Categories

| Category | Examples | Style Notes |
|----------|----------|-------------|
| **Navigation** | Home, Map, Combat, Wiki | Circular badges with seal-like borders |
| **Resources** | Gold, Rice, Wood, Iron | Simplified commodity symbols |
| **Buildings** | Farm, Market, Tavern, Palace | Rooftop silhouettes with period details |
| **Actions** | Attack, Defend, Skill, Item | Dynamic pose silhouettes |
| **Status** | Buff, Debuff, Warning, Critical | Badge-style with color coding |

### Icon Sizes

| Size | Dimension | Usage |
|------|-----------|-------|
| **Small** | 16x16px | Inline, chips |
| **Medium** | 24x24px | Buttons, nav |
| **Large** | 32x32px | HUD, prominent |
| **XL** | 48x48px | Building pins |

---

## Motion & Animation

### Timing

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `--rotk-duration-fast` | 150ms | ease-out | Hover states, micro-interactions |
| `--rotk-duration-base` | 250ms | ease-out | Panel transitions, selections |
| `--rotk-duration-slow` | 400ms | ease-in-out | Modal open/close |

### Animation Effects

```css
/* Gold Trim Shimmer */
@keyframes rotk-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.rotk-shimmer {
  background: linear-gradient(
    90deg,
    var(--rotk-gold) 0%,
    #F5D48A 25%,
    var(--rotk-gold) 50%,
    #F5D48A 75%,
    var(--rotk-gold) 100%
  );
  background-size: 200% 100%;
  animation: rotk-shimmer 3s ease-in-out infinite;
}

/* Damage Number Float */
@keyframes rotk-damage-float {
  0% { opacity: 1; transform: translateY(0) scale(1); }
  50% { opacity: 1; transform: translateY(-20px) scale(1.1); }
  100% { opacity: 0; transform: translateY(-40px) scale(0.9); }
}

/* Panel Entrance */
@keyframes rotk-panel-enter {
  0% { opacity: 0; transform: scale(0.95) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

/* Brush Stroke Reveal */
@keyframes rotk-brush-reveal {
  0% { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0 0 0); }
}
```

### VFX Guidelines

- **Combat hit sparks**: Brief particle burst (200ms), gold/orange palette
- **Healing**: Jade green rising particles
- **Critical hits**: Screen edge flash + larger damage number
- **Status changes**: Subtle icon pulse with color glow

---

## Component Library

### 1. Top Resource HUD Bar

```
┌─────────────────────────────────────────────────────────────────┐
│ [季节图标] 建安十年 春 │ ⚔️ 3/5 行动点 │ 💰 1,250 │ 🌾 890 │ ⚙️ │
└─────────────────────────────────────────────────────────────────┘
```

**Elements:**
- Date/Season display (Cinzel heading font)
- Action point counter (circular pips)
- Resource counters (icon + value)
- System buttons (settings, menu)

### 2. Circular Building Pins

**States:**
- Default: Bronze rim, parchment fill, building icon
- Hover: Gold rim glow, slight scale up (1.05x)
- Selected: Cinnabar border, gold shimmer
- Disabled: Grayscale, reduced opacity (0.6)

**Anatomy:**
```
      ╭──────╮
     ╱   🏠   ╲   ← Building icon (48px)
    │  Farm   │   ← Label (optional)
     ╲       ╱
      ╰──────╯
         │
         ▼       ← Pin stem (pointing to world position)
```

### 3. Character Portrait Plates

**Left-Side Layout:**
```
┌─────────────────────────┐
│ ┌─────────┐             │
│ │Portrait │  曹操        │ ← Name (Cinzel)
│ │ Image   │  Prime      │ ← Title
│ │         │  Minister   │
│ └─────────┘             │
│ ─────────────────────── │ ← Dialogue divider
│ "我们必须团结一致..."    │ ← Dialogue text box
└─────────────────────────┘
```

### 4. Battle HUD

**Layout:**
```
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ┌─────────────┐                         ┌─────────────┐         │
│  │ Left Unit   │         ⚔️              │ Right Unit  │         │
│  │ ▓▓▓▓▓▓░░░░ │         ←→              │ ▓▓▓▓▓▓▓░░░ │         │
│  │ HP: 85/120 │      [STATUS]           │ HP: 102/150 │         │
│  │ 🛡️ 12  ⚡8  │                         │ 🛡️ 8   ⚡15 │         │
│  │ 「枪阵」    │                         │ 「反击」    │         │
│  └─────────────┘                         └─────────────┘         │
│                                                                   │
│              ╭─ -45 ─╮      ╭─ +12 ─╮                            │
│              │       │      │       │  ← Floating numbers         │
│              ╰───────╯      ╰───────╯                            │
└───────────────────────────────────────────────────────────────────┘
```

**Elements:**
- Left/Right character panels (portrait + stats)
- Center clash indicator (crossed weapons)
- Advantage/status chips
- Floating damage/heal numbers with glow
- Skill name banners (brush stroke style)

### 5. Bottom Navigation Bar

```
┌─────────────────────────────────────────────────────────────────┐
│ [人事] │ [军事] │ [谋略] │ [外交] │ [政策] │ [间谍] │
│ Personnel│Military│ Plots │Diplomacy│ Policy │Espionage│
└─────────────────────────────────────────────────────────────────┘
```

**States:**
- Default: Parchment button, bronze border
- Hover: Gold border highlight
- Selected: Cinnabar background, gold text
- Disabled: Grayscale, reduced opacity

### 6. Status Chips

**Buff Chip (Jade):**
```
╭──────────────╮
│ ⬆️ ATK +15% │  ← Jade green background
╰──────────────╯
```

**Debuff Chip (Cinnabar):**
```
╭──────────────╮
│ ⬇️ DEF -10% │  ← Deep red background
╰──────────────╯
```

### 7. Tooltip/Modal

**Parchment Tooltip:**
```
     ▲ (arrow)
┌────────────────────────┐
│ ┌──┐ ┌──────────────┐  │  ← Bronze corner ornaments
│ │  │ │ Item Name    │  │
│ │Icon│ Description  │  │
│ │  │ │ text here... │  │
│ └──┘ └──────────────┘  │
│ ┌──────────────────────┐│
│ │ [Use]    [Discard]  ││  ← Action buttons
│ └──────────────────────┘│
└────────────────────────┘
```

---

## Implementation Guide

### Setting Up Theme

1. Import CSS variables in your root stylesheet:
```css
@import './styles/variables.css';
@import './styles/rotk-theme.css';
```

2. Use the TypeScript theme object for component props:
```tsx
import { rotkTheme } from './styles/rotkTheme';

<Panel variant="parchment" corners="ornate">
  {children}
</Panel>
```

### Adding New Building Pin

```tsx
import { BuildingPin } from './components/ui/BuildingPin';

<BuildingPin
  icon="farm"
  label="Farm"
  level={3}
  position={{ x: 0.25, y: 0.4 }}
  onClick={() => handleBuildingClick('farm')}
/>
```

### Adding New Nav Tab

```tsx
import { NavBar } from './components/ui/NavBar';

const tabs = [
  { id: 'personnel', label: '人事', icon: 'users' },
  { id: 'military', label: '军事', icon: 'sword' },
  // ... more tabs
];

<NavBar tabs={tabs} activeTab={currentTab} onTabChange={setCurrentTab} />
```

### Adding New Battle Unit Card

```tsx
import { UnitCard } from './components/battle/UnitCard';

<UnitCard
  unit={{
    name: '曹操',
    portrait: '/assets/characters/caocao.png',
    hp: 85,
    maxHp: 120,
    guard: 12,
    strain: 8,
    skill: '枪阵'
  }}
  side="left"
  isActive={true}
/>
```

---

## Asset Pipeline

### Naming Convention

```
[category]-[name]-[variant]_[state].[ext]

Examples:
- panel-parchment-9slice_normal.png
- btn-lacquer-primary_hover.png
- icon-building-farm.svg
- chip-buff-attack.svg
```

### Export Settings

| Type | Format | Optimization |
|------|--------|--------------|
| Icons | SVG | SVGO optimized, <10KB |
| Panels (9-slice) | PNG-24 with alpha | TinyPNG, <50KB |
| Backgrounds | WebP | Squoosh, <200KB |
| VFX Sprites | PNG sprite sheet | <100KB per sheet |

### Directory Structure

```
public/assets/ui/
├── icons/
│   ├── nav/
│   ├── buildings/
│   ├── resources/
│   ├── actions/
│   └── status/
├── panels/
│   ├── parchment/
│   └── lacquer/
├── decorations/
│   ├── corners/
│   ├── dividers/
│   └── frames/
├── bars/
│   ├── hp/
│   ├── ae/
│   └── strain/
├── overlays/
│   ├── ink-wash.png
│   ├── vignette.png
│   └── brush-stroke.svg
└── textures/
    ├── noise-grain.png
    └── paper-fiber.png
```

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-12-12 | 1.0.0 | Initial style guide creation |

---

*Last updated: December 12, 2025*
