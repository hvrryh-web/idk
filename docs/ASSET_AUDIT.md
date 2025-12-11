# Asset Audit & Inventory for WuXuxian TTRPG

**Date:** 2025-12-11  
**Purpose:** Track all visual assets for the UI/UX redesign project  
**Status:** In Progress

---

## Current Assets Inventory

### Existing Files

| Asset Name | Path | Type | Size | Resolution | Usage | Source File | Owner | Status |
|------------|------|------|------|------------|-------|-------------|-------|--------|
| styles.css | frontend/src/styles.css | CSS | ~730 lines | N/A | All styling | styles.css | Dev Team | ✅ Existing |
| index.html | frontend/index.html | HTML | Small | N/A | App container | index.html | Dev Team | ✅ Existing |

### Missing Critical Assets

| Asset Name | Type | Priority | Size Target | Resolution | Format | Status | Notes |
|------------|------|----------|-------------|------------|--------|--------|-------|
| **UI Components** | | | | | | | |
| btn-primary-normal | UI Button | P1 | <50KB | 200x60 @ 1x, 2x | PNG-24/SVG | ❌ Missing | All states needed |
| btn-secondary-normal | UI Button | P1 | <50KB | 200x60 @ 1x, 2x | PNG-24/SVG | ❌ Missing | All states needed |
| btn-danger-normal | UI Button | P1 | <50KB | 200x60 @ 1x, 2x | PNG-24/SVG | ❌ Missing | All states needed |
| panel-primary | UI Panel | P1 | <50KB | 512x512 @ 1x, 2x | PNG-24 9-slice | ❌ Missing | Main content panels |
| panel-secondary | UI Panel | P1 | <50KB | 512x512 @ 1x, 2x | PNG-24 9-slice | ❌ Missing | Nested containers |
| modal-overlay | UI Overlay | P1 | <30KB | 1920x1080 | PNG-24 | ❌ Missing | Modal backgrounds |
| hud-stat-bar | HUD | P1 | <20KB | Various | SVG/PNG | ❌ Missing | Health, energy bars |
| hud-stat-frame | HUD | P1 | <20KB | Various | PNG-24 | ❌ Missing | Stat displays |
| **Icons** | | | | | | | |
| icon-home | Navigation | P1 | <10KB | 24, 48, 96px | SVG + PNG | ❌ Missing | Home/game room |
| icon-character | Navigation | P1 | <10KB | 24, 48, 96px | SVG + PNG | ❌ Missing | Character sheets |
| icon-combat | Navigation | P1 | <10KB | 24, 48, 96px | SVG + PNG | ❌ Missing | Combat view |
| icon-wiki | Navigation | P1 | <10KB | 24, 48, 96px | SVG + PNG | ❌ Missing | Knowledge base |
| icon-help | Navigation | P1 | <10KB | 24, 48, 96px | SVG + PNG | ❌ Missing | Help page |
| icon-settings | Navigation | P1 | <10KB | 24, 48, 96px | SVG + PNG | ❌ Missing | Settings |
| icon-back | Navigation | P1 | <10KB | 24, 48, 96px | SVG + PNG | ❌ Missing | Navigation back |
| icon-stat-essence | Stat | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Soul stat |
| icon-stat-resolve | Stat | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Soul stat |
| icon-stat-presence | Stat | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Soul stat |
| icon-stat-strength | Stat | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Body stat |
| icon-stat-endurance | Stat | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Body stat |
| icon-stat-agility | Stat | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Body stat |
| icon-stat-technique | Stat | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Mind stat |
| icon-stat-willpower | Stat | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Mind stat |
| icon-stat-focus | Stat | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Mind stat |
| icon-stat-control | Stat | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Aether stat |
| icon-stat-fate | Stat | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Aether stat |
| icon-stat-spirit | Stat | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Aether stat |
| icon-stat-thp | Stat | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Combat stat |
| icon-stat-ae | Stat | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Combat stat |
| icon-stat-dr | Stat | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Combat stat |
| icon-stat-guard | Stat | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Combat stat |
| icon-stat-strain | Stat | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Combat stat |
| icon-action-attack | Action | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Combat action |
| icon-action-defend | Action | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Combat action |
| icon-action-technique | Action | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Combat action |
| icon-action-quick | Action | P1 | <10KB | 32, 64px | SVG + PNG | ❌ Missing | Combat action |
| **Fonts** | | | | | | | |
| cinzel-regular | Web Font | P1 | <100KB | N/A | WOFF2 | ❌ Missing | Headings |
| cinzel-bold | Web Font | P1 | <100KB | N/A | WOFF2 | ❌ Missing | Strong headings |
| inter-regular | Web Font | P1 | <100KB | N/A | WOFF2 | ❌ Missing | Body text |
| inter-semibold | Web Font | P1 | <100KB | N/A | WOFF2 | ❌ Missing | UI emphasis |
| jetbrains-mono | Web Font | P1 | <100KB | N/A | WOFF2 | ❌ Missing | Monospace/stats |
| **Backgrounds** | | | | | | | |
| bg-game-room | Background | P2 | <200KB | 1920x1080 @ 1x, 2x | WebP | ❌ Missing | Main game room |
| bg-character-sheet | Background | P2 | <200KB | 1920x1080 @ 1x, 2x | WebP | ❌ Missing | Character pages |
| bg-combat-arena | Background | P2 | <200KB | 1920x1080 @ 1x, 2x | WebP | ❌ Missing | Combat view |
| bg-cultivation-realm | Background | P2 | <200KB | 1920x1080 @ 1x, 2x | WebP | ❌ Missing | Cultivation pages |
| **Decorations** | | | | | | | |
| decoration-corner-tl | Decorative | P2 | <15KB | Scalable | SVG | ❌ Missing | Panel corners |
| decoration-corner-tr | Decorative | P2 | <15KB | Scalable | SVG | ❌ Missing | Panel corners |
| decoration-corner-bl | Decorative | P2 | <15KB | Scalable | SVG | ❌ Missing | Panel corners |
| decoration-corner-br | Decorative | P2 | <15KB | Scalable | SVG | ❌ Missing | Panel corners |
| decoration-divider-h | Decorative | P2 | <15KB | Scalable | SVG | ❌ Missing | Horizontal divider |
| decoration-divider-v | Decorative | P2 | <15KB | Scalable | SVG | ❌ Missing | Vertical divider |
| **Loading/Splash** | | | | | | | |
| splash-logo | Branding | P2 | <50KB | 512x512 | SVG | ❌ Missing | Game logo |
| splash-background | Splash | P2 | <200KB | 1920x1080 | WebP | ❌ Missing | Loading screen |
| loading-spinner | Animation | P2 | <20KB | 64x64 | SVG/Lottie | ❌ Missing | Loading indicator |
| favicon | Meta | P2 | <10KB | 16, 32, 48px | ICO | ❌ Missing | Browser icon |
| apple-touch-icon | Meta | P2 | <30KB | 180x180 | PNG | ❌ Missing | iOS icon |
| og-image | Meta | P2 | <100KB | 1200x630 | PNG | ❌ Missing | Social preview |
| **Effects/VFX** | | | | | | | |
| vfx-hit-impact | Effect | P3 | <100KB | 512x512 sheet | PNG sprite | ❌ Missing | Combat effect |
| vfx-heal-sparkle | Effect | P3 | <100KB | 512x512 sheet | PNG sprite | ❌ Missing | Healing effect |
| vfx-buff-aura | Effect | P3 | <100KB | 512x512 sheet | PNG sprite | ❌ Missing | Buff effect |
| effect-aether-glow | Effect | P3 | <100KB | 1024x1024 sheet | PNG sprite | ❌ Missing | Energy glow |
| **Animations** | | | | | | | |
| anim-button-hover | Animation | P3 | <30KB | N/A | Lottie JSON | ❌ Missing | Button interaction |
| anim-stat-increase | Animation | P3 | <30KB | N/A | Lottie JSON | ❌ Missing | Level up effect |
| anim-energy-pulse | Animation | P3 | <30KB | N/A | Lottie JSON | ❌ Missing | Energy animation |

