# Visual Assets Upload Guide

## Overview

This guide explains how to upload visual assets to the WuXuxian TTRPG webapp, identifies missing assets through design gap analysis, and provides a structured step-by-step upload plan to enhance the UI and enable all art generation tools.

## Quick Start

### Where to Upload Files

**Primary Upload Location:**
```
storage/visual-assets/incoming/
```

All user uploads should be placed in this directory. The asset pipeline will automatically:
1. Validate the files
2. Process and organize them
3. Stage them for approval  
4. Deploy them to the appropriate locations (frontend UI, ComfyUI, ASCII tools)

### How to Upload

```bash
# Navigate to project root
cd /path/to/idk

# Copy your files to the incoming directory
cp /path/to/your/images/* storage/visual-assets/incoming/

# Process the uploaded files
./tools/asset_pipeline_manager.py process

# Review and stage for deployment
./tools/asset_pipeline_manager.py stage

# Approve assets (use asset ID from previous command)
./tools/asset_pipeline_manager.py approve --id <asset_id>

# Deploy to frontend and ComfyUI
./tools/asset_pipeline_manager.py deploy --target all
```

## Design Gap Analysis

### Current State Assessment

**Existing Assets (128 files):**
- ✅ Character portraits: Diao Chan, Lu Bu (SVG placeholders)
- ✅ Character bases: Male/Female base models
- ✅ Character overlays: Hair styles (5), Eyes (5)  
- ✅ Fate card illustrations: Death (4), Body (5), Seed (5)
- ✅ Fate card frames and backs
- ✅ UI icons: Navigation (8), Feature icons
- ✅ UI decorations: Corner pieces, dividers
- ⚠️  Map background (1, needs more variety)
- ⚠️  Character references: Empty directories for Diao Chan and Lu Bu

**Missing Critical Assets:**

### 1. Character Reference Images (PRIORITY 1)
**Status:** Directories created but empty  
**Impact:** Blocks LoRA training and ComfyUI art generation  
**Required For:** GM Control Panel art generation, ASCII base models

**Needed:**
- `frontend/public/assets/characters/reference/diao-chan/` - 10 images
- `frontend/public/assets/characters/reference/lu-bu/` - 10 images

### 2. UI Enhancement Assets (PRIORITY 2)
**Status:** Basic UI elements present, missing enhancement graphics  
**Impact:** Limited visual polish and theme consistency

**Needed:**
- Banner images for page headers
- Background textures and patterns
- Button state graphics (hover, pressed, disabled)
- Panel backgrounds and frames
- Loading screens and splash art
- Game room/lobby backgrounds

### 3. ASCII Combat Base Models (PRIORITY 3)
**Status:** Missing base reference images for ASCII art generation  
**Impact:** ASCII combat illustrations cannot be generated

**Needed:**
- Character pose references (combat stances)
- Weapon silhouettes
- Effect references (qi auras, attacks)
- Environment elements (terrain, obstacles)

### 4. Environment and World Art (PRIORITY 4)
**Status:** Minimal environment art  
**Impact:** Limited immersion and visual variety

**Needed:**
- City/location backgrounds
- Regional map art
- World map decorations
- Interior scenes
- Seasonal variants

## Structured Upload Plan

### Phase 1: Character References (Week 1)

#### Step 1.1: Download Diao Chan Images
Download all 10 images from GitHub Issue #92:

```bash
# Create temp download directory
mkdir -p /tmp/character-refs/diao-chan

# Download images manually from:
# https://github.com/hvrryh-web/idk/issues/92#issuecomment-3649199612

# Rename following convention:
diao-chan-001-fullbody-primary.jpg
diao-chan-002-costume-variants.jpg
diao-chan-003-artistic-portrait.jpg
diao-chan-004-closeup-portrait.jpg
diao-chan-005-standing-pose.jpg
diao-chan-006-reference.jpg
diao-chan-007-reference.jpg
diao-chan-008-reference.jpg
diao-chan-009-reference.jpg
diao-chan-010-reference.jpg
```

#### Step 1.2: Download Lu Bu Images
Download all 10 images from GitHub Issue #92:

```bash
# Create temp download directory
mkdir -p /tmp/character-refs/lu-bu

# Rename following convention:
lu-bu-001-fullbody-primary.jpg
lu-bu-002-costume-variants.jpg
lu-bu-003-combat-pose.jpg
lu-bu-004-portrait-detail.jpg
lu-bu-005-standing-reference.jpg
lu-bu-006-reference.jpg
lu-bu-007-reference.jpg
lu-bu-008-reference.jpg
lu-bu-009-reference.jpg
lu-bu-010-reference.jpg
```

