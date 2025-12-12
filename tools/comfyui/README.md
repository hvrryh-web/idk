# ComfyUI Integration Pipeline

This directory contains the ComfyUI-driven asset generation pipeline for the character customization system.

## Overview

The pipeline generates character base models and overlay assets using ComfyUI's API, following a deterministic and repeatable process defined in `asset_spec.yaml`.

## Prerequisites

### 1. ComfyUI Installation

Install ComfyUI locally:

```bash
# Clone ComfyUI repository
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Install dependencies
pip install -r requirements.txt

# Download a checkpoint model (e.g., Stable Diffusion)
# Place it in: models/checkpoints/

# Start ComfyUI server
python main.py
```

ComfyUI will start on `http://127.0.0.1:8188` by default.

### 2. Required Models

Place required checkpoint models in ComfyUI's `models/checkpoints/` directory:
- Recommended: Models trained on anime/manhwa style (e.g., "Anything V3", "CounterfeitV3")
- For period-appropriate art: Consider fine-tuned models for Asian historical aesthetics

### 3. Node.js Dependencies

```bash
# From project root
npm install
```

For the asset generator to work, you may need to install additional dependencies:

```bash
npm install js-yaml @types/js-yaml
```

## File Structure

```
tools/comfyui/
├── asset_spec.yaml           # Asset generation specification
├── generate_assets.ts        # Main generation script
├── workflows/                # ComfyUI workflow JSON templates
│   ├── base_character.json
│   └── overlay_layer.json
├── prompts/                  # Prompt templates for each asset
│   ├── female_base.txt
│   ├── male_base.txt
│   ├── hair/
│   ├── eyes/
│   ├── brows/
│   ├── mouth/
│   └── outfit/
└── README.md                 # This file
```

## Usage

### Basic Usage

1. **Start ComfyUI server** (in a separate terminal):
   ```bash
   cd /path/to/ComfyUI
   python main.py
   ```

2. **Run the asset generator**:
   ```bash
   cd tools/comfyui
   npx tsx generate_assets.ts
   ```

### Environment Variables

- `COMFYUI_URL` - ComfyUI server URL (default: `http://127.0.0.1:8188`)
- `COMFYUI_API_KEY` - Optional API key if your ComfyUI instance requires authentication

Example:
```bash
COMFYUI_URL=http://localhost:8188 npx tsx generate_assets.ts
```

### Custom Spec File

```bash
npx tsx generate_assets.ts --spec custom_asset_spec.yaml
```

## Asset Specification Format

The `asset_spec.yaml` file defines all assets to generate:

```yaml
version: "1.0.0"
output_dir: "../frontend/public/assets/characters"
manifest_output: "../frontend/public/assets/characters/asset_manifest.json"

base_models:
  - id: "female"
    name: "Female Base"
    workflow: "base_character.json"
    prompt_template: "prompts/female_base.txt"
    output_filename: "bases/female_base_neutral.png"
    dimensions:
      width: 512
      height: 768
    seed: 42
    negative_prompt: "blurry, low quality, ..."

categories:
  - id: "hair"
    name: "Hair Style"
    description: "Traditional and modern hairstyles"
    workflow: "overlay_layer.json"
    options:
      - id: "hair-001"
        name: "Long Flowing"
        layers:
          - type: "hair_back"
            prompt_template: "prompts/hair/long_flowing_back.txt"
            output_filename: "overlays/hair/hair-001-back.png"
            seed: 1001
```

## Workflow Templates

Workflow templates are JSON files that define the ComfyUI node graph. They use template variables that are replaced at runtime:

- `{{positive_prompt}}` - Main generation prompt
- `{{negative_prompt}}` - Things to avoid
- `{{seed}}` - Random seed for reproducibility
- `{{width}}`, `{{height}}` - Output dimensions
- `{{checkpoint_name}}` - Model checkpoint to use
- `{{output_prefix}}` - Output filename prefix

## Prompt Templates

Prompt templates are plain text files containing the generation prompts. They should follow this structure:

```
[style description], [subject description], [technical details], [quality tags]
```

