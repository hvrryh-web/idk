# Asset Generation Pipeline Documentation

This document describes the complete asset generation pipeline for WuXuxian TTRPG Visual Novel art assets using ComfyUI.

## Overview

The pipeline generates consistent Romance of Three Kingdoms-style art assets including:
- **Character Portraits**: VN character busts and full-body images
- **Group Posters**: Key art and promotional compositions
- **Backgrounds**: VN scene backgrounds with parallax support
- **UI Motifs**: Ornaments, frames, borders, and decorative elements
- **Advisor Character**: Zhou Xu tutorial/help assistant

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Asset Generation Pipeline                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Manifest   │───▶│  Generator   │───▶│   ComfyUI    │       │
│  │    (JSON)    │    │   Script     │    │   Server     │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│         │                   │                   │                 │
│         ▼                   ▼                   ▼                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  Workflows   │    │   Prompt     │    │   Output     │       │
│  │    (JSON)    │    │  Templates   │    │   Assets     │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Setup ComfyUI

```bash
# Start ComfyUI server (GPU mode)
cd /path/to/ComfyUI
python main.py --listen 0.0.0.0 --port 8188
```

Or with Docker:
```bash
cd infra
docker compose --profile gpu up -d comfyui
```

### 2. Install Required Models

```bash
cd tools/comfyui
./setup_models.sh
```

See `models/README.md` for detailed model requirements.

### 3. Generate Assets

```bash
cd tools/comfyui
npx tsx generate_assets.ts --manifest assets_manifest.example.json
```

## Workflow Files

All workflows are located in `tools/comfyui/workflows/`:

| Workflow | Purpose | Output Size |
|----------|---------|-------------|
| `ro3k_portrait.json` | Character portraits | 832x1216 / 1024x1536 |
| `ro3k_group_poster.json` | Group key art | 1536x1024 / 1920x1080 |
| `ro3k_bg_environment.json` | VN backgrounds | 1920x1080 / 2560x1440 |
| `ro3k_ui_motifs.json` | UI elements | 512x512 / 1024x1024 |
| `ro3k_style_adapter.json` | Style conditioning | Various |
| `ro3k_advisor_zhou_xu.json` | Zhou Xu advisor | Various |

## Style Consistency

### Shared Style Block

All workflows use consistent style prompting from `prompts/style_ro3k.md`:

```
Romance of Three Kingdoms game art, KOEI Tecmo quality, Dynasty Warriors aesthetic, 
semi-realistic painted illustration, heroic historical-fantasy tone, warm cinematic 
lighting with gold and amber tones, high contrast, luminous rim light...
```

### Shared Negative Block

```
modern clothing, contemporary fashion, anime cel shading, photoreal uncanny skin, 
oversharp outlines, logo text, watermark stamps...
```

### Style Enforcement Options

1. **IP-Adapter** (Recommended): Use `ro3k_style_adapter.json` with reference images
2. **LoRA**: Load a trained ROTK style LoRA with strength 0.5-0.8
3. **Prompt Only**: Rely on detailed style prompts for consistency

## Asset Manifest Format

The manifest (`assets_manifest.example.json`) defines all assets to generate:

```json
{
  "settings": {
    "output_base_dir": "../frontend/public/assets/generated",
    "comfyui_url": "http://localhost:8188",
    "checkpoint": "animagine-xl-3.1.safetensors"
  },
  "characters": [...],
  "scenes": [...],
  "backgrounds": [...],
  "ui_elements": [...]
}
```

### Priority System

Assets are assigned priorities 1-4:
- **Priority 1**: Critical UI and advisor assets
- **Priority 2**: Main character portraits and key scenes
- **Priority 3**: Secondary characters and backgrounds
- **Priority 4**: Additional variants and polish

## Generation Script Usage

### Basic Usage

```bash
# Generate all assets from manifest
npx tsx generate_assets.ts --manifest assets_manifest.example.json

# Generate specific category
npx tsx generate_assets.ts --manifest assets_manifest.example.json --category characters

# Generate specific asset by ID
npx tsx generate_assets.ts --manifest assets_manifest.example.json --id zhou_xu_standing_full

# Dry run (show what would be generated)
npx tsx generate_assets.ts --manifest assets_manifest.example.json --dry-run
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `COMFYUI_URL` | `http://localhost:8188` | ComfyUI server URL |
| `COMFYUI_TIMEOUT` | `600` | Max wait time per asset (seconds) |
| `COMFYUI_POLLING_INTERVAL` | `2` | Status check interval (seconds) |

