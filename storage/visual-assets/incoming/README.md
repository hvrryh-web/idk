# Visual Assets Upload Folder

This directory is your **upload destination** for all 87 missing assets identified in the design gap analysis.

## Quick Start

1. **Download images** from their sources
2. **Place them** in the appropriate priority/category folder below
3. **Run the pipeline** to process and deploy them

```bash
# After uploading your files to the incoming folders:
cd /path/to/idk
./tools/asset_pipeline_manager.py process
./tools/asset_pipeline_manager.py stage
./tools/asset_pipeline_manager.py approve --id <asset_id>
./tools/asset_pipeline_manager.py deploy --target all
```

## Directory Structure

```
incoming/
├── p1-character-references/    # PRIORITY 1: Character References (20 assets)
│   ├── diao-chan/              # 10 reference images for Diao Chan
│   └── lu-bu/                  # 10 reference images for Lu Bu
│
├── p2-ui-enhancements/         # PRIORITY 2: UI Enhancements (27 assets)
│   ├── banners/                # 6 header banners
│   ├── textures/               # 5 background textures
│   └── buttons/                # 16 button graphics (4 states × 4 styles)
│
├── p3-ascii-base-models/       # PRIORITY 3: ASCII Base Models (26 assets)
│   ├── character-poses/        # 14 character pose references
│   ├── weapons-effects/        # 8 weapon and effect references
│   └── environment-elements/   # 4 environment elements
│
└── p4-environment-art/         # PRIORITY 4: Environment Art (14 assets)
    ├── locations/              # 8 location backgrounds
    └── maps/                   # 6 map decorations
```

---

## PRIORITY 1: Character References (20 Assets)

### Upload Location: `p1-character-references/`

**Critical for:** LoRA training, ComfyUI art generation, GM Control Panel

### Diao Chan (10 images)

**Upload to:** `p1-character-references/diao-chan/`

