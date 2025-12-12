# ComfyUI Character Generation System

This document provides comprehensive documentation for the ComfyUI-based character generation system integrated into the WuXuxian TTRPG combat simulator.

## Overview

The character generation system uses ComfyUI to create high-quality, iterative character artwork through a 7-layer pipeline. It includes:

- **7-Layer Iterative Pipeline**: Progressive refinement from sketch to final render
- **Face Transposition**: Maintain consistent faces across all character images
- **Poses Sheet**: 3x3 grid of character poses for different situations
- **Outfits Sheet**: 2x3 grid of outfit variations based on SCL
- **Full Character Sheet**: Composite layout with all visual elements

## Prerequisites

### Docker Setup

The easiest way to run ComfyUI is via Docker:

```bash
# Start all services including ComfyUI with GPU support
docker compose --profile gpu up -d

# Or for CPU-only mode (slower but works without NVIDIA GPU)
docker compose --profile cpu up -d
```

### Manual ComfyUI Installation

If you prefer to run ComfyUI manually:

1. Clone ComfyUI:
```bash
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt
```

2. Run the model setup script:
```bash
cd tools/comfyui
./setup_models.sh
```

3. Start ComfyUI:
```bash
python main.py --listen 0.0.0.0 --port 8188
```

## Required Models

### Checkpoint Models (Choose One)

Place in `ComfyUI/models/checkpoints/`:

| Model | Description | Download |
|-------|-------------|----------|
| AnythingV5 | Recommended for anime style | [Civitai](https://civitai.com/models/9409/anything-v5) |
| Counterfeit V3 | High quality anime | [Civitai](https://civitai.com/models/4468/counterfeit-v30) |
| MeinaMix | Great for portraits | [Civitai](https://civitai.com/models/7240/meinamix) |

### VAE (Optional but Recommended)

Place in `ComfyUI/models/vae/`:
- `kl-f8-anime2.ckpt` or
- `vae-ft-mse-840000-ema-pruned.safetensors`

### ControlNet Models

Place in `ComfyUI/models/controlnet/`:
- `control_v11p_sd15_lineart.pth` - For line art extraction
- `control_v11p_sd15_openpose.pth` - For pose control
- `control_v11f1p_sd15_depth.pth` - For depth conditioning

### Face Swap Models (ReActor)

1. Install ReActor custom node:
```bash
./tools/comfyui/custom_nodes/setup_reactor.sh
```

2. Download InsightFace models from [ReActor releases](https://github.com/Gourieff/sd-webui-reactor/releases)

3. Place `inswapper_128.onnx` in `ComfyUI/models/insightface/models/`

## 7-Layer Pipeline

The character generation pipeline processes through 7 distinct stages:

### Layer 1: Base Sketch
- **Steps**: 12
- **CFG**: 4.0
- **Purpose**: Establish rough composition, pose, and proportions
- **Output**: Grayscale sketch

### Layer 2: Line Art
- **Steps**: 18
- **CFG**: 6.0
- **Purpose**: Clean up structural lines using ControlNet conditioning
- **Output**: Clean line art

### Layer 3: Base Colors
- **Steps**: 20
- **CFG**: 7.0
- **Purpose**: Apply flat colors based on character attributes
- **Output**: Cel-shaded character

### Layer 4: Shading
- **Steps**: 22
- **CFG**: 7.5
- **Purpose**: Add light direction and shadow mapping
- **Output**: Shaded character

### Layer 5: Details
- **Steps**: 25
- **CFG**: 8.0
- **Purpose**: Enhance facial features, clothing textures, accessories
- **Output**: Detailed character

### Layer 6: Effects
- **Steps**: 20
- **CFG**: 7.0
- **Purpose**: Add pillar-based qi auras and Gu manifestations
- **Output**: Character with effects

### Layer 7: Final Render
- **Steps**: 28
- **CFG**: 7.5
- **Purpose**: Color grading and professional polish
- **Output**: Final production-ready image

## TTRPG Pillar Effects

The system integrates with the Violence/Influence/Revelation pillar system:

| Pillar | Color | Effect Type | Visual Description |
|--------|-------|-------------|---------------------|
| Violence | `#FF4444` | Flame/Sparks | Red flame aura, fiery energy |
| Influence | `#4444FF` | Ethereal Glow | Blue ethereal glow, commanding presence |
| Revelation | `#44FF44` | Mystical Symbols | Green mystical symbols, arcane knowledge |

Effect intensity scales with SCL (Soul Cultivation Level):
- SCL 1-3: Subtle effects
- SCL 4-6: Moderate effects
- SCL 7-9: Powerful effects
- SCL 10: Overwhelming effects

## API Endpoints

### Character Generation

```http
POST /api/v1/comfyui/generate/character
Content-Type: application/json

{
  "character_id": "uuid-here",
  "base_prompt": "wuxia cultivator, martial artist",
  "pillar_emphasis": "violence",
  "scl_level": 5,
  "skin_tone": "fair",
  "hair_color": "black",
  "clothing_colors": "white and blue",
  "face_reference": "embedding-id (optional)"
}
```

Response:
```json
{
  "job_id": "uuid",
  "estimated_time": 180
}
```

### Poses Sheet

```http
POST /api/v1/comfyui/generate/poses-sheet
Content-Type: application/json

{
  "character_id": "uuid",
  "face_embedding_id": "optional-embedding-id",
  "base_prompt": "character description"
}
```

### Outfits Sheet

```http
POST /api/v1/comfyui/generate/outfits-sheet
Content-Type: application/json

{
  "character_id": "uuid",
  "face_embedding_id": "optional",
  "base_prompt": "character description",
  "scl_level": 5
}
```

### Character Sheet

```http
POST /api/v1/comfyui/generate/character-sheet
Content-Type: application/json

{
  "character_id": "uuid",
  "include_stats": true
}
```

### Face Extraction

```http
POST /api/v1/comfyui/face/extract
Content-Type: multipart/form-data

image: [file]
character_id: optional-uuid
```

### Job Status

```http
GET /api/v1/comfyui/status/{job_id}
```

Response:
```json
{
  "job_id": "uuid",
  "status": "processing",
  "current_layer": 3,
  "total_layers": 7,
  "progress_percent": 42.8,
  "eta": 120,
  "error_message": null
}
```

### WebSocket Progress

```javascript
const ws = new WebSocket('ws://localhost:8000/api/v1/comfyui/progress/{job_id}');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // data.type: 'progress', 'complete', or 'error'
  // data.current_layer, data.progress_percent, etc.
};
```

### Download Results

```http
GET /api/v1/comfyui/download/{job_id}
GET /api/v1/comfyui/download/{job_id}?layer=sketch
GET /api/v1/comfyui/download/{job_id}?layer=lineart
```

## Poses Sheet Grid

The poses sheet generates a 3x3 grid (2048x2048 output):

| Row | Col 1 | Col 2 | Col 3 |
|-----|-------|-------|-------|
| 1 | Idle | Combat (Violence) | Casting (Revelation) |
| 2 | Commanding (Influence) | Injured | Maimed |
| 3 | Victory | Dead/Defeated | Back View |

## Outfits Sheet Grid

The outfits sheet generates a 2x3 grid (1536x2048 output):

| Row | Col 1 | Col 2 |
|-----|-------|-------|
| 1 | Cultivation Basic (SCL 1-3) | Cultivation Ornate (SCL 7-10) |
| 2 | Combat Armor | Casual/Civilian |
| 3 | Formal/Court | Damaged |

Outfit quality scales with SCL:
- SCL 1-3: Simple, plain materials
- SCL 4-6: Quality, respectable attire
- SCL 7-9: Elaborate, ornate clothing
- SCL 10: Legendary, divine garments

## Character Sheet Layout

The full character sheet (2560x1440) contains:

```
+------------------+---------------------+----------+
|                  |    Poses Grid       | Stats    |
|    Portrait      |    (768x512)        | Zone     |
|    (512x768)     +---------------------+ (256x768)|
|                  |   Outfits Grid      |          |
|                  |    (768x512)        |          |
+------------------+---------------------+----------+
|  Expression Strip (512x128)                       |
+--------------------------------------------------+
```

## Frontend Components

### CharacterGeneratorPanel

Main interface for triggering generation:

```tsx
import { CharacterGeneratorPanel } from './components/CharacterGenerator';

<CharacterGeneratorPanel
  characterId="uuid-here"
  onGenerationStart={(jobId) => console.log('Started:', jobId)}
  onError={(error) => console.error(error)}
/>
```

### LayerProgressView

Visual progress indicator:

```tsx
import { LayerProgressView } from './components/CharacterGenerator';

<LayerProgressView
  jobId="job-uuid"
  onComplete={(outputs) => console.log('Complete:', outputs)}
  onCancel={() => console.log('Cancelled')}
  onError={(error) => console.error(error)}
/>
```

## Environment Variables

### Backend

| Variable | Default | Description |
|----------|---------|-------------|
| `COMFYUI_URL` | `http://localhost:8188` | ComfyUI server URL |
| `COMFYUI_TIMEOUT` | `600` | Max wait time in seconds |
| `COMFYUI_POLLING_INTERVAL` | `2` | Status polling interval |
| `GENERATION_OUTPUT_DIR` | `/app/generated` | Output directory |
| `COMFYUI_CHECKPOINT` | `anythingV5.safetensors` | Default checkpoint model |

### Docker Compose

The backend automatically connects to ComfyUI when using Docker:

```yaml
environment:
  - COMFYUI_URL=http://comfyui:8188
  - GENERATION_OUTPUT_DIR=/app/generated
```

## Troubleshooting

### ComfyUI Not Responding

1. Check if ComfyUI is running:
```bash
curl http://localhost:8188/system_stats
```

2. Check Docker logs:
```bash
docker compose logs comfyui
```

3. Verify GPU access:
```bash
docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
```

### Generation Fails

1. **Missing Models**: Ensure checkpoint is in `models/checkpoints/`
2. **GPU Memory**: Reduce batch size or image dimensions
3. **Timeout**: Increase `COMFYUI_TIMEOUT` for slower hardware

### Poor Quality Output

1. **Wrong Checkpoint**: Use anime-style models for best results
2. **Prompts**: Add quality tags like "masterpiece, best quality"
3. **CFG Too High**: Reduce CFG for more creative results
4. **Steps Too Low**: Increase steps for more detail

### Face Swap Issues

1. Install ReActor custom node
2. Download InsightFace models
3. Ensure face is clearly visible in reference image

## Performance Tuning

### GPU Mode (Recommended)

- Use `--profile gpu` with Docker
- Typical generation time: 2-5 minutes per character

### CPU Mode (Fallback)

- Use `--profile cpu` with Docker
- Typical generation time: 15-30 minutes per character
- Reduce steps for faster (lower quality) results

### Memory Optimization

For systems with limited VRAM:

```bash
# Add to CLI_ARGS in docker-compose.yml
CLI_ARGS=--listen 0.0.0.0 --lowvram
```

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│     Backend     │────▶│    ComfyUI      │
│  React/TS       │     │    FastAPI      │     │  Image Gen      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │   WebSocket/REST      │   HTTP/WS API         │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  UI Components  │     │  Job Queue      │     │  Models/        │
│  Progress View  │     │  ComfyUI Client │     │  Workflows      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Security Considerations

- ComfyUI runs in isolated Docker container
- Generated files stored in mounted volumes
- Face embeddings stored securely per character
- No external API keys required

## Future Enhancements

- [ ] Batch generation for multiple characters
- [ ] Custom LoRA integration per character
- [ ] Inpainting for image editing
- [ ] Animation frame generation
- [ ] Integration with combat visualization

## Fate Card Artwork Generation

The system includes dedicated workflows for generating Fate Card artwork that matches the TTRPG's visual style.

### Card Types

| Type | Theme | Colors | Border Style |
|------|-------|--------|--------------|
| Death | Mortality, ethereal, spectral | Grayscale, silver, pale blue | Bone, skull, hourglasses |
| Body | Physical prowess, martial arts | Earth tones, bronze, copper | Weapons, armor, martial symbols |
| Seed | Elemental essence, cultivation | Per-element colors | Energy patterns, lotus, yin-yang |

### API Endpoints

**Generate Single Card:**
```http
POST /api/v1/fate-cards/generate
Content-Type: application/json

{
  "card_type": "death",
  "card_id": "silent_river",
  "card_name": "Silent River",
  "rarity": "common",
  "color_scheme": null
}
```

**Batch Generation:**
```http
POST /api/v1/fate-cards/generate/batch
Content-Type: application/json

{
  "cards": [
    {"card_type": "death", "card_id": "silent_river", "card_name": "Silent River", "rarity": "common"},
    {"card_type": "body", "card_id": "stone_anchor", "card_name": "Stone Anchor", "rarity": "uncommon"}
  ]
}
```

**Get Card Prompts:**
```http
GET /api/v1/fate-cards/prompts/death/silent_river
```

**List Available Cards:**
```http
GET /api/v1/fate-cards/available-cards
```

### Frontend Component

```tsx
import { FateCardGenerator } from './components/FateCardGenerator';

<FateCardGenerator
  card={fateCard}
  onGenerationComplete={(card, imageUrl) => {
    console.log(`Generated artwork for ${card.name}: ${imageUrl}`);
  }}
/>
```

## NPC Portrait Generation

Generate portraits for NPCs based on character archetypes from the Romance of Three Kingdoms aesthetic.

### Archetype Categories

| Category | Examples | Outfit Tiers |
|----------|----------|--------------|
| Military | General, Warrior, Archer, Mercenary | Low to High |
| Nobility | Emperor, Prince, Duke, Minister | High to Legendary |
| Scholars | Strategist, Teacher, Physician | Low to High |
| Cultivators | Sect Elder, Disciple, Alchemist | All tiers |
| Commoners | Merchant, Farmer, Craftsman | Minimal to Medium |

### Portrait Parameters

- **Gender**: Male, Female
- **Age Variants**: Youth, Young Adult, Middle Aged, Elder, Ancient
- **Expressions**: Neutral, Happy, Angry, Sad, Surprised, Determined, Scheming, Fearful
- **Outfit Tier**: Minimal, Low, Medium, High, Legendary

### Workflow File

The NPC portrait workflow is at `tools/comfyui/workflows/npc_portrait.json`.

## UI Asset Generation

Generate UI assets including icons, backgrounds, and card frames.

### Asset Categories

**Icons:**
- Stat icons (strength, dexterity, etc.)
- Aether icons (fire, ice, void)
- Combat icons (THP, AE, DR, Guard, Strain)
- Pillar icons (Violence, Influence, Revelation)
- Cost track icons (Blood, Fate, Stain)
- Action icons (Attack, Defend, Technique, Quick)
- Navigation icons (Home, Character, Combat, Wiki, Settings)

**Card Frames:**
- Death card frames (by rarity)
- Body card frames (by rarity)
- Seed card frames (by color)
- Card backs

**Backgrounds:**
- Combat arenas (Duel, Battlefield, Sect Training, Palace)
- Dialogue scenes (Teahouse, Mountain Path, City Street, Sect Hall)
- Menu screens (Main Menu, Character Select, Loading)

### Workflow File

The UI assets workflow is at `tools/comfyui/workflows/ui_assets.json`.

## Asset Management & Safety

### Rate Limiting

- 20 generations per user per hour
- 100 generations per user per day
- 10 global generations per minute

### Disk Usage Limits

- Maximum 2GB total disk usage for generated assets
- 7-day TTL for non-base assets
- Automatic cleanup of expired and orphan files

### Memory Safety

- Maximum 3 concurrent generation jobs
- Maximum 50 queued jobs total
- Bounded in-memory job queue
- Proper cleanup on job cancellation

See `docs/COMFYUI_GAP_REPORT.md` for detailed system architecture and safety considerations.

## Support

For issues specific to this integration:
1. Check ComfyUI server logs
2. Verify model installations
3. Review backend error logs at `/recent-errors`
4. Check the [ComfyUI documentation](https://docs.comfy.org/)

For TTRPG system questions, see the main documentation in `docs/wuxiaxian-reference/`.
