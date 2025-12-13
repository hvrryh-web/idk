# Visual Asset Generation Roadmap

## Executive Summary

This document outlines the project plan for automating visual image generation for the WuXuxian TTRPG using ComfyUI. The goal is to create a fully automated pipeline that generates character portraits, UI assets, and scene backgrounds on demand.

## Current State Assessment

### Existing Infrastructure

| Component | Status | Location |
|-----------|--------|----------|
| ComfyUI Docker Service | ✅ Configured | `docker-compose.yml` |
| Backend Client | ✅ Implemented | `backend/app/services/comfyui_client.py` |
| Workflow Templates | ✅ Available | `tools/comfyui/workflows/` |
| Asset Spec | ✅ Defined | `tools/comfyui/asset_spec.yaml` |
| Frontend Integration | ⚠️ Partial | `frontend/src/components/CharacterGenerator/` |
| Automation Scripts | ⚠️ Partial | `tools/comfyui/generate_assets.ts` |

### Missing Assets

Based on the asset audit, the following assets are needed:

#### Character Assets (Priority: HIGH)
- Player character portraits (multiple poses/expressions)
- NPC bust images (faction leaders, merchants, etc.)
- Enemy sprites (cultivators, beasts, demons)
- Boss character sheets

#### UI Assets (Priority: MEDIUM)
- Button states (normal, hover, pressed, disabled)
- Panel backgrounds (9-slice capable)
- Icon sets (navigation, stats, actions, status)
- HUD elements (health bars, energy meters)

#### Scene Assets (Priority: MEDIUM)
- City backgrounds (multiple districts)
- Battle backgrounds (terrain types)
- Map tiles and markers
- Weather/atmosphere overlays

## Automation Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Asset Generation Pipeline                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Trigger   │───►│   Queue     │───►│   ComfyUI   │───►│   Storage   │  │
│  │  (API/CLI)  │    │  (Redis)    │    │  (Docker)   │    │  (Assets)   │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│        │                  │                  │                  │           │
│        ▼                  ▼                  ▼                  ▼           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Config    │    │   Monitor   │    │   Post-     │    │   Manifest  │  │
│  │  (YAML)     │    │  (Progress) │    │  Process    │    │   Update    │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Implementation Phases

### Phase 1: Foundation (Week 1-2)

#### 1.1 ComfyUI Service Hardening
- [ ] Add health checks to docker-compose.yml
- [ ] Implement automatic restart policies
- [ ] Configure GPU detection with CPU fallback
- [ ] Set up model volume management

#### 1.2 Database Schema
```sql
-- Asset inventory table
CREATE TABLE asset_inventory (
    id UUID PRIMARY KEY,
    asset_type VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    file_path VARCHAR(500) NOT NULL,
    content_hash VARCHAR(64) UNIQUE,
    generation_params JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Generation queue
CREATE TABLE generation_queue (
    id UUID PRIMARY KEY,
    job_type VARCHAR(50) NOT NULL,
    job_params JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    attempts INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.3 Backend Services
- [ ] Implement persistent job queue (Redis or PostgreSQL)
- [ ] Add concurrent job limits (max 3 simultaneous)
- [ ] Create asset cleanup service (TTL-based)
- [ ] Build progress WebSocket notifications

### Phase 2: Character Generation (Week 3-4)

#### 2.1 7-Layer Character Pipeline
Implement the full character generation workflow:

1. **Base Sketch** - Rough composition
2. **Line Art** - ControlNet refinement
3. **Base Colors** - Flat color blocking
4. **Shading** - Light and shadows
5. **Details** - Fine enhancement
6. **Effects** - Qi auras and visual effects
7. **Final Render** - Polish and export

#### 2.2 Face Consistency
- [ ] Integrate ReActor for face swapping
- [ ] Build face embedding storage
- [ ] Create face extraction endpoint

#### 2.3 Pose Sheets
- [ ] Generate 9-pose sheets (3x3 grid)
- [ ] Standard poses: idle, combat, casting, commanding, injured, maimed, victory, dead, back

### Phase 3: UI Asset Generation (Week 5-6)

#### 3.1 Button Generation
```yaml
button_spec:
  variants:
    - primary
    - secondary
    - gold
    - danger
  states:
    - normal
    - hover
    - pressed
    - disabled
  sizes:
    - small (120x40)
    - medium (160x48)
    - large (200x56)
