# Diao Chan & Lu Bu Asset Integration Guide

This guide explains how to use the reference images for Diao Chan and Lu Bu to generate all required visual assets for the WuXuxian TTRPG webapp using ComfyUI.

## Overview

The reference images provided for Diao Chan and Lu Bu will be used to:
1. Create visual placeholders for the characters in the UI
2. Train character-specific LoRAs for consistent generation
3. Generate wiki-quality character art
4. Create complete character sheets with multiple poses and outfits
5. Generate all frontend UI assets (thumbnails, portraits, busts)

## Quick Start

### Prerequisites
1. ComfyUI installed and running (see `tools/comfyui/README.md`)
2. Required models downloaded (see `tools/comfyui/models/README.md`)
3. Reference images downloaded from GitHub issue #92

### Step 1: Download and Organize Reference Images

Download all images from the GitHub issue and place them in the appropriate directories:

**Diao Chan Images** (10 images):
```bash
# Target directory: frontend/public/assets/characters/reference/diao-chan/

diao-chan-001-fullbody-primary.jpg    # https://github.com/user-attachments/assets/54792596-238c-42e7-bf77-c55429382940
diao-chan-002-costume-variants.jpg    # https://github.com/user-attachments/assets/85367db6-c196-4dca-8737-c79a7b3332c8
diao-chan-003-artistic-portrait.jpg   # https://github.com/user-attachments/assets/81585c59-6139-44cd-acba-c6d36c805268
diao-chan-004-closeup-portrait.jpg    # https://github.com/user-attachments/assets/18714f50-cc38-4521-b1e5-3a01f249602c
diao-chan-005-standing-pose.jpg       # https://github.com/user-attachments/assets/193d7b73-3764-4b70-b762-5ec2ad71e0f5
diao-chan-006-reference.jpg           # https://github.com/user-attachments/assets/5be6ba86-82f9-40ae-bf35-5d73f7188dbe
diao-chan-007-reference.jpg           # https://github.com/user-attachments/assets/c33bc381-12b7-46cb-803e-209df95ef198
diao-chan-008-reference.jpg           # https://github.com/user-attachments/assets/08d05ca2-b65a-4b24-b17e-6bbab9ed483e
diao-chan-009-reference.jpg           # https://github.com/user-attachments/assets/594f25a4-8e9c-4f8d-bc59-d7c32df2c156
diao-chan-010-reference.jpg           # https://github.com/user-attachments/assets/07912207-4d9c-4656-bac4-ce1f0f871891
```

**Lu Bu Images** (10 images):
```bash
# Target directory: frontend/public/assets/characters/reference/lu-bu/

lu-bu-001-fullbody-primary.jpg        # https://github.com/user-attachments/assets/e7e00e23-f8d3-4a72-a1f8-1baea51679a2
lu-bu-002-costume-variants.jpg        # https://github.com/user-attachments/assets/ee9c2343-d6f7-46fe-a175-8491b822d3ed
lu-bu-003-combat-pose.jpg             # https://github.com/user-attachments/assets/bd0dd1d3-ad62-4fc0-b696-a8423d211f93
lu-bu-004-portrait-detail.jpg         # https://github.com/user-attachments/assets/31ae98f9-930e-4ae0-9416-99ada1cc3d86
lu-bu-005-standing-reference.jpg      # https://github.com/user-attachments/assets/b84c0f2f-fd59-4141-bb27-706f5f2fc71e
lu-bu-006-reference.jpg               # https://github.com/user-attachments/assets/7260bac4-05fe-43cd-a4db-a2bc88b213ac
lu-bu-007-reference.jpg               # https://github.com/user-attachments/assets/b53b5017-d4db-41b5-8fa1-60a0b63dddf2
lu-bu-008-reference.jpg               # https://github.com/user-attachments/assets/24f68dae-bc41-44a1-a63d-ed0290962830
lu-bu-009-reference.jpg               # https://github.com/user-attachments/assets/4af1e41b-219d-481d-ab5a-8870a48bbe98
lu-bu-010-reference.jpg               # https://github.com/user-attachments/assets/70b73481-d50f-4783-88fc-4c305bc0d3eb
```

### Step 2: Copy References to ComfyUI and Training Directories

