# Diao Chan Reference Images

This directory contains reference images for the character **Diao Chan** to be used as:
1. Visual placeholders in the application
2. Base references for ComfyUI image generation
3. Training data for LoRA (Low-Rank Adaptation) model creation
4. Reference material for character sheet generation

## Image Inventory

Please download and place the following images from the GitHub issue into this directory:

### Image 001 - Full Body Portrait (Primary Reference)
- **URL**: `https://github.com/user-attachments/assets/54792596-238c-42e7-bf77-c55429382940`
- **Filename**: `diao-chan-001-fullbody-primary.jpg`
- **Description**: Full body pose with purple/pink robes, dynamic flowing fabric
- **Usage**: Primary reference for full-body character generation
- **Style**: Dynasty Warriors / Romance of Three Kingdoms game art style
- **Key Features**: Purple gradient robes, ornate hair decorations, elegant pose

### Image 002 - Costume Variants Sheet
- **URL**: `https://github.com/user-attachments/assets/85367db6-c196-4dca-8737-c79a7b3332c8`
- **Filename**: `diao-chan-002-costume-variants.jpg`
- **Description**: Multiple costume variations in a horizontal layout
- **Usage**: Reference for outfit variety and design elements
- **Contains**: ~9 different costume designs showing color/style variations

### Image 003 - Artistic Portrait
- **URL**: `https://github.com/user-attachments/assets/81585c59-6139-44cd-acba-c6d36c805268`
- **Filename**: `diao-chan-003-artistic-portrait.jpg`
- **Description**: Soft painted style portrait with ribbon weapon
- **Usage**: Style reference for softer, artistic rendering
- **Style**: Ink wash painting aesthetic, ethereal quality

### Image 004 - Close-up Portrait
- **URL**: `https://github.com/user-attachments/assets/18714f50-cc38-4521-b1e5-3a01f249602c`
- **Filename**: `diao-chan-004-closeup-portrait.jpg`
- **Description**: Detailed facial close-up with ornate accessories
- **Usage**: Face reference for portrait generation and facial consistency
- **Key Features**: Clear facial features, detailed hair ornaments, purple/gold accents

### Image 005 - Standing Pose
- **URL**: `https://github.com/user-attachments/assets/193d7b73-3764-4b70-b762-5ec2ad71e0f5`
- **Filename**: `diao-chan-005-standing-pose.jpg`
- **Description**: Full body standing pose with weapon
- **Usage**: Pose reference for combat/idle stances

### Image 006 - (Additional Reference 1)
- **URL**: `https://github.com/user-attachments/assets/5be6ba86-82f9-40ae-bf35-5d73f7188dbe`
- **Filename**: `diao-chan-006-reference.jpg`
- **Description**: Additional reference material
- **Usage**: Supplementary reference for character consistency

### Image 007 - (Additional Reference 2)
- **URL**: `https://github.com/user-attachments/assets/c33bc381-12b7-46cb-803e-209df95ef198`
- **Filename**: `diao-chan-007-reference.jpg`
- **Description**: Additional reference material
- **Usage**: Supplementary reference for character consistency

### Image 008 - (Additional Reference 3)
- **URL**: `https://github.com/user-attachments/assets/08d05ca2-b65a-4b24-b17e-6bbab9ed483e`
- **Filename**: `diao-chan-008-reference.jpg`
- **Description**: Additional reference material
- **Usage**: Supplementary reference for character consistency

### Image 009 - (Additional Reference 4)
- **URL**: `https://github.com/user-attachments/assets/594f25a4-8e9c-4f8d-bc59-d7c32df2c156`
- **Filename**: `diao-chan-009-reference.jpg`
- **Description**: Additional reference material
- **Usage**: Supplementary reference for character consistency

### Image 010 - (Additional Reference 5)
- **URL**: `https://github.com/user-attachments/assets/07912207-4d9c-4656-bac4-ce1f0f871891`
- **Filename**: `diao-chan-010-reference.jpg`
- **Description**: Additional reference material
- **Usage**: Supplementary reference for character consistency

## Character Visual Identity

### Core Characteristics
- **Gender**: Female
- **Archetype**: Legendary beauty, elegant warrior
- **Primary Colors**: Purple, pink, jade green
- **Secondary Colors**: Gold trim, silver accents
- **Signature Style**: Flowing robes with ornate embroidery

### Visual Traits
- **Hair**: Long black hair with elaborate ornaments and pins
- **Eyes**: Sharp, expressive eyes (varies between gentle and fierce)
- **Outfit**: Elaborate robes with flowing sleeves and layered fabrics
- **Accessories**: Ornate hairpins, ribbons, jade ornaments
- **Weapon**: Chain whip or ribbon weapon (varies by depiction)

### Art Style Notes
- Based on Romance of Three Kingdoms / Dynasty Warriors aesthetic
- Semi-realistic anime style with painterly quality
- Dramatic flowing fabrics and dynamic poses
- Rich color gradients and luminous lighting
- Traditional Chinese period costume elements

## Usage Instructions

### For Visual Placeholder
1. Copy the primary reference image (001) to:
   - `frontend/public/assets/characters/portraits/diao-chan.jpg` (for UI display)
   - `frontend/public/assets/characters/thumbnails/diao-chan-thumb.jpg` (scaled to 256x384)

### For ComfyUI Reference
1. Copy all images to: `tools/comfyui/reference_images/diao-chan/`
2. Use with IP-Adapter workflows for style consistency
3. Reference in character generation prompts

### For LoRA Training
1. Copy selected images (recommend 001, 003, 004, 005) to: `models/loras/training-data/diao-chan/`
2. Prepare captions for each image describing visual features
3. Follow LoRA training pipeline in `models/loras/README.md`

### For Character Sheet Generation
1. Use primary portrait (001 or 004) as face reference
2. Extract facial features using face_swap workflow
3. Apply to generated character sheets for consistency

## Related Files
- Character manifest entry: `manifests/wiki_characters.json` (see diao-chan entry)
- ComfyUI workflows: `tools/comfyui/workflows/wiki_char_*.json`
- LoRA training config: `models/loras/training_configs/diao-chan_lora.yaml`

## Copyright Notice
These images are reference material from Dynasty Warriors / Romance of Three Kingdoms series by KOEI TECMO.
They are used for reference and inspiration purposes only. Generated assets should be original creations
inspired by the visual style, not direct copies.