#### Step 1.3: Upload via Pipeline
```bash
# Copy to incoming
cp /tmp/character-refs/diao-chan/* storage/visual-assets/incoming/
cp /tmp/character-refs/lu-bu/* storage/visual-assets/incoming/

# Process
./tools/asset_pipeline_manager.py process

# Stage for character-specific deployment
./tools/asset_pipeline_manager.py stage --character diao-chan
./tools/asset_pipeline_manager.py stage --character lu-bu

# Check status
./tools/asset_pipeline_manager.py status

# Approve (get IDs from status command)
./tools/asset_pipeline_manager.py list --status pending
# Then approve each:
./tools/asset_pipeline_manager.py approve --id <asset_id>

# Deploy to all targets (frontend, ComfyUI, LoRA training)
./tools/asset_pipeline_manager.py deploy --target all
```

**Expected Locations After Deployment:**
- Frontend: `frontend/public/assets/characters/reference/{character}/`
- ComfyUI: `tools/comfyui/reference_images/{character}/`
- LoRA Training: `models/loras/training-data/{character}/` (selected images)

**Verification:**
```bash
# Verify deployment
ls -la frontend/public/assets/characters/reference/diao-chan/
ls -la frontend/public/assets/characters/reference/lu-bu/
ls -la tools/comfyui/reference_images/diao-chan/
ls -la tools/comfyui/reference_images/lu-bu/
```

### Phase 2: UI Enhancement Assets (Week 2)

#### Step 2.1: Banner Images
Create or source banner images for page headers.

**Specifications:**
- Format: WebP (preferred) or PNG
- Size: 1920x300px (1x), 3840x600px (2x for retina)
- Naming: `banner-{section}-{variant}_1x.webp`

**Required Banners:**
```
banner-home-main_1x.webp          # Main landing/home banner
banner-character-creation_1x.webp  # Character creation header
banner-combat-arena_1x.webp        # Combat screen header  
banner-wiki-library_1x.webp        # Wiki/SRD section header
banner-world-map_1x.webp           # World map header
banner-city-hub_1x.webp            # City/hub screen header
```

**Upload Process:**
```bash
# Place banner files in incoming
cp /path/to/banners/*.webp storage/visual-assets/incoming/

# Process and deploy
./tools/asset_pipeline_manager.py process
./tools/asset_pipeline_manager.py stage
# Approve and deploy as needed
```

#### Step 2.2: Background Textures
Create seamless tileable textures for UI panels and backgrounds.

**Specifications:**
- Format: PNG with alpha channel
- Size: 512x512px (tileable)
- Naming: `texture-{name}_1x.png`

**Required Textures:**
```
texture-paper-aged_1x.png          # Aged paper texture for panels
texture-silk-brocade_1x.png        # Silk brocade pattern
texture-wood-grain_1x.png          # Wood grain for UI frames
texture-stone-carved_1x.png        # Carved stone texture
texture-jade-surface_1x.png        # Jade material texture
```

#### Step 2.3: Button Graphics
Create button state graphics for interactive elements.

**Specifications:**
- Format: PNG with alpha channel or SVG
- Size: Variable, but provide 1x and 2x versions
- States: normal, hover, pressed, disabled
- Naming: `btn-{style}-{state}_1x.png`

**Required Buttons:**
```
# Primary action buttons
btn-primary-normal_1x.png
btn-primary-hover_1x.png
btn-primary-pressed_1x.png
btn-primary-disabled_1x.png

# Secondary buttons
btn-secondary-normal_1x.png
btn-secondary-hover_1x.png
btn-secondary-pressed_1x.png
btn-secondary-disabled_1x.png

# Special themed buttons
btn-combat-normal_1x.png
btn-combat-hover_1x.png
btn-fate-normal_1x.png
btn-fate-hover_1x.png
```

### Phase 3: ASCII Combat Base Models (Week 3)

#### Step 3.1: Character Pose References
Create or source simplified character silhouettes for ASCII art generation.

**Specifications:**
- Format: PNG with transparency or high-contrast B&W
- Size: 512x512px or 512x768px for full-body
- Naming: `ascii-char-{name}-{pose}.png`

**Required Poses:**
```
# Diao Chan poses
ascii-char-diao-chan-idle.png
ascii-char-diao-chan-attack.png
ascii-char-diao-chan-defend.png
ascii-char-diao-chan-skill.png
ascii-char-diao-chan-hurt.png
ascii-char-diao-chan-victory.png

# Lu Bu poses
ascii-char-lu-bu-idle.png
ascii-char-lu-bu-attack.png
ascii-char-lu-bu-defend.png
ascii-char-lu-bu-skill.png
ascii-char-lu-bu-hurt.png
ascii-char-lu-bu-victory.png

# Generic warrior (for NPCs)
ascii-char-warrior-idle.png
ascii-char-warrior-attack.png
```

