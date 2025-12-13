# Staging Area

This directory contains assets in various stages of the deployment pipeline.

## Directories

### pending/
Assets awaiting review and approval. These have been validated but not yet approved for deployment.

### ready/
Assets approved and ready for deployment. The deployment script pulls from this directory.

### deployed/
Metadata and records of deployed assets for tracking and rollback purposes.

## Workflow Status

Assets progress through stages:
1. **pending** - Awaiting approval
2. **ready** - Approved, awaiting deployment
3. **deployed** - Successfully deployed to target locations

## Commands

```bash
# List pending assets
./tools/asset_pipeline_manager.py list --status pending

# Approve an asset
./tools/asset_pipeline_manager.py approve --id <asset_id>

# Deploy ready assets
./tools/asset_pipeline_manager.py deploy --target all

# Check deployment status
./tools/asset_pipeline_manager.py status
```

## Integration

Deployed assets are automatically copied to:
- Frontend: `frontend/public/assets/`
- ComfyUI: `tools/comfyui/reference_images/`
- LoRA Training: `models/loras/training-data/`

The asset manifest is updated automatically upon deployment.