Download from: [GitHub Issue #92](https://github.com/hvrryh-web/idk/issues/92#issuecomment-3649199612)

**Required Files:**
```
diao-chan-001-fullbody-primary.jpg       # Full body pose, purple robes, primary reference
diao-chan-002-costume-variants.jpg       # Multiple costume variations sheet
diao-chan-003-artistic-portrait.jpg      # Soft painted style with ribbon weapon
diao-chan-004-closeup-portrait.jpg       # Detailed facial close-up
diao-chan-005-standing-pose.jpg          # Full body standing with weapon
diao-chan-006-reference.jpg              # Additional reference
diao-chan-007-reference.jpg              # Additional reference
diao-chan-008-reference.jpg              # Additional reference
diao-chan-009-reference.jpg              # Additional reference
diao-chan-010-reference.jpg              # Additional reference
```

**Image URLs:**
- 001: https://github.com/user-attachments/assets/54792596-238c-42e7-bf77-c55429382940
- 002: https://github.com/user-attachments/assets/85367db6-c196-4dca-8737-c79a7b3332c8
- 003: https://github.com/user-attachments/assets/81585c59-6139-44cd-acba-c6d36c805268
- 004: https://github.com/user-attachments/assets/18714f50-cc38-4521-b1e5-3a01f249602c
- 005: https://github.com/user-attachments/assets/193d7b73-3764-4b70-b762-5ec2ad71e0f5
- 006: https://github.com/user-attachments/assets/5be6ba86-82f9-40ae-bf35-5d73f7188dbe
- 007: https://github.com/user-attachments/assets/c33bc381-12b7-46cb-803e-209df95ef198
- 008: https://github.com/user-attachments/assets/08d05ca2-b65a-4b24-b17e-6bbab9ed483e
- 009: https://github.com/user-attachments/assets/594f25a4-8e9c-4f8d-bc59-d7c32df2c156
- 010: https://github.com/user-attachments/assets/07912207-4d9c-4656-bac4-ce1f0f871891

### Lu Bu (10 images)

**Upload to:** `p1-character-references/lu-bu/`

Download from: [GitHub Issue #92](https://github.com/hvrryh-web/idk/issues/92#issuecomment-3649199612)

**Required Files:**
```
lu-bu-001-fullbody-primary.jpg           # Full body armored, primary reference
lu-bu-002-costume-variants.jpg           # Multiple armor variations sheet
lu-bu-003-combat-pose.jpg                # Dynamic combat stance with weapon
lu-bu-004-portrait-detail.jpg            # Detailed facial close-up with armor
lu-bu-005-standing-reference.jpg         # Full standing pose, complete armor
lu-bu-006-reference.jpg                  # Additional reference
lu-bu-007-reference.jpg                  # Additional reference
lu-bu-008-reference.jpg                  # Additional reference
lu-bu-009-reference.jpg                  # Additional reference
lu-bu-010-reference.jpg                  # Additional reference
```

**Image URLs:**
- 001: https://github.com/user-attachments/assets/e7e00e23-f8d3-4a72-a1f8-1baea51679a2
- 002: https://github.com/user-attachments/assets/ee9c2343-d6f7-46fe-a175-8491b822d3ed
- 003: https://github.com/user-attachments/assets/bd0dd1d3-ad62-4fc0-b696-a8423d211f93
- 004: https://github.com/user-attachments/assets/31ae98f9-930e-4ae0-9416-99ada1cc3d86
- 005: https://github.com/user-attachments/assets/b84c0f2f-fd59-4141-bb27-706f5f2fc71e
- 006: https://github.com/user-attachments/assets/7260bac4-05fe-43cd-a4db-a2bc88b213ac
- 007: https://github.com/user-attachments/assets/b53b5017-d4db-41b5-8fa1-60a0b63dddf2
- 008: https://github.com/user-attachments/assets/24f68dae-bc41-44a1-a63d-ed0290962830
- 009: https://github.com/user-attachments/assets/4af1e41b-219d-481d-ab5a-8870a48bbe98
- 010: https://github.com/user-attachments/assets/70b73481-d50f-4783-88fc-4c305bc0d3eb

---

## PRIORITY 2: UI Enhancements (27 Assets)

### Upload Location: `p2-ui-enhancements/`

**Critical for:** Visual polish, theme consistency, enhanced user experience

### Banners (6 images)

**Upload to:** `p2-ui-enhancements/banners/`

**Specifications:**
- Format: WebP (preferred) or PNG
- Size: 1920x300px (1x), 3840x600px (2x for retina)
- Theme: Romance of Three Kingdoms / Wuxia aesthetic

**Required Files:**
```
banner-home-main_1x.webp                 # Main landing/home banner with logo area
banner-character-creation_1x.webp        # Character creation header
banner-combat-arena_1x.webp              # Combat screen header
banner-wiki-library_1x.webp              # Wiki/SRD section header  
banner-world-map_1x.webp                 # World map header
banner-city-hub_1x.webp                  # City/hub screen header
```

**Design Notes:**
- Incorporate Chinese calligraphy or seal script elements
- Use traditional color palettes (red, gold, jade, black)
- Include subtle dynasty-era motifs (dragons, phoenixes, clouds)
- Leave space for text overlays in center/left areas

### Textures (5 images)

**Upload to:** `p2-ui-enhancements/textures/`

**Specifications:**
- Format: PNG with alpha channel
- Size: 512x512px (tileable/seamless)
- Must tile without visible seams

**Required Files:**
```
texture-paper-aged_1x.png                # Aged paper texture for panels
texture-silk-brocade_1x.png              # Silk brocade pattern (subtle)
texture-wood-grain_1x.png                # Wood grain for UI frames
texture-stone-carved_1x.png              # Carved stone texture
texture-jade-surface_1x.png              # Jade material texture
```

**Design Notes:**
- Keep patterns subtle for readability
- Use neutral colors that work with UI text
- Ensure seamless tiling on all edges

### Buttons (16 images)

**Upload to:** `p2-ui-enhancements/buttons/`

**Specifications:**
- Format: PNG with alpha channel or SVG
- Size: 200x60px (base size), provide 1x and 2x
- States: normal, hover, pressed, disabled

**Required Files:**
```
# Primary action buttons (call-to-action)
btn-primary-normal_1x.png
btn-primary-hover_1x.png
btn-primary-pressed_1x.png
btn-primary-disabled_1x.png

# Secondary buttons (standard actions)
btn-secondary-normal_1x.png
btn-secondary-hover_1x.png
btn-secondary-pressed_1x.png
btn-secondary-disabled_1x.png

# Special themed buttons
btn-combat-normal_1x.png                 # Red/combat themed
btn-combat-hover_1x.png
btn-fate-normal_1x.png                   # Purple/mystical themed
btn-fate-hover_1x.png
btn-cancel-normal_1x.png                 # Gray/cancel themed
btn-cancel-hover_1x.png
btn-confirm-normal_1x.png                # Green/confirm themed
btn-confirm-hover_1x.png
```

**Design Notes:**
- Use ornate borders inspired by traditional Chinese frames
- Include subtle gradient or texture
- Ensure text remains readable in all states
- Hover: slight glow or color shift
- Pressed: darken slightly
- Disabled: reduce opacity to 50%

---

## PRIORITY 3: ASCII Base Models (26 Assets)

### Upload Location: `p3-ascii-base-models/`

**Critical for:** ASCII combat illustrations, simplified character art

### Character Poses (14 images)

**Upload to:** `p3-ascii-base-models/character-poses/`

**Specifications:**
- Format: PNG with transparency or high-contrast B&W
- Size: 512x512px (square) or 512x768px (full-body)
- High contrast silhouettes work best for ASCII conversion

**Required Files:**
```
# Diao Chan poses (6 poses)
ascii-char-diao-chan-idle.png            # Standing neutral pose
ascii-char-diao-chan-attack.png          # Attacking with weapon
ascii-char-diao-chan-defend.png          # Defensive stance
ascii-char-diao-chan-skill.png           # Using special ability
ascii-char-diao-chan-hurt.png            # Taking damage pose
ascii-char-diao-chan-victory.png         # Victory celebration

# Lu Bu poses (6 poses)
ascii-char-lu-bu-idle.png                # Standing neutral pose
ascii-char-lu-bu-attack.png              # Attacking with halberd
ascii-char-lu-bu-defend.png              # Defensive stance
ascii-char-lu-bu-skill.png               # Using special ability
ascii-char-lu-bu-hurt.png                # Taking damage pose
ascii-char-lu-bu-victory.png             # Victory celebration

# Generic warrior (2 poses for NPCs)
ascii-char-warrior-idle.png              # Generic warrior idle
ascii-char-warrior-attack.png            # Generic warrior attack
```

**Design Notes:**
- Simplified silhouettes work better than detailed images
- Strong pose lines and clear gestures
- Avoid small details that won't convert well to ASCII
- Can be derived from P1 character references using same LoRAs but simplified prompts

### Weapons & Effects (8 images)

**Upload to:** `p3-ascii-base-models/weapons-effects/`

**Specifications:**
- Format: PNG with transparency
- Size: 256x256px or 512x512px
- Clear silhouettes and shapes

**Required Files:**
```
ascii-weapon-sword.png                   # Straight sword silhouette
ascii-weapon-spear.png                   # Spear/lance silhouette
ascii-weapon-halberd.png                 # Fang Tian Ji (Lu Bu's weapon)
ascii-effect-slash.png                   # Slashing attack effect
ascii-effect-thrust.png                  # Thrusting attack effect
ascii-effect-qi-burst.png                # Qi energy burst
ascii-effect-fire.png                    # Fire element effect
ascii-effect-lightning.png               # Lightning element effect
```

### Environment Elements (4 images)

**Upload to:** `p3-ascii-base-models/environment-elements/`

**Specifications:**
- Format: PNG with transparency
- Size: 512x512px (tileable where appropriate)
- Simple, recognizable shapes

**Required Files:**
```
ascii-env-ground.png                     # Ground/terrain texture
ascii-env-rocks.png                      # Rock formations
ascii-env-trees.png                      # Tree silhouettes
ascii-env-walls.png                      # Wall/barrier structures
```

---

## PRIORITY 4: Environment Art (14 Assets)

### Upload Location: `p4-environment-art/`

**Critical for:** Immersion, visual variety, world-building

### Location Backgrounds (8 images)

**Upload to:** `p4-environment-art/locations/`

**Specifications:**
- Format: WebP (preferred) or JPEG
- Size: 1920x1080px (1x), 3840x2160px (2x for retina)
- Optimized file size (< 500KB for 1x)

**Required Files:**
```
bg-city-hub_1x.webp                      # Main city hub/plaza
bg-throne-room_1x.webp                   # Imperial throne room
bg-training-grounds_1x.webp              # Martial training area
bg-marketplace_1x.webp                   # Bustling marketplace
bg-tavern_1x.webp                        # Interior tavern/inn
bg-battlefield_1x.webp                   # Open battlefield
bg-mountain-path_1x.webp                 # Mountain pathway
bg-forest-clearing_1x.webp               # Forest clearing
```

**Design Notes:**
- Period-appropriate architecture (Han Dynasty style)
- Atmospheric lighting and mood
- Leave foreground area clear for character placement
- Use depth and perspective

### Map Decorations (6 images)

**Upload to:** `p4-environment-art/maps/`

**Specifications:**
- Format: PNG with alpha (icons) or SVG (preferred)
- Size: 64x64px, 128x128px (icons)
- Scalable and clear at small sizes

**Required Files:**
```
map-icon-city_1x.png                     # City icon for maps
map-icon-fortress_1x.png                 # Fortress/stronghold icon
map-icon-village_1x.png                  # Village icon
map-icon-landmark_1x.png                 # Special landmark icon
map-border-ornate.svg                    # Ornate map border (tileable)
map-compass-rose.svg                     # Decorative compass rose
```

**Design Notes:**
- Chinese cartography-inspired design
- Traditional symbols and iconography
- Gold and red color accents
- Clear and readable at map zoom levels

---

## File Naming Requirements

All uploaded files MUST follow this naming pattern:

```
{category}-{identifier}-{variant}_{scale}.{ext}

Examples:
✅ character-diao-chan-portrait_1x.jpg
✅ ui-button-primary-hover_2x.png
✅ ascii-char-warrior-attack.png
✅ bg-city-hub_1x.webp
✅ banner-home-main_1x.webp

❌ DiaoChan_Portrait.jpg (wrong format)
❌ button.png (not descriptive)
❌ background1.jpg (unclear identifier)
```

## File Format Requirements

### Image Formats

**JPEG (.jpg):**
- Use for: Photographs, complex backgrounds without transparency
- Quality: 85-90% compression
- Max size: 500KB for backgrounds, 200KB for others

**PNG (.png):**
- Use for: Transparency required, UI elements, sprites
- Type: PNG-24 with alpha channel
- Max size: 200KB for small assets, 500KB for backgrounds

**SVG (.svg):**
- Use for: Icons, logos, scalable graphics
- Optimize with SVGO before uploading
- Max size: 50KB per file

**WebP (.webp):**
- Use for: Modern browsers, best compression
- Quality: 80-85%
- Always provide PNG fallback for older browsers

### File Size Limits

- Maximum file size: **10MB per file**
- Recommended: Keep under 500KB for optimal performance
- Images over 1MB will trigger warnings during processing

## Upload Checklist by Priority

### Phase 1: Character References (This Week)
- [ ] Download all 10 Diao Chan images from GitHub Issue #92
- [ ] Rename following naming convention
- [ ] Upload to `p1-character-references/diao-chan/`
- [ ] Download all 10 Lu Bu images from GitHub Issue #92
- [ ] Rename following naming convention
- [ ] Upload to `p1-character-references/lu-bu/`
- [ ] Run: `./tools/asset_pipeline_manager.py process`

### Phase 2: UI Enhancements (Next 2 Weeks)
- [ ] Create or source 6 banner images
- [ ] Upload to `p2-ui-enhancements/banners/`
- [ ] Create or source 5 texture images
- [ ] Upload to `p2-ui-enhancements/textures/`
- [ ] Create or source 16 button graphics
- [ ] Upload to `p2-ui-enhancements/buttons/`
- [ ] Run: `./tools/asset_pipeline_manager.py process`

### Phase 3: ASCII Base Models (Next Month)
- [ ] Create 14 character pose references
- [ ] Upload to `p3-ascii-base-models/character-poses/`
- [ ] Create 8 weapon/effect references
- [ ] Upload to `p3-ascii-base-models/weapons-effects/`
- [ ] Create 4 environment elements
- [ ] Upload to `p3-ascii-base-models/environment-elements/`
- [ ] Run: `./tools/asset_pipeline_manager.py process`

### Phase 4: Environment Art (Ongoing)
- [ ] Create or source 8 location backgrounds
- [ ] Upload to `p4-environment-art/locations/`
- [ ] Create or source 6 map decorations
- [ ] Upload to `p4-environment-art/maps/`
- [ ] Run: `./tools/asset_pipeline_manager.py process`

## Processing Your Uploads

After uploading files to any incoming folder:

```bash
# Step 1: Process uploaded files (validates and moves to processed/)
./tools/asset_pipeline_manager.py process

# Step 2: Stage for deployment (moves to staging/pending/)
./tools/asset_pipeline_manager.py stage

# Or stage specific character:
./tools/asset_pipeline_manager.py stage --character diao-chan

# Step 3: Check what's ready for approval
./tools/asset_pipeline_manager.py list --status pending

# Step 4: Approve assets (use IDs from list command)
./tools/asset_pipeline_manager.py approve --id <asset_id>

# Step 5: Deploy to frontend and ComfyUI
./tools/asset_pipeline_manager.py deploy --target all

# Check overall status
./tools/asset_pipeline_manager.py status
```

## Quick Status Check

```bash
# See how many assets are in each stage
./tools/asset_pipeline_manager.py status

# Output shows:
# 📥 Incoming: X asset(s)
# ✅ Processed: X asset(s)
# ⏳ Pending: X asset(s)
# 🎯 Ready: X asset(s)
# 🚀 Deployed: X asset(s)
```

## Asset Upload Progress Tracker

Track your progress uploading the 87 missing assets:

| Priority | Category | Total | Uploaded | Processed | Deployed |
|----------|----------|-------|----------|-----------|----------|
| P1 | Diao Chan Refs | 10 | 0 | 0 | 0 |
| P1 | Lu Bu Refs | 10 | 0 | 0 | 0 |
| P2 | Banners | 6 | 0 | 0 | 0 |
| P2 | Textures | 5 | 0 | 0 | 0 |
| P2 | Buttons | 16 | 0 | 0 | 0 |
| P3 | Character Poses | 14 | 0 | 0 | 0 |
| P3 | Weapons/Effects | 8 | 0 | 0 | 0 |
| P3 | Environment | 4 | 0 | 0 | 0 |
| P4 | Locations | 8 | 0 | 0 | 0 |
| P4 | Maps | 6 | 0 | 0 | 0 |
| **TOTAL** | | **87** | **0** | **0** | **0** |

## Help & Support

**For upload questions:**
- Check `storage/visual-assets/README.md` for storage system details
- Review `docs/VISUAL_ASSETS_UPLOAD_GUIDE.md` for comprehensive guide
- Run `./tools/asset_pipeline_manager.py --help` for command reference

**For generation questions:**
- Check `docs/GM_CONTROL_PANEL.md` for art generation documentation
- Review `docs/DIAO_CHAN_LU_BU_ASSET_INTEGRATION.md` for integration workflow

**Common Issues:**
- **Validation fails**: Check file format, size, and naming convention
- **Wrong destination**: Fix filename prefix (e.g., use `character-` for character assets)
- **Can't approve**: Ensure asset is in "pending" status first

---

## Summary

This folder structure is ready for you to upload all 87 missing assets identified in the design gap analysis:

✅ **Organized by priority** (P1-P4) for systematic uploads  
✅ **Organized by category** for easy file management  
✅ **Includes all specifications** for each asset type  
✅ **Provides naming templates** for consistency  
✅ **Lists exact requirements** for dimensions, formats, quantities  
✅ **Includes GitHub URLs** for character references  
✅ **Ready for processing** with asset pipeline manager

Start with **P1: Character References** to unblock LoRA training and art generation!
