# Game Master Control Panel Documentation

## Overview

The Game Master Control Panel provides a centralized interface for managing ComfyUI art generation workflows. It enables remote start/stop control, batch processing, real-time progress monitoring, and session management for character asset generation.

## Components

### Backend API (`backend/app/api/routes/gm_control.py`)
- RESTful API endpoints for generation control
- Session-based tracking of generation jobs
- Support for pause/resume/stop operations
- Batch processing from manifest files
- Real-time status updates

### Frontend Panel (`frontend/src/pages/GMControlPanel.tsx`)
- React-based UI for visual control
- Real-time session monitoring with auto-refresh
- Interactive controls for starting/stopping generation
- Job-level progress tracking
- Batch generation from manifests

### CLI Tool (`tools/gm_control.py`)
- Command-line interface for scriptable control
- Watch mode for real-time progress monitoring
- Suitable for automation and CI/CD pipelines
- Full feature parity with web UI

## Quick Start

### 1. Start the Backend

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### 2. Access the Web UI

Navigate to the Game Master Control Panel in your browser (route needs to be added to frontend router).

### 3. Use the CLI Tool

```bash
# Start generation for specific characters
./tools/gm_control.py start --characters npc-diao-chan,npc-lu-bu --types portrait,fullbody --watch

# Start batch generation from manifest
./tools/gm_control.py batch --manifest manifests/diao-chan-lu-bu.json --parallel 2 --watch

# Check status
./tools/gm_control.py status <session_id> --jobs

# List all active sessions
./tools/gm_control.py list

# Control sessions
./tools/gm_control.py pause <session_id>
./tools/gm_control.py resume <session_id>
./tools/gm_control.py stop <session_id>
```

## API Endpoints

### POST `/api/v1/gm/art-generation/start`
Start a new art generation session.

**Request Body:**
```json
{
  "character_ids": ["npc-diao-chan", "npc-lu-bu"],
  "generation_types": ["portrait", "fullbody", "expressions"],
  "use_lora": true,
  "priority": "normal",
  "auto_cleanup": true
}
```

**Response:**
```json
{
  "session_id": "abc123...",
  "status": "starting",
  "total_jobs": 6,
  "completed_jobs": 0,
  "failed_jobs": 0,
  "in_progress_jobs": 0,
  "estimated_time_remaining": 360
}
```

### POST `/api/v1/gm/art-generation/batch`
Start batch generation from a character manifest file.

**Request Body:**
```json
{
  "manifest_path": "manifests/diao-chan-lu-bu.json",
  "character_filter": null,
  "generation_types": ["portrait", "fullbody"],
  "parallel_jobs": 2
}
```

**Response:** Same as `/start` endpoint.

### POST `/api/v1/gm/art-generation/control`
Control an active session (pause/resume/stop).

**Request Body:**
```json
{
  "session_id": "abc123...",
  "action": "pause"
}
```

**Actions:**
- `pause` - Pause session (current jobs finish, no new jobs start)
- `resume` - Resume a paused session
- `stop` - Stop session immediately (cancels current jobs)

**Response:**
```json
{
  "status": "paused",
  "message": "Session paused. Current jobs will complete."
}
```

### GET `/api/v1/gm/art-generation/status/{session_id}`
Get current status of a session.

**Response:**
```json
{
  "session_id": "abc123...",
  "status": "running",
  "total_jobs": 10,
  "completed_jobs": 5,
  "failed_jobs": 0,
  "in_progress_jobs": 2,
  "estimated_time_remaining": 300
}
```

### GET `/api/v1/gm/art-generation/jobs/{session_id}`
Get detailed information about all jobs in a session.

**Response:**
```json
[
  {
    "job_id": "npc-diao-chan_portrait",
    "character_id": "npc-diao-chan",
    "generation_type": "portrait",
    "status": "completed",
    "progress_percent": 100.0,
    "error_message": null
  },
  {
    "job_id": "npc-lu-bu_portrait",
    "character_id": "npc-lu-bu",
    "generation_type": "portrait",
    "status": "running",
    "progress_percent": 45.0,
    "error_message": null
  }
]
```

### GET `/api/v1/gm/art-generation/sessions`
List all active generation sessions.

**Response:** Array of session status objects.

### DELETE `/api/v1/gm/art-generation/session/{session_id}`
Delete a completed or stopped session from tracking.

