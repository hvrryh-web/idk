# GM Control Quick Reference

## CLI Commands Cheat Sheet

### Start Generation
```bash
./tools/gm_control.py start \
  --characters npc-diao-chan,npc-lu-bu \
  --types portrait,fullbody \
  --watch
```

### Batch from Manifest
```bash
./tools/gm_control.py batch \
  --manifest manifests/diao-chan-lu-bu.json \
  --parallel 2 \
  --watch
```

### Check Status
```bash
./tools/gm_control.py status <session_id> --jobs
```

### List All Sessions
```bash
./tools/gm_control.py list
```

### Control Operations
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

## API Endpoints Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/gm/art-generation/start` | Start new generation |
| POST | `/api/v1/gm/art-generation/batch` | Start batch generation |
| POST | `/api/v1/gm/art-generation/control` | Control session (pause/resume/stop) |
| GET | `/api/v1/gm/art-generation/status/{id}` | Get session status |
| GET | `/api/v1/gm/art-generation/jobs/{id}` | Get job details |
| GET | `/api/v1/gm/art-generation/sessions` | List all sessions |
| DELETE | `/api/v1/gm/art-generation/session/{id}` | Delete session |

## Generation Types

- `portrait` - Character portrait (512x768)
- `fullbody` - Full-body render (1024x1536)
- `expressions` - Expression sheet (6-panel)
- `poses_sheet` - Poses grid (9 poses)
- `outfits_sheet` - Outfits grid (6 outfits)
- `character_sheet` - Complete sheet (composite)

## Session Statuses

- `starting` - Initializing session
- `running` - Actively generating
- `paused` - Paused (current jobs finish)
- `stopped` - Stopped (jobs cancelled)
- `completed` - All jobs finished
- `error` - Error occurred

## Common Workflows

### 1. Quick Single Character Generation
```bash
./tools/gm_control.py start \
  --characters npc-diao-chan \
  --types portrait \
  --watch
```

### 2. Multi-Type Generation
```bash
./tools/gm_control.py start \
  --characters npc-diao-chan,npc-lu-bu \
  --types portrait,fullbody,expressions \
  --parallel 2 \
  --watch
```

### 3. Batch All Characters
```bash
./tools/gm_control.py batch \
  --manifest manifests/all-characters.json \
  --types portrait,fullbody \
  --parallel 3
```

### 4. Monitor Running Session
```bash
# Get session ID from initial start command
./tools/gm_control.py status abc123def --jobs

# Or list all to find it
./tools/gm_control.py list
```

## Troubleshooting Quick Checks

### Backend Not Responding
```bash
# Check if backend is running
curl http://localhost:8000/docs

# Start backend if needed
cd backend && python -m uvicorn app.main:app --reload
```

### ComfyUI Not Available
```bash
# Check ComfyUI status
curl http://localhost:8188/system_stats

# Start ComfyUI if needed
cd /path/to/ComfyUI && python main.py
```

### Session Stuck
```bash
# Stop the session
./tools/gm_control.py stop <session_id>

# Delete it
./tools/gm_control.py delete <session_id>

# Check backend logs
tail -f backend/logs/app.log
```

## File Locations

### Backend
- API Routes: `backend/app/api/routes/gm_control.py`
- Main App: `backend/app/main.py`

### Frontend
- Component: `frontend/src/pages/GMControlPanel.tsx`
- Styles: `frontend/src/pages/GMControlPanel.css`

### Tools
- CLI Script: `tools/gm_control.py`

### Documentation
- Full Guide: `docs/GM_CONTROL_PANEL.md`
- This Quick Ref: `docs/GM_CONTROL_QUICK_REF.md`

## Environment Variables

```bash
# Backend API URL (for CLI)
export GM_API_URL="http://localhost:8000"

# ComfyUI URL (for backend)
export COMFYUI_URL="http://localhost:8188"
```

## Tips

1. **Use --watch** for immediate feedback on generation progress
2. **Parallel jobs** should match available GPU memory (2-4 typical)
3. **Check manifest** files before batch operations
4. **Delete completed** sessions regularly to keep tracking clean
5. **Monitor logs** when troubleshooting failed generations
