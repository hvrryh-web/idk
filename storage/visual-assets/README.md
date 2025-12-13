# Visual Assets Storage and Staging System

## Overview

This directory structure provides a managed pipeline for visual assets from user upload through to deployment in the game frontend and ComfyUI workflows.

## Directory Structure

```
storage/
└── visual-assets/
    ├── incoming/          # User uploads land here
    ├── processed/         # Validated and processed assets
    └── archived/          # Historical versions and backups

staging/
└── visual-assets/
    ├── pending/           # Assets queued for deployment
    ├── ready/             # Assets ready for deployment
    └── deployed/          # Record of deployed assets
```

## Workflow

```
User Upload → incoming/ → [validation] → processed/ 
                                            ↓
                                        pending/ → [approval] → ready/ → [deploy] → frontend/
                                                                                      ↓
                                                                                   deployed/
```

## Usage

### 1. User Upload
Users upload visual assets to `storage/visual-assets/incoming/`:

```bash
# Example: Upload character reference images
cp /path/to/diao-chan-*.jpg storage/visual-assets/incoming/
```

### 2. Validation and Processing
Run the asset processor to validate and organize:

```bash
./tools/asset_pipeline_manager.py process
```

This validates assets and moves them to `processed/`.

### 3. Staging
Move processed assets to staging:

```bash
./tools/asset_pipeline_manager.py stage --character diao-chan
```

Assets move to `pending/` for review.

### 4. Approval
Review and approve staged assets:

```bash
./tools/asset_pipeline_manager.py approve --id <asset_id>
```

Approved assets move to `ready/`.

### 5. Deployment
Deploy ready assets to frontend and ComfyUI:

```bash
./tools/asset_pipeline_manager.py deploy --target frontend
./tools/asset_pipeline_manager.py deploy --target comfyui
```

Assets are copied to their final locations and recorded in `deployed/`.

## Asset Types Supported

- **Character References**: Reference images for LoRA training and generation
- **UI Assets**: Icons, buttons, backgrounds, etc.
- **Character Portraits**: Generated or uploaded character art
- **Character Sheets**: Complete character sheet images
- **Fate Cards**: Fate card artwork
- **Environment Art**: Backgrounds and environment images

## Naming Conventions

Assets in storage should follow the naming pattern:
```
{type}-{identifier}-{variant}_{timestamp}.{ext}

Examples:
character-diao-chan-portrait_20241213.jpg
ui-button-primary-hover_20241213.png
fate-card-death-001_20241213.svg
```

## Integration Points

### Frontend
Deployed assets are copied to:
- `frontend/public/assets/characters/`
- `frontend/public/assets/ui/`
- `frontend/public/assets/fate-cards/`

### ComfyUI
Reference assets are copied to:
- `tools/comfyui/reference_images/`
- `models/loras/training-data/`

### Backend
Asset metadata is tracked in:
- Database table: `visual_assets`
- API endpoints: `/api/v1/assets/*`

## Scripts

All asset management scripts are in `tools/`:

- `asset_pipeline_manager.py` - Main asset pipeline controller
- `asset_validator.py` - Validates asset format, size, and naming
- `asset_deployer.py` - Handles deployment to frontend/ComfyUI
- `asset_archiver.py` - Archives old versions

## Security

- Assets are validated before processing
- File size limits enforced (max 10MB per asset)
- Allowed file types: jpg, jpeg, png, svg, webp
- Virus scanning recommended for production
- Access control via backend API

## Monitoring

Asset pipeline status can be monitored via:

```bash
# Check pipeline status
./tools/asset_pipeline_manager.py status

# View recent activity
./tools/asset_pipeline_manager.py log --last 10

# List assets by status
./tools/asset_pipeline_manager.py list --status pending
```

## Backup and Archive

Old versions are automatically archived:
- Archives are kept for 90 days by default
- Configurable retention policy
- Compressed for storage efficiency

## See Also

- `tools/asset_pipeline_manager.py` - Main pipeline script
- `docs/ASSET_PIPELINE.md` - Detailed pipeline documentation
- `backend/app/api/routes/visual_assets.py` - Asset API endpoints
