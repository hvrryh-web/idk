# Wiki Character Art Pipeline

This document describes the Wiki Character Art generation pipeline for creating high-quality, fully colored, professional character renders for Player Characters and Named Characters.

## Overview

The Wiki Character Art pipeline produces **highlight illustrations** for the game's Wiki pages. These are premium-quality character renders that are:

- Highly detailed and fully colored
- Cohesive with the game's RO3K (Romance of Three Kingdoms) visual base style
- Professional manga-illustration quality
- Readable at thumbnail sizes

**Important:** This pipeline is restricted to **Player Characters and Named Characters only**. Generic NPCs are not eligible for wiki-quality art generation.

## House Style: Modern Manga-Illustration + RO3K

The pipeline uses an original "House Style" that combines modern manga-illustration techniques with Romance of Three Kingdoms aesthetics:

| Quality | Description |
|---------|-------------|
| **Linework** | Crisp, confident ink lines; minimal sketchiness |
| **Shading** | Smooth, controlled cel-to-soft shading hybrid |
| **Faces** | High-fidelity facial features; clean skin rendering |
| **Costumes** | Emphasis on embroidered trims, brocade patterns, accessories |
| **Colors** | Rich reds, blacks, jade/teal accents, gold trim |
| **Readability** | High readability at thumbnail size |

**Note:** This style is an original creation and does not attempt to replicate any single living artist's exact style.

## Deliverables

### Workflows

| File | Purpose | Resolution |
|------|---------|------------|
| `workflows/wiki_char_portrait_detailed.json` | Bust/upper-body portraits | 1024×1536 |
| `workflows/wiki_char_fullbody_detailed.json` | Full figure renders | 1024×1536 or 1216×832 |
| `workflows/wiki_char_expressions_sheet.json` | Expression grid sheets | 2048×3072 (2×3) or 3072×3072 (3×3) |

### Supporting Files

| File | Purpose |
|------|---------|
| `prompts/wiki_char_house_style.md` | Style block definitions |
| `manifests/wiki_characters.example.json` | Character manifest template |
| `tools/generate_wiki_character_art.ts` | Generation automation script |

## Prerequisites

### 1. ComfyUI Installation

Follow the setup in `tools/comfyui/README.md` or use Docker:

```bash
docker compose --profile gpu up -d
```

### 2. Required Models

Place in ComfyUI's model directories:

**Checkpoints (choose one):**
- `anythingV5.safetensors` (recommended)
- `counterfeitV3.safetensors`
- `meinamix.safetensors`

**Optional Enhancements:**
- VAE: `kl-f8-anime2.ckpt`
- ControlNet (for pose control): `control_v11p_sd15_openpose.pth`

### 3. House Style LoRA (Optional)

If you have a trained house-style LoRA, place it at:
```
models/loras/wiki_house_style.safetensors
```

The generator will use it if available, otherwise continue with base prompts.

## Character Manifest

The generator reads character data from a JSON manifest file. See `manifests/wiki_characters.example.json` for the full schema.

### Key Fields

```json
{
  "char_id": "pc-001",
  "display_name": "Lin Xiaoyun",
  "role": "Player Character",
  "character_type": "player_character",
  "allowed": true,
  
  "visual_traits": {
    "gender": "female",
    "hair_color": "jet black",
    "hair_style": "long flowing with ornate hairpins",
    "eye_color": "amber",
    "skin_tone": "fair porcelain",
    "distinctive_features": "beauty mark below left eye"
  },
  
  "outfit": {
    "description": "elegant cultivator robes with flowing sleeves",
    "primary_color": "deep jade green",
    "secondary_color": "silver trim"
  },
  
  "variants": {
    "portrait": ["default", "combat", "formal"],
    "fullbody": ["default"],
    "expressions": ["standard_6"]
  },
  
  "generation_seeds": {
    "portrait_base": 100001,
    "fullbody_base": 200001,
    "expressions_base": 300001
  }
}
```

### Allowed Field

**Critical:** Only characters with `"allowed": true` will be processed.

| Character Type | Allowed |
|---------------|---------|
| `player_character` | ✅ Yes |
| `named_npc` | ✅ Yes |
| `generic_npc` | ❌ No |

## Usage

### Basic Generation

Generate all wiki art for all allowed characters:

```bash
npx tsx tools/generate_wiki_character_art.ts
```

### Specific Character

Generate art for a specific character:

```bash
npx tsx tools/generate_wiki_character_art.ts --char pc-001
```

### Specific Type

Generate only portraits:

```bash
npx tsx tools/generate_wiki_character_art.ts --type portrait
```

### Specific Variant

Generate specific variant:

```bash
npx tsx tools/generate_wiki_character_art.ts --char pc-001 --type portrait --variant combat
```

### Dry Run

Preview what would be generated:

```bash
npx tsx tools/generate_wiki_character_art.ts --dry-run
```

### Custom Manifest

Use a different manifest file:

```bash
npx tsx tools/generate_wiki_character_art.ts --manifest manifests/my_characters.json
```

### Full Options

```
Options:
  --manifest <path>      Path to manifest file (default: manifests/wiki_characters.json)
  --char <char_id>       Generate for specific character only
  --type <type>          Generate only: portrait, fullbody, or expressions
  --variant <variant>    Generate specific variant only
  --dry-run              Preview without generating
  --output <path>        Override output directory
  --comfyui-url <url>    ComfyUI server URL (default: http://127.0.0.1:8188)
  --help                 Show help
```

## Output Structure

Generated files are organized as:

```
wiki_assets/
└── characters/
    ├── index.json                          # Catalog for wiki frontend
    ├── pc-001/
    │   ├── portrait_default_100001.png
    │   ├── portrait_default_100001.json    # Sidecar metadata
    │   ├── portrait_combat_100002.png
    │   ├── portrait_combat_100002.json
    │   ├── fullbody_default_200001.png
    │   ├── fullbody_default_200001.json
    │   ├── expressions_300001.png
    │   └── expressions_300001.json
    └── npc-general-001/
        ├── portrait_default_100101.png
        └── ...
```

### Sidecar Metadata

Each generated image has a JSON sidecar with:

```json
{
  "workflow_name": "wiki_char_portrait_detailed",
  "workflow_version": "1.0.0",
  "character_id": "pc-001",
  "character_name": "Lin Xiaoyun",
  "faction": "Qingfeng Sect",
  "role": "Player Character",
  "variant": "default",
  "seed": 100001,
  "checkpoint_model": "anythingV5.safetensors",
  "prompt_positive": "...",
  "prompt_negative": "...",
  "resolution": {"width": 1024, "height": 1536},
  "generation_timestamp": "2024-01-01T12:00:00Z"
}
```

### Index Catalog

The `index.json` file provides a catalog for the wiki frontend:

```json
{
  "generated_at": "2024-01-01T12:00:00Z",
  "total_generated": 15,
  "characters": {
    "pc-001": {
      "display_name": "Lin Xiaoyun",
      "assets": {
        "portraits": ["pc-001/portrait_default_100001.png", ...],
        "fullbody": ["pc-001/fullbody_default_200001.png"],
        "expressions": ["pc-001/expressions_300001.png"]
      }
    }
  }
}
```

## Workflow Details

### Portrait Workflow

**Goal:** Wiki highlight bust shot

**Pipeline:**
1. Base generation (1024×1536, 30 steps)
2. Face refinement pass (conservative, 0.3 denoise)
3. Post-processing (mild sharpen, contrast)
4. Optional background removal

**Composition:**
- Bust/half-body framing
- 3/4 view facing slightly left
- Clean gradient background
- Hands off-frame or simplified

### Full-Body Workflow

**Goal:** Wiki featured render

**Pipeline:**
1. Base generation (1024×1536 or 1216×832)
2. Hi-res fix / latent upscale (0.45 denoise)
3. Face refinement (very conservative, 0.25 denoise)
4. Post-processing
5. Optional background removal

**Features:**
- Full figure from head to feet
- Optional ControlNet pose guide
- Garment detail preservation through hi-res fix
- Clean studio/gradient background

### Expression Sheet Workflow

**Goal:** 2×3 or 3×3 expression grid

**Expressions Included:**
- Standard 6: neutral, happy, angry, sad, determined, surprised
- Extended 9: + scheming, fearful, confident

**Identity Consistency:**
- Same seed base + expression offset
- Identity anchors in prompts
- Consistent outfit throughout

## Style Consistency Options

### Option 1: House Style LoRA (Preferred)

If you train a LoRA on the house style:

1. Train using target style references
2. Save to `models/loras/wiki_house_style.safetensors`
3. Update manifest: `"house_style_lora": "wiki_house_style.safetensors"`
4. Generator will automatically load it

### Option 2: IP-Adapter Style Reference

For style consistency without training:

1. Prepare 1-3 style reference images
2. Enable IP-Adapter in workflow
3. Use conservative `style_strength: 0.5`
4. Set `structure_preservation: 0.8`

**Important:** Do not copy recognizable characters from references.

## Quality Checklist

Before publishing wiki art, verify:

- [ ] Character is clearly recognizable
- [ ] No deformed hands/anatomy
- [ ] Clean, high-contrast rendering
- [ ] Readable at thumbnail size (128×192)
- [ ] No logos, watermarks, or text
- [ ] Consistent with RO3K color palette
- [ ] Appropriate costume detail visible
- [ ] Expression matches variant name

## Troubleshooting

### ComfyUI Not Responding

```bash
# Check status
curl http://127.0.0.1:8188/system_stats

# Check Docker logs
docker compose logs comfyui
```

### Poor Quality Output

1. **Check checkpoint model** - Use anime-style models
2. **Increase steps** - Try 35+ for more detail
3. **Adjust CFG** - 7.0-7.5 is optimal
4. **Check negative prompts** - Ensure all quality terms present

### Inconsistent Characters

1. **Use fixed seeds** - Same seed = same character base
2. **Add identity anchors** - Specific features in prompts
3. **Consider IP-Adapter** - For stronger consistency

### Generation Timeout

1. **Check GPU memory** - May need `--lowvram` flag
2. **Increase timeout** - `COMFYUI_TIMEOUT=600`
3. **Reduce batch size** - For expression sheets

## Integration with Wiki

The wiki frontend can consume `wiki_assets/characters/index.json` to display character art:

```typescript
// Example integration
const wikiAssets = await fetch('/wiki_assets/characters/index.json').then(r => r.json());

const character = wikiAssets.characters['pc-001'];
const portraitUrl = `/wiki_assets/characters/${character.assets.portraits[0]}`;
```

## Security & Licensing

- Generated art is for use within this project only
- Do not redistribute model checkpoints
- Face embeddings are stored per-character, not shared
- All generations are tracked via sidecar metadata

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01 | Initial wiki art pipeline |

## See Also

- `tools/comfyui/README.md` - General ComfyUI setup
- `docs/COMFYUI_CHARACTER_GENERATION.md` - Full character generation system
- `prompts/wiki_char_house_style.md` - Style definitions
- `docs/three-kingdoms-style-bible.md` - RO3K visual reference
