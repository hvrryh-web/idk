# Fate Deck Card Assets

This directory contains all visual art assets for the Fate Deck card system in the WuXuxian TTRPG.

## Directory Structure

```
fate-cards/
├── backs/              # Card back designs
│   └── card-back.svg   # Universal card back with Yin-Yang motif
├── death/              # Death card illustrations
│   ├── silent-river.svg
│   ├── burning-phoenix.svg
│   ├── void-mirror.svg
│   └── eternal-watcher.svg
├── body/               # Body card illustrations
│   ├── stone-anchor.svg
│   ├── lightning-step.svg
│   ├── iron-mountain.svg
│   ├── serpent-coil.svg
│   └── crane-stance.svg
├── seed/               # Seed card illustrations
│   ├── azure-flow.svg
│   ├── crimson-fury.svg
│   ├── jade-serenity.svg
│   ├── silver-lightning.svg
│   └── obsidian-void.svg
├── frames/             # Card frame templates
│   ├── frame-death.svg # Gray/void themed frame
│   ├── frame-body.svg  # Red/orange martial themed frame
│   └── frame-seed.svg  # Green elemental themed frame
└── fate_cards_manifest.json  # Asset manifest
```

## Card Types

### Death Cards (4 cards)
Represent how a character faces mortality and endings. Visual themes use gray, muted tones, and void/ethereal imagery.

| Card | File | Theme | Description |
|------|------|-------|-------------|
| Silent River | `silent-river.svg` | Water/Peace | Serene river with moonlight |
| Burning Phoenix | `burning-phoenix.svg` | Fire/Rebirth | Phoenix rising from flames |
| Void Mirror | `void-mirror.svg` | Void/Truth | Mirror with fragmented reflection |
| Eternal Watcher | `eternal-watcher.svg` | Time/Patience | Great eye with hourglass symbols |

### Body Cards (5 cards)
Represent physical form and combat style. Visual themes use red, orange, and earthy tones with martial imagery.

| Card | File | Theme | Description |
|------|------|-------|-------------|
| Stone Anchor | `stone-anchor.svg` | Earth/Defense | Immovable anchor stone |
| Lightning Step | `lightning-step.svg` | Electricity/Speed | Lightning bolt striking |
| Iron Mountain | `iron-mountain.svg` | Mountain/Durability | Iron mountain with snow peak |
| Serpent Coil | `serpent-coil.svg` | Flexibility/Cunning | Coiled serpent in jungle |
| Crane Stance | `crane-stance.svg` | Grace/Balance | Elegant crane at twilight |

### Seed Cards (5 cards)
Represent elemental affinities and core nature. Visual themes vary by elemental color.

| Card | File | Colour | Aspect | Description |
|------|------|--------|--------|-------------|
| Azure Flow | `azure-flow.svg` | Blue | Mind | Flowing waters with insight eye |
| Crimson Fury | `crimson-fury.svg` | Red | Body | Burning rage core with flames |
| Jade Serenity | `jade-serenity.svg` | Green | Soul | Jade stone in bamboo garden |
| Silver Lightning | `silver-lightning.svg` | Blue | Mind | Silver lightning with precision |
| Obsidian Void | `obsidian-void.svg` | Black | Soul | Void consuming matter and light |

## Dimensions

- **Card Art**: 250 × 180 pixels (SVG, scalable)
- **Card Frames**: 300 × 420 pixels (SVG, scalable)
- **Card Backs**: 300 × 420 pixels (SVG, scalable)

## Usage in Code

### Accessing Card Art
Card art paths are stored in the `artPath` property of each `FateCard` object:

```typescript
import { DEATH_CARDS, BODY_CARDS, SEED_CARDS } from '../data/fateCards';

// Get art path for a specific card
const card = DEATH_CARDS.find(c => c.id === 'death-burning-phoenix');
console.log(card.artPath); // "/assets/fate-cards/death/burning-phoenix.svg"
```

### Displaying Card Art in Components
The `FateCardDisplay` component automatically shows card art when available:

```tsx
import FateCardDisplay from './components/FateCardDisplay';
import { DEATH_CARDS } from './data/fateCards';

function CardGallery() {
  return (
    <div>
      {DEATH_CARDS.map(card => (
        <FateCardDisplay 
          key={card.id} 
          card={card} 
          size="medium"
          showArt={true}  // Enable card art display
        />
      ))}
    </div>
  );
}
```

### Using the Manifest
The manifest can be loaded for dynamic asset discovery:

```typescript
import manifest from '../public/assets/fate-cards/fate_cards_manifest.json';

// Get all Death card art paths
const deathCards = manifest.cards.death;
deathCards.forEach(card => {
  console.log(`${card.name}: ${card.artPath}`);
});
```

## Customization

### Adding New Cards
1. Create the SVG art file in the appropriate type directory
2. Add the card data to `frontend/src/data/fateCards.ts`
3. Include the `artPath` property pointing to the SVG file
4. Update the manifest in `fate_cards_manifest.json`

### Modifying Art Style
All assets are SVG format and can be edited with:
- Inkscape (free)
- Adobe Illustrator
- Figma
- Any text editor (SVGs are XML)

### Art Guidelines
- Use the established color palette for each card type
- Maintain consistent dimensions (250×180 for art, 300×420 for frames)
- Include gradients and filters for depth
- Keep file sizes under 10KB when possible
- Use descriptive IDs for gradients and filters

## Color Palettes

### Death Cards
- Primary: `#2d2d2d` (dark gray)
- Secondary: `#6b6b6b` (medium gray)
- Accent: `#4a4a4a` (void gray)

### Body Cards
- Primary: `#3d1515` (dark red)
- Secondary: `#d35400` (orange)
- Accent: `#8b3500` (rust)

### Seed Cards (by colour)
- Blue: `#1a2a4a` → `#6aaaee`
- Red: `#4a1515` → `#ff5050`
- Green: `#1a3a2a` → `#7aca9a`
- Black: `#0a0a15` → `#5a5a8a`

## License
These assets are part of the WuXuxian TTRPG project and are licensed under the project's main license.

---
**Last Updated**: 2025-12-12