```bash
# From project root
cd /path/to/idk

# Copy to ComfyUI reference directories
cp frontend/public/assets/characters/reference/diao-chan/* tools/comfyui/reference_images/diao-chan/
cp frontend/public/assets/characters/reference/lu-bu/* tools/comfyui/reference_images/lu-bu/

# Copy selected images for LoRA training (use 4-6 best quality images)
cp frontend/public/assets/characters/reference/diao-chan/diao-chan-001-fullbody-primary.jpg models/loras/training-data/diao-chan/
cp frontend/public/assets/characters/reference/diao-chan/diao-chan-003-artistic-portrait.jpg models/loras/training-data/diao-chan/
cp frontend/public/assets/characters/reference/diao-chan/diao-chan-004-closeup-portrait.jpg models/loras/training-data/diao-chan/
cp frontend/public/assets/characters/reference/diao-chan/diao-chan-005-standing-pose.jpg models/loras/training-data/diao-chan/

cp frontend/public/assets/characters/reference/lu-bu/lu-bu-001-fullbody-primary.jpg models/loras/training-data/lu-bu/
cp frontend/public/assets/characters/reference/lu-bu/lu-bu-003-combat-pose.jpg models/loras/training-data/lu-bu/
cp frontend/public/assets/characters/reference/lu-bu/lu-bu-004-portrait-detail.jpg models/loras/training-data/lu-bu/
cp frontend/public/assets/characters/reference/lu-bu/lu-bu-005-standing-reference.jpg models/loras/training-data/lu-bu/
```

## Phase 1: LoRA Training

Train character-specific LoRAs to maintain visual consistency across all generated assets.

### Prepare Training Data

Create caption files for each training image:

**Example: Diao Chan Caption (diao-chan-001-fullbody-primary.txt)**
```
diaochan, 1girl, solo, purple robes, flowing fabric, elegant pose, long black hair, elaborate hairpins, ornate hair decorations, jade ornaments, graceful stance, full body, dynasty warriors style, romance of three kingdoms aesthetic, purple gradient outfit, gold trim, semi-realistic anime, high quality, detailed
```

**Example: Lu Bu Caption (lu-bu-001-fullbody-primary.txt)**
```
lubu, 1boy, solo, heavy armor, ornate plate armor, dark steel, crimson accents, gold trim, fierce expression, long dark hair, commanding presence, full body, holding halberd, fang tian ji, muscular build, dynasty warriors style, romance of three kingdoms aesthetic, legendary warrior, imposing, high quality, detailed
```

### Run LoRA Training

See `models/loras/README.md` for detailed training instructions. Basic command:

```bash
# Train Diao Chan LoRA
cd models/loras
python train_lora.py \
  --training_data training-data/diao-chan \
  --output_name diao-chan_v1 \
  --base_model anythingV5.safetensors \
  --trigger_word "diaochan" \
  --training_steps 1000 \
  --learning_rate 0.0001

# Train Lu Bu LoRA
python train_lora.py \
  --training_data training-data/lu-bu \
  --output_name lu-bu_v1 \
  --base_model anythingV5.safetensors \
  --trigger_word "lubu" \
  --training_steps 1000 \
  --learning_rate 0.0001
```

## Phase 2: Wiki Character Art Generation

Generate high-quality wiki-style character art using the trained LoRAs.

### Generate All Wiki Art

```bash
# From project root
npx tsx tools/generate_wiki_character_art.ts --manifest manifests/diao-chan-lu-bu.json
```

This will generate:
- Portrait variants (default, elegant, determined, combat)
- Full-body renders (default, various poses)
- Expression sheets (6-panel grid with standard expressions)

Output location: `wiki_assets/characters/{char_id}/`

### Generate Specific Variants

```bash
# Generate only portraits
npx tsx tools/generate_wiki_character_art.ts --manifest manifests/diao-chan-lu-bu.json --type portrait

# Generate specific character
npx tsx tools/generate_wiki_character_art.ts --manifest manifests/diao-chan-lu-bu.json --char npc-diao-chan

# Generate specific variant
npx tsx tools/generate_wiki_character_art.ts --char npc-diao-chan --type portrait --variant elegant
```

## Phase 3: Character Sheet Generation

Generate complete character sheets with poses, outfits, and stats zones.

### Generate Character Sheets

Using the ComfyUI API (requires backend running):