---

## Asset Statistics

### Current State
- **Total Assets Identified:** 70+ assets needed
- **Existing Assets:** 2 (CSS and HTML only)
- **Missing Assets:** 68+
- **Estimated Total Size:** ~3-4 MB (optimized)

### By Priority
- **Priority 1 (Critical):** 35 assets - Buttons, panels, core icons, fonts
- **Priority 2 (High Value):** 25 assets - Backgrounds, decorations, loading screens
- **Priority 3 (Polish):** 10+ assets - Effects, animations, VFX

### By Category
- **UI Components:** 8 assets (buttons, panels, HUD)
- **Icons:** 30 assets (navigation, stats, actions)
- **Fonts:** 5 font files
- **Backgrounds:** 4 background images
- **Decorations:** 6 decorative elements
- **Loading/Splash:** 6 meta assets
- **Effects/VFX:** 4 effect sheets
- **Animations:** 3+ animation files

---

## Progress Tracking

### Week 1-2: Foundation
- [ ] Create asset directory structure
- [ ] Set up CSS variables system
- [ ] Create Figma design file
- [ ] Define complete asset list

### Week 3-4: Core UI
- [ ] Design and export button system (3 variants × 4 states)
- [ ] Create panel backgrounds (2 types)
- [ ] Design navigation icons (7 icons)
- [ ] Create basic HUD elements

### Week 5-6: Icons & Fonts
- [ ] Complete stat icon set (17 icons)
- [ ] Create action icons (4 icons)
- [ ] Source and integrate web fonts (5 fonts)
- [ ] Create favicon and meta images

### Week 7-8: Backgrounds & Decorations
- [ ] Create/source background art (4 images)
- [ ] Design decorative elements (6 SVGs)
- [ ] Create loading/splash assets (3 items)

