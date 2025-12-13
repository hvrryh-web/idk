# P4: Environment Art Upload Guide

**Priority:** 🟢 LOWER  
**Total Assets:** 14 images  
**Status:** 0/14 uploaded

## Why This is Priority 4

These environment assets provide:
- ✅ Visual immersion and atmosphere
- ✅ World-building and variety
- ✅ Location-specific theming
- ✅ Map visual enhancements

While not critical for core functionality, they greatly enhance the user experience.

---

## Location Backgrounds (8 images)

**Upload to:** `locations/` subfolder

**Specifications:**
- Format: WebP (preferred) or JPEG
- Size: 1920x1080px (1x), 3840x2160px (2x)
- File naming: `bg-{location}_1x.webp`
- Max size: 500KB per file (1x)

**Required:**
- [ ] `bg-city-hub_1x.webp` - Main city hub/plaza scene
- [ ] `bg-throne-room_1x.webp` - Imperial throne room
- [ ] `bg-training-grounds_1x.webp` - Martial training area
- [ ] `bg-marketplace_1x.webp` - Bustling marketplace
- [ ] `bg-tavern_1x.webp` - Interior tavern/inn scene
- [ ] `bg-battlefield_1x.webp` - Open battlefield landscape
- [ ] `bg-mountain-path_1x.webp` - Mountain pathway
- [ ] `bg-forest-clearing_1x.webp` - Forest clearing

**Design Guidelines:**
- Period-appropriate architecture (Han Dynasty)
- Atmospheric lighting and mood
- Leave foreground clear for character placement
- Use depth and perspective
- Consider time of day variations

---

## Map Decorations (6 images)

**Upload to:** `maps/` subfolder

**Specifications:**
- Format: PNG with alpha (icons) or SVG (preferred)
- Size: 64x64px, 128x128px for icons
- File naming: `map-{type}-{name}.{svg|png}`
- Max size: 50KB per file

**Required:**
- [ ] `map-icon-city_1x.png` - City icon for maps
- [ ] `map-icon-fortress_1x.png` - Fortress/stronghold icon
- [ ] `map-icon-village_1x.png` - Village icon
- [ ] `map-icon-landmark_1x.png` - Special landmark icon
- [ ] `map-border-ornate.svg` - Ornate map border (tileable)
- [ ] `map-compass-rose.svg` - Decorative compass rose

**Design Guidelines:**
- Chinese cartography-inspired
- Traditional symbols and iconography
- Gold and red color accents
- Clear and readable at map zoom levels
- Simple designs that scale well

---

## Asset Sources

**Create Your Own:**
- Use AI art generators (Midjourney, Stable Diffusion)
- Commission artists familiar with wuxia/period aesthetics
- Use photo manipulation of real locations

**Stock Assets:**
- Search for "Han Dynasty architecture"
- Look for "Chinese historical buildings"
- Find "wuxia landscape art"
- Consider "period drama backgrounds"

**Free Resources:**
- Pixabay, Pexels (CC0 licensed)
- Unsplash (with proper attribution)
- Open Game Art (check licenses)

---

## Quality Standards

### Location Backgrounds
- Resolution: Minimum 1920x1080px
- Format: WebP > JPEG > PNG
- Compression: Optimize for web (< 500KB)
- Composition: Leave foreground ~30% clear
- Color grading: Consistent with game theme

### Map Icons
- Style: Consistent across all icons
- Size: Scalable, clear at 64x64px
- Format: SVG preferred for scalability
- Colors: Limited palette for cohesion
- Detail: Simple enough to recognize at small sizes

---

## Processing Command

```bash
./tools/asset_pipeline_manager.py process
./tools/asset_pipeline_manager.py stage
./tools/asset_pipeline_manager.py approve --id <asset_id>
./tools/asset_pipeline_manager.py deploy --target frontend
```

## Progress Tracker

- Locations: 0/8 uploaded
- Maps: 0/6 uploaded
- **Total: 0/14 uploaded**

---

## Tips for Creating Environment Art

### For Backgrounds:
1. Use perspective and depth
2. Include atmospheric effects (mist, lighting)
3. Consider different times of day
4. Add period-appropriate details
5. Test with character overlay placement

### For Map Icons:
1. Keep designs simple and symbolic
2. Use consistent line weight
3. Test at multiple zoom levels
4. Ensure contrast with map background
5. Consider color-blind accessibility