**Response:**
```json
{
  "status": "deleted",
  "message": "Session abc123... deleted"
}
```

## Generation Types

The following generation types are supported:

- **portrait** - Character portrait (512x768)
- **fullbody** - Full-body render (1024x1536)
- **expressions** - Expression sheet (6-panel grid)
- **poses_sheet** - Poses sheet (3x3 grid, 9 poses)
- **outfits_sheet** - Outfits sheet (2x3 grid, 6 outfits)
- **character_sheet** - Complete character sheet (composite)

## Session Status Flow

```
starting → running → completed
              ↓           ↑
            paused -------┘
              ↓
            stopped
              ↓
            error
```

## CLI Tool Usage

### Installation

The CLI tool requires Python 3.7+ and the `requests` library:

```bash
pip install requests
```

### Commands

#### Start Generation

```bash
./tools/gm_control.py start \
  --characters npc-diao-chan,npc-lu-bu \
  --types portrait,fullbody \
  --use-lora \
  --priority normal \
  --watch
```

**Options:**
- `--characters` - Comma-separated character IDs (required)
- `--types` - Comma-separated generation types (default: portrait)
- `--use-lora` - Use character-specific LoRAs (default: true)
- `--priority` - Priority level: low, normal, high (default: normal)
- `--watch` - Watch progress after starting

#### Batch Generation

```bash
./tools/gm_control.py batch \
  --manifest manifests/diao-chan-lu-bu.json \
  --types portrait,fullbody,expressions \
  --filter npc-diao-chan \
  --parallel 2 \
  --watch
```

**Options:**
- `--manifest` - Path to manifest JSON file (required)
- `--types` - Generation types (default: portrait)
- `--filter` - Comma-separated character IDs to filter (optional)
- `--parallel` - Number of parallel jobs (default: 1, max: 4)
- `--watch` - Watch progress after starting

#### Check Status

```bash
./tools/gm_control.py status <session_id> --jobs
```

**Options:**
- `--jobs` - Show detailed job information

#### List Sessions

```bash
./tools/gm_control.py list
```

Shows all active sessions with their current status.

#### Control Sessions

```bash
# Pause
./tools/gm_control.py pause <session_id>

# Resume
./tools/gm_control.py resume <session_id>

# Stop
./tools/gm_control.py stop <session_id>

# Delete
./tools/gm_control.py delete <session_id>
```

#### View Jobs

```bash
./tools/gm_control.py jobs <session_id>
```

Shows detailed job information for a session.

## Frontend Integration

### Adding GM Control Panel to Navigation

Add the GM Control Panel route to your frontend router:

```typescript
// frontend/src/App.tsx or your router configuration

import GMControlPanel from './pages/GMControlPanel';

// Add route
<Route path="/gm-control" element={<GMControlPanel />} />

// Add navigation link
<Link to="/gm-control">🎮 GM Control</Link>
```

### Component Features

- **Auto-refresh**: Sessions and jobs refresh every 2 seconds
- **Visual Status**: Color-coded status badges and progress bars
- **Interactive Controls**: Click sessions to view details, use control buttons
- **Real-time Updates**: Progress tracking updates automatically
- **Error Handling**: Displays errors with dismissible banners

## Workflow Examples

### Example 1: Generate Assets for New Characters

```bash
# 1. Ensure characters have trained LoRAs
ls models/loras/diao-chan_v1.safetensors
ls models/loras/lu-bu_v1.safetensors

# 2. Start generation for multiple types
./tools/gm_control.py start \
  --characters npc-diao-chan,npc-lu-bu \
  --types portrait,fullbody,expressions,poses_sheet \
  --watch

# 3. Monitor progress
# (--watch will show real-time updates)

# 4. Once complete, assets will be in:
# - wiki_assets/characters/npc-diao-chan/
# - wiki_assets/characters/npc-lu-bu/
```

### Example 2: Batch Generation from Manifest

```bash
# 1. Create or update manifest
# Edit manifests/diao-chan-lu-bu.json

# 2. Start batch generation with parallel processing
./tools/gm_control.py batch \
  --manifest manifests/diao-chan-lu-bu.json \
  --types portrait,fullbody \
  --parallel 2 \
  --watch

# 3. Generation runs in background
# Each character is processed with configured seeds and settings
```

