# Assets Directory

This directory contains all visual assets for the WuXuxian TTRPG web application.

## Directory Structure

```
assets/
├── ui/                    # UI Components
│   ├── buttons/          # Button graphics (normal, hover, pressed, disabled states)
│   ├── panels/           # Panel backgrounds (9-slice capable)
│   └── hud/              # HUD elements (stat bars, frames, overlays)
├── icons/                # Icon assets
│   ├── navigation/       # Navigation icons (home, back, settings, etc.)
│   ├── stats/            # Stat icons (essence, strength, control, etc.)
│   ├── actions/          # Action icons (attack, defend, technique, etc.)
│   └── status/           # Status icons (loading, success, warning, error)
├── backgrounds/          # Background images for pages and sections
├── decorations/          # Decorative elements (corners, dividers, accents)
├── effects/              # VFX and particle effect sprite sheets
├── fonts/                # Web fonts (WOFF2 format)
└── splash/               # Loading screens, splash art, logos
```

## Naming Convention

All assets follow the naming pattern: `[category]-[name]-[variant]_[scale].[ext]`

### Examples
- `btn-primary-normal_1x.png` - Primary button, normal state, 1x resolution
- `btn-primary-normal_2x.png` - Primary button, normal state, 2x resolution (retina)
- `icon-stat-essence.svg` - Stat icon for essence, vector format
- `bg-game-room_1x.webp` - Game room background, 1x resolution
- `bg-game-room_2x.webp` - Game room background, 2x resolution

### Rules
- All lowercase
- Hyphen-separated words
- Underscore before scale suffix
- Descriptive and consistent
- Group by category prefix

## File Formats

- **UI Components:** PNG-24 (with alpha) or SVG
- **Icons:** SVG (master) + PNG exports (24px, 48px, 96px for raster fallbacks)
- **Backgrounds:** WebP (preferred) with PNG fallback
- **Fonts:** WOFF2 only (best compression and modern browser support)
- **Effects:** PNG sprite sheets with JSON metadata
- **Animations:** Lottie JSON or CSS keyframes

## Resolution Guidelines

### Raster Assets
- **1x (base):** Standard resolution for 96 DPI displays
- **2x (retina):** Double resolution for high-DPI displays (192+ DPI)

### Responsive Images
Use `srcset` and `picture` elements in React components to serve appropriate resolution:

```tsx
<img 
  src="/assets/backgrounds/bg-game-room_1x.webp"
  srcSet="/assets/backgrounds/bg-game-room_2x.webp 2x"
  alt="Game Room Background"
/>
```

### Vector Assets (SVG)
- Preferred for icons and scalable UI elements
- Define viewBox for proper scaling
- Optimize with SVGO before committing
- Target size: <10KB per icon

## Optimization Targets

- **UI elements:** <50KB per asset
- **Icons (SVG):** <10KB each
- **Backgrounds (WebP):** <200KB (1x), <400KB (2x)
- **Fonts (WOFF2):** <100KB per weight
- **Total bundle:** <5MB initial load

## Integration

### CSS Reference
```css
/* Background image */
.game-room {
  background-image: url('/assets/backgrounds/bg-game-room_1x.webp');
}

/* Icon as background */
.icon-home {
  background-image: url('/assets/icons/navigation/icon-home.svg');
  width: 24px;
  height: 24px;
}
```

### React Component
```tsx
// With Vite, assets in public/ are served from root
function Navigation() {
  return <img src="/assets/icons/navigation/icon-home.svg" alt="Home" width={24} height={24} />;
}

// Or use dynamic imports from src/assets if you move assets there
// import homeIcon from '../assets/icons/navigation/icon-home.svg';
// return <img src={homeIcon} alt="Home" width={24} height={24} />;
```

## Asset Creation Workflow

1. **Design** - Create in Figma, Illustrator, or other design tools
2. **Export** - Export at required formats and resolutions
3. **Optimize** - Run through optimization tools (Squoosh, SVGO)
4. **Place** - Move to appropriate directory following naming convention
5. **Reference** - Update CSS or React components to use the asset
6. **Test** - Verify appearance and performance
7. **Commit** - Add to version control

## Quality Checklist

Before committing assets:
- [ ] Correct naming convention followed
- [ ] Optimized for web (compressed, appropriate format)
- [ ] Multiple resolutions provided (1x, 2x for critical assets)
- [ ] Tested in application (displays correctly)
- [ ] No visual artifacts (compression, half-pixels)
- [ ] File size within budget
- [ ] Source file documented (if applicable)

## Tools

### Optimization
- **Images:** [Squoosh](https://squoosh.app/), ImageOptim, TinyPNG
- **SVG:** [SVGO](https://github.com/svg/svgo), SVGOMG
- **Fonts:** FontForge, Glyphhanger (subsetting)

### Design
- **UI Design:** Figma, Adobe XD
- **Vector:** Illustrator, Inkscape
- **Raster:** Photoshop, GIMP
- **Animation:** After Effects + Bodymovin, LottieFiles

## Current Status

See [ASSET_AUDIT.md](../../../docs/ASSET_AUDIT.md) for complete inventory and progress tracking.

**Assets Created:** 0  
**Assets Planned:** 70+  
**Total Size:** 0 KB / ~3 MB target  

---

**Last Updated:** 2025-12-11  
**For Questions:** See docs/UI_UX_REDESIGN_PLAN.md