```

#### 3.2 Panel Generation
- [ ] Create 9-slice capable panels
- [ ] Generate parchment, lacquer, and ink variants
- [ ] Export corner and edge pieces

#### 3.3 Icon Generation
- [ ] Navigation icons (SVG + PNG)
- [ ] Stat icons (essence types)
- [ ] Action icons (combat abilities)
- [ ] Status effect icons

### Phase 4: Scene Backgrounds (Week 7-8)

#### 4.1 City Backgrounds
- [ ] Generate multiple district views
- [ ] Create time-of-day variants (dawn, day, dusk, night)
- [ ] Add weather variations

#### 4.2 Battle Backgrounds
- [ ] Open field terrains
- [ ] Mountain passes
- [ ] Forest clearings
- [ ] Urban streets
- [ ] Palace interiors

#### 4.3 Map Assets
- [ ] Tile-based terrain pieces
- [ ] Building markers
- [ ] Unit tokens

### Phase 5: Automation & CI/CD (Week 9-10)

#### 5.1 CLI Tool
```bash
# Generate all missing assets
npm run generate-assets

# Generate specific category
npm run generate-assets -- --category characters

# Generate single asset
npm run generate-assets -- --asset "hero-portrait-001"

# Check generation status
npm run generate-status
```

#### 5.2 GitHub Actions Integration
```yaml
name: Generate Missing Assets
on:
  schedule:
    - cron: '0 2 * * 0'  # Weekly on Sunday
  workflow_dispatch:

jobs:
  generate:
    runs-on: self-hosted  # Requires GPU runner
    steps:
      - uses: actions/checkout@v4
      - name: Start ComfyUI
        run: docker-compose up -d comfyui
      - name: Generate Assets
        run: npm run generate-assets
      - name: Commit Assets
        run: |
          git add frontend/public/assets/
          git commit -m "chore: auto-generate missing assets"
          git push
```

#### 5.3 Asset Validation
- [ ] Implement size validation
- [ ] Add format checks (WebP, PNG, SVG)
- [ ] Create visual diff comparison
- [ ] Set up quality metrics

## How to Start ComfyUI

### Local Development

```bash
# Start ComfyUI with GPU support
docker-compose --profile gpu up -d comfyui

# Or with CPU-only mode
docker-compose --profile cpu up -d comfyui-cpu

# Check status
curl http://localhost:8188/system_stats

# View logs
docker logs -f wuxuxian-comfyui
```

### Model Setup

```bash
# Run the model setup script
cd tools/comfyui
./setup_models.sh

# This downloads:
# - Stable Diffusion checkpoint
# - ControlNet models
# - ReActor face swap model
```

### First Generation

```bash
# Start the generation script
cd tools/comfyui
npx tsx generate_assets.ts

# Or via npm
npm run generate-assets
```

## API Endpoints

### Generation Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/comfyui/health` | GET | Check ComfyUI status |
| `/api/v1/comfyui/generate/character` | POST | Start character generation |
| `/api/v1/comfyui/generate/poses-sheet` | POST | Generate pose sheet |
| `/api/v1/comfyui/generate/ui-button` | POST | Generate button asset |
| `/api/v1/comfyui/status/{job_id}` | GET | Check job status |
| `/api/v1/comfyui/download/{job_id}` | GET | Download results |

### Example Request

```bash
curl -X POST http://localhost:8000/api/v1/comfyui/generate/character \
  -H "Content-Type: application/json" \
  -d '{
    "character_id": "hero-001",
    "base_prompt": "wuxia cultivator, martial artist, flowing robes",
    "pillar_emphasis": "violence",
    "scl_level": 5
  }'
```

## Resource Requirements

### Hardware
- **GPU**: NVIDIA RTX 3060 or better (8GB+ VRAM recommended)
- **RAM**: 16GB minimum
- **Storage**: 50GB for models + 10GB for outputs

### Software
- Docker with NVIDIA Container Toolkit
- Node.js 18+
- Python 3.11+

## Success Metrics

| Metric | Target |
|--------|--------|
| Character generation time | < 5 minutes |
| UI asset generation time | < 30 seconds |
| Failed generation rate | < 5% |
| Asset quality score | > 85% |
| Storage efficiency | < 500KB avg per asset |

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| GPU unavailable | CPU fallback mode (slower) |
| Generation failures | Retry with different seeds |
| Storage exhaustion | Auto-cleanup of old assets |
| Model corruption | Checksum validation |

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1: Foundation | 2 weeks | DB schema, job queue, cleanup service |
| Phase 2: Characters | 2 weeks | 7-layer pipeline, face consistency |
| Phase 3: UI Assets | 2 weeks | Buttons, panels, icons |
| Phase 4: Scenes | 2 weeks | Backgrounds, map tiles |
| Phase 5: Automation | 2 weeks | CLI tool, CI/CD integration |

**Total Estimated Duration: 10 weeks**

## Next Steps

1. Review and approve this roadmap
2. Set up GPU-enabled development environment
3. Download and configure ComfyUI models
4. Begin Phase 1 implementation
5. Weekly progress reviews

---

**Document Version:** 1.0
**Last Updated:** 2024-12-13
**Authors:** Development Team