### Example 3: Pause and Resume Long-Running Job

```bash
# 1. Start a large batch
./tools/gm_control.py batch \
  --manifest manifests/all-characters.json \
  --types character_sheet

# 2. Get session ID from output
# Session ID: def456...

# 3. Pause if needed (e.g., for maintenance)
./tools/gm_control.py pause def456...

# 4. Resume later
./tools/gm_control.py resume def456...

# 5. Check final status
./tools/gm_control.py status def456... --jobs
```

## Integration with Character Workflow

The GM Control Panel integrates with the character asset pipeline:

```
1. Reference Images (manual)
   └─> frontend/public/assets/characters/reference/{character}/

2. LoRA Training (manual or automated)
   └─> models/loras/{character}_v1.safetensors

3. GM Control Panel Generation (automated)
   ├─> Wiki Art Generation
   │   └─> wiki_assets/characters/{char_id}/
   ├─> Character Sheets
   │   └─> character_sheets/{char_id}/
   └─> UI Assets
       └─> frontend/public/assets/characters/{type}/

4. Asset Manifest Update (manual)
   └─> frontend/public/assets/characters/asset_manifest.json
```

## Best Practices

### Performance

- **Parallel Jobs**: Use 2-4 parallel jobs for faster batch processing (GPU dependent)
- **Priority**: Use priority levels to manage queue when multiple sessions are active
- **Auto-cleanup**: Enable auto-cleanup to remove intermediate files

### Monitoring

- **Watch Mode**: Use `--watch` flag for long-running jobs to see real-time progress
- **Regular Checks**: For background jobs, check status periodically
- **Error Handling**: Review failed jobs to identify issues with prompts or resources

### Organization

- **Manifest Files**: Use descriptive manifest filenames for different character sets
- **Session Management**: Delete completed sessions to keep tracking clean
- **Output Verification**: Check generated assets for quality before updating manifests

## Troubleshooting

### Session Not Starting

**Symptoms**: Session stays in "starting" status

**Solutions**:
- Check ComfyUI server is running: `curl http://localhost:8188/system_stats`
- Verify backend logs for errors
- Ensure manifest file exists and is valid JSON

### Jobs Failing

**Symptoms**: Jobs marked as "failed" with error messages

**Solutions**:
- Check ComfyUI logs for generation errors
- Verify LoRA files exist if `use_lora` is true
- Ensure sufficient GPU memory
- Review prompts in manifest for issues

### Slow Generation

**Symptoms**: Jobs taking longer than expected

**Solutions**:
- Check GPU utilization
- Reduce parallel jobs if GPU memory is limited
- Verify ComfyUI checkpoint model is loaded
- Consider lowering generation quality settings temporarily

### Cannot Connect to API

**Symptoms**: CLI or frontend shows connection errors

**Solutions**:
- Verify backend is running on port 8000
- Check CORS settings in backend allow frontend origin
- Use `--url` flag in CLI to specify correct backend URL
- Check firewall settings if accessing remotely

## Security Considerations

- **Access Control**: GM Control Panel should be restricted to authorized users
- **Rate Limiting**: Consider implementing rate limits for API endpoints
- **Resource Limits**: Monitor GPU and disk usage to prevent resource exhaustion
- **Input Validation**: Manifest files are validated; ensure they come from trusted sources

## Future Enhancements

- [ ] WebSocket support for real-time progress streaming
- [ ] Queue management with prioritization
- [ ] Resource usage monitoring (GPU, disk space)
- [ ] Generation templates and presets
- [ ] Automatic retry on failure
- [ ] Email/webhook notifications on completion
- [ ] Integration with wiki/codex auto-update
- [ ] Preview thumbnails in job listing
- [ ] Cost tracking and budgeting (for cloud-based ComfyUI)

## See Also

- `tools/comfyui/README.md` - ComfyUI setup and configuration
- `docs/wiki_art_pipeline.md` - Wiki character art generation details
- `docs/DIAO_CHAN_LU_BU_ASSET_INTEGRATION.md` - Character asset integration guide
- `manifests/diao-chan-lu-bu.json` - Example character manifest

## Support

For issues or questions:
1. Check backend logs in `logs/` directory
2. Review ComfyUI logs for generation errors
3. Verify all dependencies are installed
4. Check the troubleshooting section above
5. Create an issue in the repository with session ID and error details