**Note:** These can be derived from the character reference images using the same LoRAs, but simplified for ASCII conversion. The ASCII tool requires less detail than full illustrations.

#### Step 3.2: Weapon and Effect References
```
ascii-weapon-sword.png
ascii-weapon-spear.png
ascii-weapon-halberd.png
ascii-effect-slash.png
ascii-effect-thrust.png
ascii-effect-qi-burst.png
ascii-effect-fire.png
ascii-effect-lightning.png
```

#### Step 3.3: Environment Elements
```
ascii-env-ground.png
ascii-env-rocks.png
ascii-env-trees.png
ascii-env-walls.png
```

### Phase 4: Environment Art (Week 4)

#### Step 4.1: Location Backgrounds
```
bg-city-hub_1x.webp
bg-throne-room_1x.webp
bg-training-grounds_1x.webp
bg-marketplace_1x.webp
bg-tavern_1x.webp
bg-battlefield_1x.webp
bg-mountain-path_1x.webp
bg-forest-clearing_1x.webp
```

#### Step 4.2: Map Decorations
```
map-icon-city_1x.png
map-icon-fortress_1x.png
map-icon-village_1x.png
map-icon-landmark_1x.png
map-border-ornate.svg
map-compass-rose.svg
```

## Asset Naming Conventions

All assets must follow the project naming pattern:

```
{category}-{identifier}-{variant}_{scale}.{ext}

Examples:
character-diao-chan-portrait_1x.jpg
ui-button-primary-hover_2x.png
ascii-char-warrior-attack.png
bg-city-hub_1x.webp
banner-home-main_1x.webp
```

### Categories:
- `character` - Character-related art
- `ui` - UI components (buttons, panels, etc.)
- `ascii` - ASCII art base references
- `bg` - Background images
- `banner` - Header banners
- `texture` - Tileable textures
- `map` - Map-related art
- `fate` - Fate card art
- `icon` - Icon graphics

### Scales:
- `_1x` - Standard resolution (96 DPI)
- `_2x` - Retina/high-DPI (192 DPI)

## File Format Guidelines

### When to Use Each Format:

**JPEG (.jpg)**
- Use for: Photographs, complex images without transparency
- Quality: 85-90% compression
- Max size: 500KB for backgrounds, 200KB for other uses

**PNG (.png)**
- Use for: Images requiring transparency, UI elements, sprites
- Type: PNG-24 with alpha channel
- Max size: 200KB for small assets, 500KB for backgrounds

**SVG (.svg)**
- Use for: Icons, logos, scalable graphics
- Optimize with SVGO before uploading
- Max size: 50KB per file

**WebP (.webp)**
- Use for: Modern browsers, best compression
- Quality: 80-85%
- Always provide PNG fallback

**GIF (.gif)**
- Use for: Simple animations only
- Max size: 500KB
- Consider using video formats for complex animations

## Integration with Art Generation Tools

### ComfyUI Integration

Uploaded character references automatically integrate with ComfyUI workflows:

1. **Reference Images** → `tools/comfyui/reference_images/{character}/`
   - Used with IP-Adapter for style consistency
   - Loaded in character generation workflows

2. **LoRA Training Data** → `models/loras/training-data/{character}/`
   - Selected best 4-6 images from references
   - Used to train character-specific LoRAs

3. **Generated Assets** → Returned to staging for approval before frontend deployment

**Workflow:**
```
Upload → Process → ComfyUI Reference → Generate → Stage → Approve → Deploy to Frontend
```

### ASCII Tool Integration

ASCII combat illustrations use the same character LoRAs but with simplified prompts:

1. **Base Models** → ASCII-specific reference images in `storage/visual-assets/incoming/`
2. **Processing** → Converted to high-contrast for ASCII art generation
3. **Generation** → Uses character LoRAs with ASCII-optimized prompts
4. **Output** → ASCII art for combat scenes

**Key Difference:** ASCII requires less visual detail, so the same LoRAs work but with simpler base images.

### GM Control Panel Integration

The Game Master Control Panel uses uploaded assets for:

1. **Character Generation** → References from `tools/comfyui/reference_images/`
2. **Batch Processing** → Multiple characters from manifest files
3. **Progress Monitoring** → Real-time tracking of generation jobs
4. **Deployment** → Automated copying to frontend locations