### Batch Generation

```bash
# Generate with parallel jobs (careful with VRAM)
npx tsx generate_assets.ts --manifest assets_manifest.example.json --parallel 2

# Resume from failed generation
npx tsx generate_assets.ts --manifest assets_manifest.example.json --resume

# Skip existing files
npx tsx generate_assets.ts --manifest assets_manifest.example.json --skip-existing
```

## Output Structure

Generated assets are saved to:

```
frontend/public/assets/generated/
├── advisor/
│   ├── zhou_xu_standing_welcoming.png
│   ├── zhou_xu_bust_welcoming.png
│   ├── zhou_xu_bust_explaining.png
│   └── ...
├── portraits/
│   ├── general_001_neutral.png
│   ├── general_001_battle.png
│   └── ...
├── posters/
│   ├── oath_brotherhood.png
│   └── ...
├── backgrounds/
│   ├── throne_room_hd.png
│   ├── battlefield_hd.png
│   └── ...
├── ui/
│   ├── corners/
│   ├── borders/
│   ├── panels/
│   └── medallions/
└── metadata/
    └── generation_log.json
```

## Metadata and Reproducibility

Each generated asset includes a JSON sidecar with generation parameters:

```json
{
  "asset_id": "general_001_neutral",
  "workflow": "ro3k_portrait.json",
  "seed": 10001001,
  "cfg_scale": 7.0,
  "steps": 28,
  "checkpoint": "animagine-xl-3.1.safetensors",
  "prompt_hash": "sha256:abc123...",
  "generated_at": "2024-12-12T10:30:00Z",
  "generation_time_seconds": 45
}
```

## Post-Processing

All workflows apply consistent post-processing:

1. **Filmic Contrast**: Mild S-curve enhancement
2. **Warm Color Balance**: Amber highlights, cooler shadows
3. **Vignette**: 15-25% subtle edge darkening
4. **Sharpening**: Low-radius controlled sharpening

## Zhou Xu Advisor Character

The tutorial advisor "Divine Advisor: Zhou Xu" requires special generation:

### Design Reference
- Based on Zhou Yu from Dynasty Warriors 6
- Navy blue robes with gold embroidery
- Feather fan accessory
- Scholarly strategist bearing

### Required Assets
1. Full standing pose (1024x2048) - Help section background
2. Bust portraits (256x384) - Multiple expressions
3. Small avatar (128x128) - Chat widget

### Generation Command
```bash
npx tsx generate_assets.ts --manifest assets_manifest.example.json --category advisor_character
```

## Troubleshooting

### Generation Fails

1. Check ComfyUI server is running: `curl http://localhost:8188/system_stats`
2. Verify models are installed: see `models/README.md`
3. Check available VRAM: reduce batch size or image dimensions

### Inconsistent Style

1. Verify using pinned checkpoint version
2. Enable IP-Adapter with style references
3. Review prompts against `prompts/style_ro3k.md`

### Poor Quality

1. Increase steps (28-35 recommended)
2. Use HiRes fix (enabled by default in portrait workflows)
3. Verify VAE is correctly loaded

### Slow Generation

1. Use GPU mode (not CPU)
2. Reduce resolution for testing
3. Disable unnecessary post-processing

## Integration with Backend

The backend can trigger asset generation via API:

```python
# POST /api/v1/comfyui/generate
{
  "workflow": "ro3k_portrait",
  "parameters": {
    "character_description": "Veteran general...",
    "faction_color": "imperial_red_gold",
    "age_category": "middle_aged",
    "mood": "determined_resolute"
  }
}
```

See `backend/app/api/routes/comfyui.py` for full API documentation.

## CI/CD Integration

For automated asset generation in CI:

```yaml
# .github/workflows/generate-assets.yml
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup ComfyUI
        run: ./scripts/setup-comfyui-ci.sh
      - name: Generate Assets
        run: |
          cd tools/comfyui
          npx tsx generate_assets.ts --manifest assets_manifest.example.json
      - name: Upload Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: generated-assets
          path: frontend/public/assets/generated/
```

## Further Reading

- `prompts/style_ro3k.md` - Detailed style guide and prompt templates
- `models/README.md` - Model requirements and installation
- `docs/COMFYUI_CHARACTER_GENERATION.md` - Character generation details
- `docs/three-kingdoms-style-bible.md` - Visual design guidelines