Example:
```
manhwa style, chinese period art inspired, female character, 
long flowing hair back layer, ink wash painting technique, 
semi-realistic, transparent background, high quality detail
```

## Adding New Options

To add a new customization option:

1. **Update `asset_spec.yaml`**:
   ```yaml
   categories:
     - id: "hair"
       options:
         - id: "hair-006"  # New option
           name: "Elaborate Updo"
           layers:
             - type: "hair_back"
               prompt_template: "prompts/hair/elaborate_back.txt"
               output_filename: "overlays/hair/hair-006-back.png"
               seed: 1011
             - type: "hair_front"
               prompt_template: "prompts/hair/elaborate_front.txt"
               output_filename: "overlays/hair/hair-006-front.png"
               seed: 1012
           thumbnail_output: "overlays/hair/hair-006-thumb.png"
   ```

2. **Create prompt templates**:
   ```bash
   # Create prompts/hair/elaborate_back.txt
   # Create prompts/hair/elaborate_front.txt
   ```

3. **Run the generator**:
   ```bash
   npx tsx generate_assets.ts
   ```

4. **Update the manifest**:
   The generator will create the assets. Update `asset_manifest.json` to include the new option in the UI.

## Manifest Generation

After generating assets, you should update the `asset_manifest.json` file to reflect the new assets. This can be done:

1. **Manually**: Edit `frontend/public/assets/characters/asset_manifest.json`
2. **Automatically**: Extend `generate_assets.ts` to also regenerate the manifest

## Troubleshooting

### ComfyUI Not Responding

```bash
# Check if ComfyUI is running
curl http://127.0.0.1:8188/system_stats

# Check ComfyUI logs for errors
# Look in the terminal where you started ComfyUI
```

### Generation Fails

1. **Check prompt templates exist**: Verify all `prompt_template` paths in `asset_spec.yaml` point to existing files
2. **Check workflow templates**: Ensure workflow JSON files are valid
3. **Check ComfyUI models**: Verify checkpoint models are installed in ComfyUI
4. **Check disk space**: Ensure sufficient space for generated images

### Poor Quality Outputs

1. **Adjust prompts**: Refine prompt templates for better results
2. **Adjust seeds**: Change seed values in `asset_spec.yaml`
3. **Adjust workflow parameters**: Modify steps, CFG, or sampler in workflow templates
4. **Try different models**: Use different checkpoint models better suited for the style

## API Reference

### ComfyUI API Endpoints

- `POST /prompt` - Submit a workflow for execution
- `GET /history/{prompt_id}` - Check workflow execution status
- `GET /view?filename={name}` - Download generated image
- `WS /ws` - WebSocket for progress updates (optional)

### Generation Flow

1. Read `asset_spec.yaml`
2. Load workflow templates
3. For each asset:
   - Read prompt template
   - Replace template variables in workflow
   - Submit workflow to ComfyUI via `POST /prompt`
   - Poll `GET /history/{prompt_id}` until complete
   - Download image via `GET /view?filename=...`
   - Save to output directory

## Performance Notes

- **Generation time**: ~30-60 seconds per image (depends on hardware)
- **Parallelization**: Current implementation is sequential; could be parallelized
- **Caching**: ComfyUI may cache models; first run will be slower

## Future Enhancements

- [ ] WebSocket support for real-time progress
- [ ] Parallel asset generation
- [ ] Automatic manifest regeneration
- [ ] Validation of generated assets
- [ ] Thumbnail auto-generation
- [ ] Mask generation for recoloring
- [ ] Batch generation modes

## References

- [ComfyUI Documentation](https://docs.comfy.org/)
- [ComfyUI Workflow JSON Spec](https://docs.comfy.org/specs/workflow_json)
- [ComfyUI API Routes](https://docs.comfy.org/development/comfyui-server/comms_routes)
- [ComfyUI API Tutorial](https://dev.to/methodox/devlog-20250710-comfyui-api-1mi0)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Consult ComfyUI documentation
3. Review the asset_spec.yaml format
4. Check that all template files exist and are valid
