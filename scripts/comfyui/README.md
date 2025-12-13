# ComfyUI Character Portrait Generator

This directory contains scripts for generating character portrait images using ComfyUI's AI art generation capabilities.

## Scripts

### generate_portraits.py

Main script for generating character portraits. Calls the ComfyUI API to create portraits for NPCs and sample characters used in the frontend.

## Usage

### Prerequisites

1. Install and run ComfyUI:
   ```bash
   cd /path/to/ComfyUI
   python main.py
   ```

2. Ensure you have an SDXL checkpoint model installed in ComfyUI's models directory.

### Generate All Characters

```bash
python generate_portraits.py
```

### Generate Specific Characters

```bash
python generate_portraits.py --characters guan-yu zhao-yun cao-cao
```

### Preview Prompts (Dry Run)

```bash
python generate_portraits.py --dry-run
```

### Custom Configuration

```bash
# Use a custom config file
python generate_portraits.py --config my_characters.json

# Specify output directory
python generate_portraits.py --output /path/to/output

# Connect to different ComfyUI server
python generate_portraits.py --server http://192.168.1.100:8188
```

### Save Default Configuration

```bash
python generate_portraits.py --save-config
```

This creates/updates `character_config.json` with the default character list.

## Configuration

The `character_config.json` file defines:

- **characters**: List of characters to generate with their descriptions
- **style_presets**: Base prompts for different character types
- **settings**: ComfyUI connection and generation settings

### Character Definition

```json
{
  "id": "character-id",
  "name": "English Name",
  "name_cjk": "中文名",
  "style": "warrior",
  "description": "Character-specific description",
  "faction": "shu"
}
```

### Available Styles

- `warrior` - Combat-focused characters
- `strategist` - Scholars and advisors
- `general` - Military commanders
- `noble` - Lords and nobles
- `villain` - Antagonists
- `female_warrior` - Female combat characters
- `advisor` - Court advisors

### Factions

- `shu` - Green/gold color palette
- `wei` - Blue/silver color palette
- `wu` - Red/orange color palette
- `neutral` - Earth tones

## Output

Generated images are saved to:
```
frontend/public/assets/characters/generated/
```

Each image is named `{character-id}.png` and can be referenced in frontend components.

## Troubleshooting

### Cannot connect to ComfyUI
- Ensure ComfyUI is running: `python main.py`
- Check the server URL (default: http://localhost:8188)
- Verify firewall settings

### Generation timeout
- Increase `timeout_per_image` in config
- Check ComfyUI console for errors
- Ensure GPU is available and not overloaded

### Missing checkpoint
- Download SDXL checkpoint from HuggingFace
- Place in ComfyUI's `models/checkpoints/` directory
- Update `checkpoint` in config if using different model
