# LoRA Models Directory

This directory is for storing LoRA (Low-Rank Adaptation) models used by the Wiki Character Art pipeline and other ComfyUI workflows.

## Wiki House Style LoRA

The Wiki Character Art pipeline can optionally use a house-style LoRA for enhanced style consistency.

### Expected File

```
models/loras/wiki_house_style.safetensors
```

### If LoRA is Not Present

The generator will continue without the LoRA, using prompt-based styling instead. A warning will be logged but generation will proceed normally.

## Training a House Style LoRA

If you want to train a custom house-style LoRA:

### Prerequisites

1. **Training Dataset**: 20-50 high-quality reference images in the target style
2. **Training Environment**: GPU with sufficient VRAM (8GB+ recommended)
3. **Training Software**: 
   - [kohya-ss/sd-scripts](https://github.com/kohya-ss/sd-scripts)
   - Or [LoRA Easy Training Scripts](https://github.com/derrian-distro/LoRA_Easy_Training_Scripts)

### Dataset Preparation

1. Collect reference images that exemplify the "Modern Manga-Illustration + RO3K" style:
   - Clean confident linework
   - Cel-to-soft shading hybrid
   - High-fidelity facial features
   - RO3K color palette

2. Caption each image with style tags:
   ```
   masterpiece, best quality, manga illustration, wuxia style, 
   clean linework, cel shading, detailed face, RO3K aesthetic
   ```

3. Do NOT use images from a single artist to avoid style copying.

### Training Parameters

Recommended settings for SD1.5 LoRA:

```yaml
network_dim: 32
network_alpha: 16
learning_rate: 0.0001
unet_lr: 0.0001
text_encoder_lr: 0.00005
lr_scheduler: cosine_with_restarts
lr_warmup_steps: 100
max_train_epochs: 10
save_every_n_epochs: 1
mixed_precision: fp16
optimizer_type: AdamW8bit
```

### Output

After training, copy the `.safetensors` file to:
```
models/loras/wiki_house_style.safetensors
```

### Usage in Workflows

The LoRA is loaded with these settings:

```json
{
  "class_type": "LoraLoader",
  "inputs": {
    "model": ["checkpoint", 0],
    "clip": ["checkpoint", 1],
    "lora_name": "wiki_house_style.safetensors",
    "strength_model": 0.7,
    "strength_clip": 0.7
  }
}
```

### Recommended Weight

- **Weight 0.5-0.7**: Best for consistent style without overpowering character details
- **Weight 0.8-1.0**: Stronger style, may reduce character uniqueness
- **Weight < 0.5**: Subtle style influence only

## Other LoRAs

You can add other LoRAs for specific effects:

| LoRA | Purpose | Weight |
|------|---------|--------|
| `detail_enhancer.safetensors` | Extra fine details | 0.3-0.5 |
| `armor_detail.safetensors` | Armor/costume enhancement | 0.4-0.6 |
| `face_detail.safetensors` | Facial feature enhancement | 0.3-0.5 |

## File Naming Convention

```
{purpose}_{style}_{version}.safetensors
```

Examples:
- `wiki_house_style_v1.safetensors`
- `armor_detail_ro3k_v2.safetensors`
- `face_detail_anime_v1.safetensors`

## Security Notes

- Do not commit LoRA files to the repository (they are typically large)
- Add `*.safetensors` to `.gitignore` if not already present
- Store models securely; they may contain training data characteristics

## Troubleshooting

### LoRA Not Loading

1. Check filename matches exactly (case-sensitive)
2. Verify file is not corrupted
3. Check ComfyUI logs for loading errors

### Style Not Applying

1. Increase LoRA weight
2. Ensure LoRA is compatible with your checkpoint
3. Check that LoRA was trained on similar base model

### Artifacts or Distortion

1. Decrease LoRA weight
2. LoRA may be overtrained - use earlier epoch version
3. Verify LoRA checkpoint compatibility

## See Also

- `docs/wiki_art_pipeline.md` - Wiki art generation pipeline
- `tools/comfyui/README.md` - ComfyUI setup
- `prompts/wiki_char_house_style.md` - Style definitions
