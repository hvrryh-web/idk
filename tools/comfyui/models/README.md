# ComfyUI Model Requirements for WuXuxian TTRPG

This document lists all required and recommended models for the Romance of Three Kingdoms Visual Novel art generation pipeline.

## Quick Start

1. Install ComfyUI following the [official instructions](https://github.com/comfyanonymous/ComfyUI)
2. Run `./setup_models.sh` to create directory structure
3. Download models from the sources listed below
4. Place models in the appropriate directories

---

## Required Models

### Checkpoint Models (Choose One)

Place in `ComfyUI/models/checkpoints/`

| Model | Recommendation | Style | Download |
|-------|---------------|-------|----------|
| **Animagine XL 3.1** | ⭐ Recommended for SDXL | High-quality anime/game art | [HuggingFace](https://huggingface.co/cagliostrolab/animagine-xl-3.1) |
| AnythingV5 | Good for SD1.5 | Versatile anime style | [Civitai](https://civitai.com/models/9409/anything-v5) |
| Counterfeit V3 | Alternative SD1.5 | High detail anime | [Civitai](https://civitai.com/models/4468/counterfeit-v30) |
| MeinaMix | Portrait specialist | Great for character faces | [Civitai](https://civitai.com/models/7240/meinamix) |

**Standardized Choice**: For consistency across all ro3k workflows, we recommend **Animagine XL 3.1** for SDXL-based generation or **AnythingV5** for SD1.5.

### VAE Models

Place in `ComfyUI/models/vae/`

| Model | For | Download |
|-------|-----|----------|
| sdxl_vae.safetensors | SDXL checkpoints | Included with SDXL base |
| vae-ft-mse-840000-ema-pruned.safetensors | SD1.5 checkpoints | [HuggingFace](https://huggingface.co/stabilityai/sd-vae-ft-mse-original) |
| kl-f8-anime2.ckpt | Anime-optimized | [Various sources] |

---

## Optional Models (Enhanced Features)

### ControlNet Models

Place in `ComfyUI/models/controlnet/`

Required for pose control in group compositions and consistent character poses.

| Model | Purpose | Download |
|-------|---------|----------|
| control_v11p_sd15_openpose | Pose control | [HuggingFace](https://huggingface.co/lllyasviel/ControlNet-v1-1) |
| control_v11p_sd15_lineart | Line art conditioning | [HuggingFace](https://huggingface.co/lllyasviel/ControlNet-v1-1) |
| control_v11f1p_sd15_depth | Depth-based conditioning | [HuggingFace](https://huggingface.co/lllyasviel/ControlNet-v1-1) |

For SDXL:
| Model | Purpose | Download |
|-------|---------|----------|
| controlnet-openpose-sdxl | Pose control SDXL | [HuggingFace](https://huggingface.co/thibaud/controlnet-openpose-sdxl-1.0) |

### IP-Adapter Models (Style Consistency)

Place in `ComfyUI/models/ipadapter/`

Required for `ro3k_style_adapter.json` workflow.

| Model | Purpose | Download |
|-------|---------|----------|
| ip-adapter-plus_sd15.bin | Style transfer SD1.5 | [HuggingFace](https://huggingface.co/h94/IP-Adapter) |
| ip-adapter-plus_sdxl.bin | Style transfer SDXL | [HuggingFace](https://huggingface.co/h94/IP-Adapter) |

### CLIP Vision Models

Place in `ComfyUI/models/clip_vision/`

Required for IP-Adapter functionality.

| Model | Purpose | Download |
|-------|---------|----------|
| clip-vit-h-14-laion2B-s32B-b79K.safetensors | IP-Adapter vision encoding | [HuggingFace](https://huggingface.co/laion/CLIP-ViT-H-14-laion2B-s32B-b79K) |

### LoRA Models (Style Enhancement)

Place in `ComfyUI/models/loras/`

Optional LoRAs to enhance ROTK aesthetic:

| Model Type | Purpose | Search Terms on Civitai |
|------------|---------|------------------------|
| Chinese Traditional Clothing | Hanfu, dynasty robes | "hanfu", "chinese traditional", "dynasty" |
| Ink Wash Style | Traditional painting look | "ink wash", "sumi-e", "chinese painting" |
| Armor Detail | Ornate period armor | "chinese armor", "dynasty warriors" |
| Wuxia Style | Martial arts fantasy | "wuxia", "xianxia", "cultivation" |

**Note**: Search Civitai for LoRAs that match the ROTK aesthetic. Recommended strength: 0.5-0.8.

### Face Swap Models (ReActor)

Place in `ComfyUI/models/insightface/models/`

Required for face consistency across character variants.

| Model | Purpose | Download |
|-------|---------|----------|
| inswapper_128.onnx | Face swapping | [ReActor Releases](https://github.com/Gourieff/sd-webui-reactor/releases) |
| buffalo_l | Face detection/embedding | Included with InsightFace |

---

## Custom Nodes Required

Install these ComfyUI custom nodes for full workflow functionality:

### Essential
```bash
cd ComfyUI/custom_nodes

# ComfyUI Manager (for easy node installation)
git clone https://github.com/ltdrdata/ComfyUI-Manager.git

# IP-Adapter support
git clone https://github.com/cubiq/ComfyUI_IPAdapter_plus.git

# ControlNet support (if not included)
git clone https://github.com/Fannovel16/comfyui_controlnet_aux.git
```

### Optional
```bash
# Face swap (ReActor)
git clone https://github.com/Gourieff/ComfyUI-ReActor.git

# Background removal
git clone https://github.com/Acly/comfyui-tooling-nodes.git

# Upscaling
git clone https://github.com/ssitu/ComfyUI_UltimateSDUpscale.git
```

---

## Directory Structure

After setup, your ComfyUI models directory should look like:

```
ComfyUI/
├── models/
│   ├── checkpoints/
│   │   └── animagine-xl-3.1.safetensors  (or your chosen checkpoint)
│   ├── vae/
│   │   └── sdxl_vae.safetensors
│   ├── controlnet/
│   │   ├── control_v11p_sd15_openpose.pth
│   │   └── control_v11p_sd15_lineart.pth
│   ├── ipadapter/
│   │   └── ip-adapter-plus_sdxl.bin
│   ├── clip_vision/
│   │   └── clip-vit-h-14-laion2B-s32B-b79K.safetensors
│   ├── loras/
│   │   └── (optional style LoRAs)
│   └── insightface/
│       └── models/
│           └── inswapper_128.onnx
└── custom_nodes/
    ├── ComfyUI-Manager/
    ├── ComfyUI_IPAdapter_plus/
    └── comfyui_controlnet_aux/
```

---

## Workflow-Specific Requirements

### ro3k_portrait.json
- **Required**: Checkpoint, VAE
- **Optional**: IP-Adapter (for style consistency)

### ro3k_group_poster.json
- **Required**: Checkpoint, VAE
- **Recommended**: ControlNet OpenPose (for pose layout)
- **Optional**: IP-Adapter

### ro3k_bg_environment.json
- **Required**: Checkpoint, VAE
- **Optional**: ControlNet Depth (for parallax-ready depth)

### ro3k_ui_motifs.json
- **Required**: Checkpoint, VAE
- **Recommended**: Background removal node

### ro3k_style_adapter.json
- **Required**: Checkpoint, VAE, IP-Adapter, CLIP Vision
- **Alternative**: Style LoRA if IP-Adapter unavailable

### ro3k_advisor_zhou_xu.json
- **Required**: Checkpoint, VAE
- **Recommended**: Face swap (for expression consistency)

---

## Pinned Versions (Reproducibility)

For consistent results across team members, pin to these versions:

```yaml
checkpoint: animagine-xl-3.1.safetensors
  sha256: [document after download]
  
vae: sdxl_vae.safetensors
  sha256: [document after download]

ip_adapter: ip-adapter-plus_sdxl.bin
  version: 2023-12-20
  
controlnet_openpose: controlnet-openpose-sdxl-1.0
  version: 1.0
```

---

## Troubleshooting

### Model Not Found
1. Verify file is in correct directory
2. Check filename matches exactly (case-sensitive)
3. Restart ComfyUI after adding models

### Out of Memory (OOM)
1. Use `--lowvram` or `--medvram` flags when starting ComfyUI
2. Reduce batch size to 1
3. Use SD1.5 models instead of SDXL on limited VRAM

### Poor Quality Output
1. Ensure using recommended checkpoint
2. Verify VAE is loaded (not using built-in)
3. Check prompt follows style guide in `prompts/style_ro3k.md`

### IP-Adapter Not Working
1. Verify both IP-Adapter and CLIP Vision models are installed
2. Install ComfyUI_IPAdapter_plus custom node
3. Restart ComfyUI

---

## Download Script

Run from repository root:

```bash
cd tools/comfyui
./setup_models.sh
```

This will:
1. Create all necessary directories
2. Provide download links for each model
3. Verify existing installations

---

## License Notes

- Most models are released under CreativeML Open RAIL-M or similar licenses
- Review individual model licenses before commercial use
- Some Civitai models have usage restrictions - check before downloading
- Do not redistribute model files directly

---

## Support

For model-related issues:
1. Check ComfyUI Discord community
2. Review model's original documentation
3. Verify ComfyUI version compatibility

For workflow-specific issues:
1. See `docs/COMFYUI_CHARACTER_GENERATION.md`
2. Check `docs/COMFYUI_GAP_REPORT.md` for known issues