### Week 9-10: Effects & Polish
- [ ] Create VFX sprite sheets (4 sheets)
- [ ] Design Lottie animations (3 animations)
- [ ] Final optimization pass
- [ ] QA and testing

---

## File Size Tracking

### Budget Allocation
| Category | Target Size | Current Size | Status |
|----------|-------------|--------------|--------|
| UI Components | 400 KB | 0 KB | 🔴 Not Started |
| Icons | 300 KB | 0 KB | 🔴 Not Started |
| Fonts | 500 KB | 0 KB | 🔴 Not Started |
| Backgrounds | 800 KB | 0 KB | 🔴 Not Started |
| Decorations | 90 KB | 0 KB | 🔴 Not Started |
| Loading/Splash | 250 KB | 0 KB | 🔴 Not Started |
| Effects/VFX | 400 KB | 0 KB | 🔴 Not Started |
| Animations | 90 KB | 0 KB | 🔴 Not Started |
| **Total** | **~3 MB** | **0 KB** | 🔴 0% Complete |

---

## Integration Status by Page

### GameRoom.tsx
- [ ] Hero section background
- [ ] Launch button styled with new assets
- [ ] Navigation icons
- [ ] Character roster cards
- Status: 🔴 0% Complete

### Character Sheets (Profile, Cultivation, SoulCore, DomainSource)
- [ ] Character sheet background
- [ ] Stat icons (all 12 primary stats)
- [ ] Progress bars with new HUD elements
- [ ] Panel backgrounds for sections
- [ ] Decorative corners
- Status: 🔴 0% Complete

### Combat View
- [ ] Combat arena background
- [ ] Combat stat icons (THP, AE, DR, Guard, Strain)
- [ ] Action icons
- [ ] HUD elements
- [ ] VFX effects
- Status: 🔴 0% Complete

### Wiki & Help Pages
- [ ] Page backgrounds
- [ ] Search icons
- [ ] Article icons
- [ ] Navigation elements
- Status: 🔴 0% Complete

---

## Notes & Decisions

### 2025-12-11: Initial Audit
- Identified that the application has NO existing visual assets beyond CSS
- This is a greenfield asset creation project
- Priority should be on P1 assets (UI components, core icons, fonts)
- Consider using free/open-source assets initially for rapid prototyping
- Budget for custom commissioned art if needed for backgrounds

### Design Decisions
- **Art Style:** Modern Xianxia with clean UI (not pixel art)
- **Color Palette:** Dark theme with aether blue primary, cultivation stage colors
- **Typography:** Cinzel for headings (elegant), Inter for body (readable)
- **Icon Style:** Line icons with subtle fills, consistent stroke weight
- **9-Slice:** Required for panels and buttons to support responsive sizing

### Technical Constraints
- Web platform (Vite + React)
- Must support 1x and 2x pixel densities
- No runtime image generation (all assets pre-rendered)
- Target modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile support (responsive down to 320px width)

---

## Action Items

### Immediate (This Week)
1. ✅ Create this audit document
2. ✅ Create UI/UX Redesign Plan document
3. [ ] Set up asset directory structure in `/frontend/public/assets/`
4. [ ] Create CSS variables file with design tokens
5. [ ] Set up Figma workspace

### Short Term (Next 2 Weeks)
1. [ ] Design button system in Figma
2. [ ] Create/source free icon set for prototyping
3. [ ] Integrate Google Fonts (temporary until custom fonts ready)
4. [ ] Create first background image (game room)
5. [ ] Update one page (GameRoom) with new styles as proof of concept

### Medium Term (Weeks 3-6)
1. [ ] Complete all P1 assets
2. [ ] Integrate assets across all pages
3. [ ] Commission custom artwork if budget allows
4. [ ] Performance testing and optimization

### Long Term (Weeks 7-10)
1. [ ] Add P2 assets (backgrounds, decorations)
2. [ ] Add P3 assets (effects, animations)
3. [ ] Final polish and QA
4. [ ] Documentation and handoff

---

## Resources & Links

### Free Asset Sources (For Prototyping)
- **Icons:** Heroicons, Feather Icons, Lucide Icons
- **Fonts:** Google Fonts (Cinzel, Inter available)
- **Backgrounds:** Unsplash, Pexels (with attribution)
- **Textures:** Subtle Patterns, TextureKing
- **VFX:** OpenGameArt, itch.io (with licensing check)

### Paid Asset Sources (If Budget Available)
- **Icon Packs:** Noun Project, Flaticon
- **Backgrounds:** ArtStation, DeviantArt commissions
- **Fonts:** Adobe Fonts, MyFonts
- **VFX:** Unity Asset Store, GameDev Market

### Tools
- **Design:** Figma (free tier), GIMP/Photoshop
- **Optimization:** Squoosh, ImageOptim, SVGO
- **Animation:** LottieFiles, After Effects
- **Sprite Sheets:** TexturePacker, ShoeBox

---

**Last Updated:** 2025-12-11  
**Next Review:** 2025-12-18 (Weekly updates)  
**Owner:** Development Team
