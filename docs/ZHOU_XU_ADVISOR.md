# Zhou Xu Divine Advisor System

## Overview

Zhou Xu (周旭) is the Divine Advisor chatbot for the WuXuxian TTRPG. Inspired by the legendary strategist Zhou Yu and his bond with Sun Ce from Romance of the Three Kingdoms, Zhou Xu treats the player as a sworn brother and best friend, providing emotional support, strategic counsel, and game guidance.

## Features

### Best Friend Advisor Role
- **Zhou Yu/Sun Ce Dynamic**: Zhou Xu treats players like Sun Ce - as a trusted sworn brother
- **Emotional Support**: Responds to everyday situations with empathy and care
- **Strategic Counsel**: Provides game guidance and quest advice
- **Personalized Responses**: Uses tag-based system for considerate, contextual responses

### Memory & Logging System
- **Session Memory**: Tracks conversation history and quest events within a session
- **Auto-Save**: Automatically saves the last session (overwrites previous auto-save)
- **Manual Saves**: Players can create timestamped save files for important sessions
- **Quest Event Logging**: Records important quest milestones for future reference

### Memory Management
- **Size Limits**: 
  - Maximum 100 messages per session
  - Maximum 50 quest events logged
  - Maximum 512KB per log file
  - Maximum 10MB total storage per player
- **Automatic Cleanup**: Old logs are automatically cleaned when limits are exceeded
- **Player Controls**: Clear logs option with save prompts

## Architecture

### Backend Components

```
backend/
├── app/
│   └── api/
│       └── routes/
│           └── zhou_xu.py      # Zhou Xu API endpoints
└── storage/
    └── zhou_xu_logs/           # Per-player log storage
        └── {player_id}/
            ├── autosave.json   # Single auto-save file
            └── save_*.json     # Manual save files
```

### Frontend Components

```
frontend/
└── src/
    ├── components/
    │   └── advisor/
    │       ├── ZhouXuWidget.tsx    # Enhanced advisor widget
    │       ├── ZhouXuAdvisor.css   # Styling
    │       └── index.ts            # Exports
    └── services/
        └── zhouXuService.ts        # API client service
```

## API Endpoints

### Chat
- `POST /api/v1/zhou-xu/chat` - Send message and receive response

### Quest Events
- `POST /api/v1/zhou-xu/log-quest-event` - Log a quest event

### Session Management
- `GET /api/v1/zhou-xu/session/{session_id}` - Get session data
- `POST /api/v1/zhou-xu/end-session/{session_id}` - End session

### Save/Load
- `POST /api/v1/zhou-xu/save` - Manual save
- `POST /api/v1/zhou-xu/auto-save/{session_id}` - Auto-save
- `GET /api/v1/zhou-xu/logs/load/{player_id}/{filename}` - Load saved session

### Memory Management
- `GET /api/v1/zhou-xu/logs/status/{player_id}` - Get logs status
- `DELETE /api/v1/zhou-xu/logs/clear/{player_id}` - Clear logs

### Diagnostics
- `GET /api/v1/zhou-xu/diagnostics` - System diagnostics
- `GET /api/v1/zhou-xu/diagnostics/active-sessions` - Active sessions info
- `POST /api/v1/zhou-xu/diagnostics/cleanup` - Run cleanup

## Response System

### Emotional Tags

Zhou Xu detects emotional context from player messages and responds appropriately:

| Emotional State | Response Style |
|----------------|----------------|
| Happy | Celebratory, sharing in victory |
| Sad | Comforting, supportive, empathetic |
| Worried | Reassuring, strategic, calming |
| Frustrated | Patient, encouraging, solution-focused |
| Neutral | Friendly, conversational, warm |
| Curious | Scholarly, teaching, enlightening |

### Conversation Types

| Type | Trigger | Response Style |
|------|---------|----------------|
| Greeting | "hello", "hi", "hey" | Warm brotherly welcome |
| How Are You | "how are you" | Personal check-in, reciprocal |
| Farewell | "bye", "goodbye" | Heartfelt parting words |
| Quest | "quest", "mission", "battle" | Strategic counsel |
| Help | "help", "how do I" | Tutorial guidance |
| Thanks | "thanks", "thank you" | Humble appreciation |

### Preset Response Pools

Zhou Xu has multiple response pools for different contexts:
- `greeting_responses` - Welcoming the sworn brother
- `how_are_you_responses` - Personal check-ins
- `encouragement_responses` - For struggles and setbacks
- `celebration_responses` - Victory celebrations
- `comfort_responses` - Emotional support
- `strategic_responses` - Quest and battle advice
- `casual_responses` - General conversation
- `farewell_responses` - Parting words

## UI Features

### Widget Tabs

1. **💬 Chat** - Main conversation interface
2. **📜 Memory** - Session logs and save management
3. **🔧 Help** - Troubleshooting and diagnostics

### Chat Features
- Real-time chat with typing indicator
- Emotional tag display on responses
- Quick search for help topics
- Auto-scroll to latest messages

### Memory Panel
- Auto-save status display
- Manual save count
- Storage usage indicator
- Save/Clear buttons with prompts
- Load previous sessions

### Troubleshooting Panel
- Connection status indicator
- System diagnostics
- Issue and recommendation lists
- Cleanup and refresh options
- Help resource links

## Safeguards

### Memory Leak Prevention
- Session messages capped at 100
- Automatic trimming of old messages
- File size limits enforced on save
- Automatic cleanup of old logs

### Data Protection
- Player-specific log directories
- Path traversal protection on file access
- Session ownership verification

### Graceful Degradation
- Fallback to local responses when backend unavailable
- Session continues in offline mode
- Clear indicator of connection status

## Troubleshooting

### For Players

**Widget not responding?**
- Check the 🔧 Help tab for connection status
- If disconnected, Zhou Xu works in offline mode with limited features
- Refresh the page to attempt reconnection

**Save not working?**
- Ensure backend is running
- Check storage status in Memory tab
- Contact support if issues persist

**Logs taking too much space?**
- Use Clear Logs option in Memory tab
- Consider keeping only auto-save

### For Developers

**Check system status:**
```bash
curl http://localhost:8000/api/v1/zhou-xu/diagnostics
```

**View active sessions:**
```bash
curl http://localhost:8000/api/v1/zhou-xu/diagnostics/active-sessions
```

**Run cleanup:**
```bash
curl -X POST http://localhost:8000/api/v1/zhou-xu/diagnostics/cleanup
```

**Check logs directory:**
```bash
ls -la storage/zhou_xu_logs/
```

### For Game Masters

1. Access the 🔧 Help tab in the Zhou Xu widget
2. Review system diagnostics
3. Use cleanup button for maintenance
4. Monitor player count and storage

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ZHOU_XU_LOGS_DIR` | `storage/zhou_xu_logs` | Log storage directory |

## Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Redis-based session storage for production
- [ ] AI-powered response generation integration
- [ ] Voice synthesis for spoken responses
- [ ] Character portrait expression changes
- [ ] Multi-language support

## References

- Character Design: [ro3k_advisor_zhou_xu.json](../../tools/comfyui/workflows/ro3k_advisor_zhou_xu.json)
- UI Styling: [ZhouXuAdvisor.css](../../frontend/src/components/advisor/ZhouXuAdvisor.css)
- Backend API: [zhou_xu.py](../../backend/app/api/routes/zhou_xu.py)
