# P2: UI Enhancements Upload Guide

**Priority:** 🟡 HIGH  
**Total Assets:** 27 images  
**Status:** 0/27 uploaded

## Why This is Priority 2

These UI enhancements provide:
- ✅ Visual polish and professional appearance
- ✅ Theme consistency across the application
- ✅ Enhanced user experience
- ✅ Chinese period aesthetic integration

---

## Banners (6 images)

**Upload to:** `banners/` subfolder

**Specifications:**
- Format: WebP (preferred) or PNG
- Size: 1920x300px (standard), 3840x600px (retina)
- File naming: `banner-{section}-{variant}_1x.webp`
- Max size: 200KB per file

**Required:**
- [ ] `banner-home-main_1x.webp` - Main landing page banner
- [ ] `banner-character-creation_1x.webp` - Character creator header
- [ ] `banner-combat-arena_1x.webp` - Combat screen header
- [ ] `banner-wiki-library_1x.webp` - Wiki/SRD section header
- [ ] `banner-world-map_1x.webp` - World map header
- [ ] `banner-city-hub_1x.webp` - City/hub screen header

**Design Guidelines:**
- Chinese calligraphy elements or seal script
- Traditional colors: red, gold, jade, black
- Dynasty-era motifs: dragons, phoenixes, clouds
- Leave space for text overlays in center/left

---

## Textures (5 images)

**Upload to:** `textures/` subfolder

**Specifications:**
- Format: PNG with alpha channel
- Size: 512x512px (must tile seamlessly)
- File naming: `texture-{name}_1x.png`
- Max size: 100KB per file

**Required:**
- [ ] `texture-paper-aged_1x.png` - Aged paper for panels
- [ ] `texture-silk-brocade_1x.png` - Subtle silk pattern
- [ ] `texture-wood-grain_1x.png` - Wood grain for frames
- [ ] `texture-stone-carved_1x.png` - Carved stone texture
- [ ] `texture-jade-surface_1x.png` - Jade material

**Design Guidelines:**
- Subtle patterns for text readability
- Neutral colors compatible with UI text
- Seamless tiling on all edges
- Test tile pattern before uploading

---

## Buttons (16 images)

**Upload to:** `buttons/` subfolder

**Specifications:**
- Format: PNG with alpha or SVG
- Size: 200x60px (base), provide 1x and 2x
- File naming: `btn-{style}-{state}_1x.png`
- Max size: 50KB per file

**Required:**

### Primary Buttons (4 states)
- [ ] `btn-primary-normal_1x.png` - Default state
- [ ] `btn-primary-hover_1x.png` - Hover state (glow effect)
- [ ] `btn-primary-pressed_1x.png` - Pressed state (darken)
- [ ] `btn-primary-disabled_1x.png` - Disabled state (50% opacity)

### Secondary Buttons (4 states)
- [ ] `btn-secondary-normal_1x.png` - Default state
- [ ] `btn-secondary-hover_1x.png` - Hover state
- [ ] `btn-secondary-pressed_1x.png` - Pressed state
- [ ] `btn-secondary-disabled_1x.png` - Disabled state

### Themed Buttons (8 states)
- [ ] `btn-combat-normal_1x.png` - Red/combat themed
- [ ] `btn-combat-hover_1x.png` - Combat hover
- [ ] `btn-fate-normal_1x.png` - Purple/mystical themed
- [ ] `btn-fate-hover_1x.png` - Fate hover
- [ ] `btn-cancel-normal_1x.png` - Gray/cancel themed
- [ ] `btn-cancel-hover_1x.png` - Cancel hover
- [ ] `btn-confirm-normal_1x.png` - Green/confirm themed
- [ ] `btn-confirm-hover_1x.png` - Confirm hover

**Design Guidelines:**
- Ornate borders from traditional Chinese frames
- Subtle gradient or texture fill
- Text-readable in all states
- Hover: slight glow or color shift
- Pressed: darken ~10%
- Disabled: 50% opacity

---

## Processing Command

After uploading files:

```bash
./tools/asset_pipeline_manager.py process
./tools/asset_pipeline_manager.py stage
./tools/asset_pipeline_manager.py list --status pending
./tools/asset_pipeline_manager.py approve --id <asset_id>
./tools/asset_pipeline_manager.py deploy --target frontend
```

## Progress Tracker

- Banners: 0/6 uploaded
- Textures: 0/5 uploaded  
- Buttons: 0/16 uploaded
- **Total: 0/27 uploaded**
