# Lu Bu Reference Images

This directory contains reference images for the character **Lu Bu** to be used as:
1. Visual placeholders in the application
2. Base references for ComfyUI image generation
3. Training data for LoRA (Low-Rank Adaptation) model creation
4. Reference material for character sheet generation

## Image Inventory

Please download and place the following images from the GitHub issue into this directory:

### Image 001 - Full Body Primary
- **URL**: `https://github.com/user-attachments/assets/e7e00e23-f8d3-4a72-a1f8-1baea51679a2`
- **Filename**: `lu-bu-001-fullbody-primary.jpg`
- **Description**: Full body armored warrior pose
- **Usage**: Primary reference for full-body character generation
- **Style**: Dynasty Warriors / Romance of Three Kingdoms game art style
- **Key Features**: Heavy ornate armor, commanding presence, weapon visible

### Image 002 - Costume Variants Sheet
- **URL**: `https://github.com/user-attachments/assets/ee9c2343-d6f7-46fe-a175-8491b822d3ed`
- **Filename**: `lu-bu-002-costume-variants.jpg`
- **Description**: Multiple costume variations and armor styles
- **Usage**: Reference for armor variety and design elements
- **Contains**: Multiple armor designs showing different variations

### Image 003 - Combat Pose
- **URL**: `https://github.com/user-attachments/assets/bd0dd1d3-ad62-4fc0-b696-a8423d211f93`
- **Filename**: `lu-bu-003-combat-pose.jpg`
- **Description**: Dynamic combat stance with weapon
- **Usage**: Action pose reference for combat scenes
- **Key Features**: Aggressive stance, weapon prominently displayed

### Image 004 - Portrait Detail
- **URL**: `https://github.com/user-attachments/assets/31ae98f9-930e-4ae0-9416-99ada1cc3d86`
- **Filename**: `lu-bu-004-portrait-detail.jpg`
- **Description**: Detailed facial close-up showing armor and features
- **Usage**: Face reference for portrait generation and facial consistency
- **Key Features**: Clear facial features, armor detail, fierce expression

### Image 005 - Standing Reference
- **URL**: `https://github.com/user-attachments/assets/b84c0f2f-fd59-4141-bb27-706f5f2fc71e`
- **Filename**: `lu-bu-005-standing-reference.jpg`
- **Description**: Full standing pose showing complete armor design
- **Usage**: Pose reference for idle/commanding stances

### Image 006 - (Additional Reference 1)
- **URL**: `https://github.com/user-attachments/assets/7260bac4-05fe-43cd-a4db-a2bc88b213ac`
- **Filename**: `lu-bu-006-reference.jpg`
- **Description**: Additional reference material
- **Usage**: Supplementary reference for character consistency

### Image 007 - (Additional Reference 2)
- **URL**: `https://github.com/user-attachments/assets/b53b5017-d4db-41b5-8fa1-60a0b63dddf2`
- **Filename**: `lu-bu-007-reference.jpg`
- **Description**: Additional reference material
- **Usage**: Supplementary reference for character consistency

### Image 008 - (Additional Reference 3)
- **URL**: `https://github.com/user-attachments/assets/24f68dae-bc41-44a1-a63d-ed0290962830`
- **Filename**: `lu-bu-008-reference.jpg`
- **Description**: Additional reference material
- **Usage**: Supplementary reference for character consistency

### Image 009 - (Additional Reference 4)
- **URL**: `https://github.com/user-attachments/assets/4af1e41b-219d-481d-ab5a-8870a48bbe98`
- **Filename**: `lu-bu-009-reference.jpg`
- **Description**: Additional reference material
- **Usage**: Supplementary reference for character consistency

### Image 010 - (Additional Reference 5)
- **URL**: `https://github.com/user-attachments/assets/70b73481-d50f-4783-88fc-4c305bc0d3eb`
- **Filename**: `lu-bu-010-reference.jpg`
- **Description**: Additional reference material
- **Usage**: Supplementary reference for character consistency

## Character Visual Identity

### Core Characteristics
- **Gender**: Male
- **Archetype**: Legendary warrior, unmatched in martial prowess
- **Primary Colors**: Dark steel, black armor, red/crimson accents
- **Secondary Colors**: Gold trim, bronze details
- **Signature Style**: Heavy ornate armor with imposing silhouette

### Visual Traits
- **Hair**: Long dark hair, often tied back or flowing dramatically
- **Eyes**: Fierce, intense gaze conveying power and authority
- **Build**: Tall, muscular, imposing physique
- **Outfit**: Heavy plated armor with elaborate decorations and flowing elements
- **Accessories**: Ornate helmet pieces, armor embellishments, commanding presence items
- **Weapon**: Sky Piercer (Fang Tian Ji) - distinctive halberd with crescent blade

### Art Style Notes
- Based on Romance of Three Kingdoms / Dynasty Warriors aesthetic
- Semi-realistic anime style with dramatic presence
- Heavy armor with intricate detailing
- Powerful, aggressive poses emphasizing strength
- Dark color palette with metallic sheens
- Traditional Chinese military armor elements with fantasy enhancements

## Usage Instructions

### For Visual Placeholder
1. Copy the primary reference image (001) to:
   - `frontend/public/assets/characters/portraits/lu-bu.jpg` (for UI display)
   - `frontend/public/assets/characters/thumbnails/lu-bu-thumb.jpg` (scaled to 256x384)

### For ComfyUI Reference
1. Copy all images to: `tools/comfyui/reference_images/lu-bu/`
2. Use with IP-Adapter workflows for style consistency
3. Reference in character generation prompts

### For LoRA Training
1. Copy selected images (recommend 001, 003, 004, 005) to: `models/loras/training-data/lu-bu/`
2. Prepare captions for each image describing visual features
3. Follow LoRA training pipeline in `models/loras/README.md`

### For Character Sheet Generation
1. Use primary portrait (001 or 004) as face reference
2. Extract facial features using face_swap workflow
3. Apply to generated character sheets for consistency

## Related Files
- Character manifest entry: `manifests/wiki_characters.json` (see lu-bu entry)
- ComfyUI workflows: `tools/comfyui/workflows/wiki_char_*.json`
- LoRA training config: `models/loras/training_configs/lu-bu_lora.yaml`

## Copyright Notice
These images are reference material from Dynasty Warriors / Romance of Three Kingdoms series by KOEI TECMO.
They are used for reference and inspiration purposes only. Generated assets should be original creations
inspired by the visual style, not direct copies.