## Security and Validation

### Automatic Checks

The asset pipeline automatically validates:
- ✅ File extension (jpg, jpeg, png, svg, webp only)
- ✅ File size (max 10MB)
- ✅ File readability
- ✅ Naming convention compliance

### Manual Review

Before approval, visually inspect assets for:
- Image quality and clarity
- Appropriate content
- Correct dimensions
- Transparency working correctly (PNG/WebP)
- Visual consistency with existing assets

### Rejected Assets

If an asset fails validation:
1. It remains in `incoming/` with an error logged
2. Fix the issue (rename, resize, convert format)
3. Re-run the process command

## Monitoring and Status

### Check Pipeline Status
```bash
# Overall status
./tools/asset_pipeline_manager.py status

# List all assets
./tools/asset_pipeline_manager.py list

# List by status
./tools/asset_pipeline_manager.py list --status pending
./tools/asset_pipeline_manager.py list --status ready
./tools/asset_pipeline_manager.py list --status deployed
```

### Deployment Verification
```bash
# Check frontend deployment
ls -la frontend/public/assets/characters/
ls -la frontend/public/assets/ui/

# Check ComfyUI deployment
ls -la tools/comfyui/reference_images/

# Check LoRA training data
ls -la models/loras/training-data/
```

## Troubleshooting

### Asset Not Processing
**Symptom:** File stays in `incoming/`, not moved to `processed/`

**Solutions:**
- Check file extension is allowed
- Verify file size is under 10MB
- Ensure file is readable (not corrupted)
- Check naming follows convention

### Deployment Failed
**Symptom:** Asset approved but not in frontend

**Solutions:**
- Verify asset type detection is correct
- Check destination directories exist
- Ensure file permissions allow copying
- Run deployment with verbose logging

### Wrong Destination
**Symptom:** Asset deployed to incorrect location

**Solutions:**
- Fix filename to match category (e.g., `character-` prefix for character assets)
- Re-stage and re-deploy
- Manually move file if needed

## Priority Upload Checklist

### Immediate (This Week)
- [ ] Download and upload Diao Chan reference images (10 images)
- [ ] Download and upload Lu Bu reference images (10 images)  
- [ ] Process and deploy character references to ComfyUI
- [ ] Select 4-6 best images per character for LoRA training
- [ ] Copy selected images to LoRA training data directories

### Short Term (Next 2 Weeks)
- [ ] Create/source 6 banner images for major sections
- [ ] Create/source 5 background textures
- [ ] Create/source button graphics (4 states × 4 styles = 16 images)
- [ ] Upload and deploy UI enhancement assets

### Medium Term (Next Month)
- [ ] Create ASCII base models for Diao Chan (6 poses)
- [ ] Create ASCII base models for Lu Bu (6 poses)
- [ ] Create weapon and effect references (8 images)
- [ ] Create environment elements (4 images)

### Long Term (Ongoing)
- [ ] Add location backgrounds as needed
- [ ] Add map decorations
- [ ] Expand character roster with new references
- [ ] Create seasonal/variant assets

## Summary of Required Uploads

| Category | Count | Priority | Status |
|----------|-------|----------|--------|
| Character References | 20 | P1 | 🔴 Missing |
| UI Banners | 6 | P2 | 🔴 Missing |
| UI Textures | 5 | P2 | 🔴 Missing |
| UI Buttons | 16 | P2 | 🔴 Missing |
| ASCII Pose Models | 14 | P3 | 🔴 Missing |
| ASCII Effects | 8 | P3 | 🔴 Missing |
| ASCII Environment | 4 | P3 | 🔴 Missing |
| Location Backgrounds | 8 | P4 | 🔴 Missing |
| Map Decorations | 6 | P4 | 🔴 Missing |
| **TOTAL** | **87** | - | **0% Complete** |

## Next Steps

1. **Start with Phase 1** - Download and upload character references from GitHub Issue #92
2. **Run the asset pipeline** - Process, stage, approve, and deploy
3. **Verify deployment** - Check files in all target locations
4. **Train LoRAs** - Use deployed reference images to train character LoRAs
5. **Test GM Control Panel** - Generate sample art to verify integration
6. **Move to Phase 2** - Create/source UI enhancement assets
7. **Continue phases 3-4** - Complete remaining asset categories

## Support

For questions or issues with the upload process:
- Check `storage/visual-assets/README.md` for directory information
- Review `docs/ASSET_PIPELINE.md` for detailed pipeline documentation
- Run `./tools/asset_pipeline_manager.py --help` for command reference
- Check deployment logs in `staging/visual-assets/deployed/`