```bash
# Start backend if not running
cd backend
python -m uvicorn app.main:app --reload --port 8000

# Generate Diao Chan character sheet
curl -X POST http://localhost:8000/api/v1/comfyui/generate/character-sheet \
  -H "Content-Type: application/json" \
  -d '{
    "character_id": "npc-diao-chan",
    "include_stats": true,
    "lora_path": "models/loras/diao-chan_v1.safetensors",
    "reference_image": "tools/comfyui/reference_images/diao-chan/diao-chan-001-fullbody-primary.jpg"
  }'

# Generate Lu Bu character sheet
curl -X POST http://localhost:8000/api/v1/comfyui/generate/character-sheet \
  -H "Content-Type: application/json" \
  -d '{
    "character_id": "npc-lu-bu",
    "include_stats": true,
    "lora_path": "models/loras/lu-bu_v1.safetensors",
    "reference_image": "tools/comfyui/reference_images/lu-bu/lu-bu-001-fullbody-primary.jpg"
  }'
```

### Character Sheet Components

Each character sheet includes:
1. **Portrait** (512x768) - High-quality face/bust shot
2. **Poses Sheet** (3x3 grid) - 9 poses: idle, combat, casting, commanding, injured, maimed, victory, dead, back view
3. **Outfits Sheet** (2x3 grid) - 6 outfit variations
4. **Stats Zone** (256x768) - Transparent overlay area for stats display

## Phase 4: Frontend UI Asset Generation

Generate all frontend assets in required formats and resolutions.

### Generate UI Assets

```bash
# Generate all UI variants for both characters
npx tsx tools/comfyui/generate_ui_assets.ts \
  --characters npc-diao-chan,npc-lu-bu \
  --lora-path models/loras/ \
  --output frontend/public/assets/characters/
```

This generates:
- **Thumbnails** (256x384) → `thumbnails/{character}.png`
- **Portraits** (512x768) → `portraits/{character}.png`
- **Busts** (1024x1024) → `busts/{character}.png`
- **Full-body** (1024x1536) → `bases/{character}.png`

### Manual Workflow (Alternative)

If automated script isn't available, use ComfyUI workflows manually:

1. Load `workflows/wiki_char_portrait_detailed.json`
2. Set character-specific parameters:
   - LoRA path: `models/loras/diao-chan_v1.safetensors`
   - Trigger word: "diaochan"
   - Reference image: Load from `reference_images/diao-chan/`
   - Seed: Use seed from manifest (110001 for Diao Chan portrait)
3. Queue prompt and download output
4. Resize for different UI sizes using image processing tools

## Phase 5: Asset Integration & Documentation

### Update Asset Manifest

Update `frontend/public/assets/characters/asset_manifest.json` to include new characters:

```json
{
  "characters": {
    "diao-chan": {
      "id": "npc-diao-chan",
      "display_name": "Diao Chan",
      "assets": {
        "thumbnail": "/assets/characters/thumbnails/diao-chan.png",
        "portrait": "/assets/characters/portraits/diao-chan.png",
        "bust": "/assets/characters/busts/diao-chan.png",
        "fullbody": "/assets/characters/bases/diao-chan.png"
      },
      "wiki_assets": {
        "portraits": [
          "/wiki_assets/characters/npc-diao-chan/portrait_default_110001.png",
          "/wiki_assets/characters/npc-diao-chan/portrait_elegant_110002.png"
        ],
        "fullbody": [
          "/wiki_assets/characters/npc-diao-chan/fullbody_default_210001.png"
        ],
        "expressions": [
          "/wiki_assets/characters/npc-diao-chan/expressions_310001.png"
        ]
      }
    },
    "lu-bu": {
      "id": "npc-lu-bu",
      "display_name": "Lu Bu",
      "assets": {
        "thumbnail": "/assets/characters/thumbnails/lu-bu.png",
        "portrait": "/assets/characters/portraits/lu-bu.png",
        "bust": "/assets/characters/busts/lu-bu.png",
        "fullbody": "/assets/characters/bases/lu-bu.png"
      },
      "wiki_assets": {
        "portraits": [
          "/wiki_assets/characters/npc-lu-bu/portrait_default_120001.png",
          "/wiki_assets/characters/npc-lu-bu/portrait_fierce_120002.png"
        ],
        "fullbody": [
          "/wiki_assets/characters/npc-lu-bu/fullbody_default_220001.png"
        ],
        "expressions": [
          "/wiki_assets/characters/npc-lu-bu/expressions_320001.png"
        ]
      }
    }
  }
}
```

### Link to Wiki/Codex Pages

Update wiki/codex routing to include character pages:

```typescript
// Example: frontend/src/pages/Wiki/CharacterDatabase.tsx
const CHARACTERS = [
  {
    id: 'npc-diao-chan',
    name: 'Diao Chan',
    thumbnail: '/assets/characters/thumbnails/diao-chan.png',
    wikiPath: '/wiki/characters/diao-chan',
    codexPath: '/codex/historical-figures/diao-chan'
  },
  {
    id: 'npc-lu-bu',
    name: 'Lu Bu',
    thumbnail: '/assets/characters/thumbnails/lu-bu.png',
    wikiPath: '/wiki/characters/lu-bu',
    codexPath: '/codex/historical-figures/lu-bu'
  }
];
```

## ComfyUI Workflow Configuration

### Key Workflow Settings for Reference Image Usage

#### Using IP-Adapter for Style Consistency

All workflows should include IP-Adapter nodes configured for reference images:

```json
{
  "IPAdapter": {
    "image": "LOAD_FROM_REFERENCE_DIR",
    "model": "ip-adapter_sd15.safetensors",
    "weight": 0.6,
    "weight_type": "style transfer",
    "start_at": 0.0,
    "end_at": 0.8
  }
}
```

#### LoRA Integration

```json
{
  "LoraLoader": {
    "lora_name": "diao-chan_v1.safetensors",
    "strength_model": 0.8,
    "strength_clip": 0.8
  }
}
```

#### Face Consistency (ReActor/Face Swap)

```json
{
  "ReActorFaceSwap": {
    "enabled": true,
    "source_image": "REFERENCE_PORTRAIT",
    "face_restore": true,
    "face_model": "insightface",
    "blend_ratio": 0.7
  }
}
```

## Asset Verification Checklist

Before finalizing asset generation:

- [ ] All 10 reference images downloaded for Diao Chan
- [ ] All 10 reference images downloaded for Lu Bu
- [ ] Reference images organized in correct directories
- [ ] Training data prepared with caption files
- [ ] LoRAs trained and validated (test generation looks correct)
- [ ] Wiki art generated for all variants
- [ ] Character sheets generated with all components
- [ ] UI assets generated in all required sizes
- [ ] Asset manifest updated with new entries
- [ ] Wiki/codex pages linked to character assets
- [ ] Quality check: All generated images maintain character consistency
- [ ] Quality check: Assets follow naming conventions
- [ ] Quality check: No visual artifacts or quality issues

## Troubleshooting

### Issue: Generated character doesn't match reference
**Solution**: Increase IP-Adapter weight (try 0.7-0.8) or LoRA strength (try 0.9)

### Issue: Inconsistent faces across generations
**Solution**: Use face swap workflow with consistent reference portrait

### Issue: LoRA not loading in workflow
**Solution**: Verify LoRA file path and ensure it's in ComfyUI's loras directory

### Issue: Poor quality outputs
**Solution**: 
- Increase generation steps (try 35-40)
- Adjust CFG scale (try 7.0-7.5)
- Use hi-res fix for larger outputs
- Verify checkpoint model quality

### Issue: Style doesn't match Romance of Three Kingdoms aesthetic
**Solution**: 
- Review base prompts in manifest
- Ensure using anime-style checkpoint (AnythingV5, CounterfeitV3)
- Add more specific style keywords
- Use RO3K style adapter workflow if available

## Advanced Techniques

### Multi-Character Scene Generation

To generate scenes with both Diao Chan and Lu Bu:

1. Use multi-LoRA loading with both character LoRAs
2. Adjust trigger words and positioning in prompt
3. Use regional prompting to control character placement
4. Example prompt: "diaochan and lubu, two people, side by side, diaochan on left, lubu on right, dynasty warriors style"

### Variant Generation with Consistent Features

To generate new outfit/pose variants while maintaining character identity:

1. Load character LoRA
2. Use face swap with reference portrait
3. Modify outfit description in positive prompt
4. Keep trigger word and core features consistent
5. Adjust seed slightly for variation (+1 to +10)

## Related Documentation

- `tools/comfyui/README.md` - ComfyUI setup and usage
- `docs/wiki_art_pipeline.md` - Wiki art generation details
- `models/loras/README.md` - LoRA training guide
- `docs/COMFYUI_CHARACTER_GENERATION.md` - Full character generation system
- `frontend/public/assets/README.md` - Asset naming conventions

## Support

For issues or questions:
1. Check ComfyUI logs for generation errors
2. Verify all model files are correctly placed
3. Ensure reference images are high quality (>512x512)
4. Review manifest configuration for typos
5. Test workflows individually before batch generation
