"""
Virtual Table Top (VTT) API Routes

Handles game map synchronization, token management, and real-time game state.

Production Notes:
- Replace in-memory state with Redis or PostgreSQL for persistence
- Add WebSocket support for real-time updates
- Implement session isolation for multiple concurrent games
- Add rate limiting for token operations
"""

from datetime import datetime
from typing import Dict, List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid

router = APIRouter(prefix="/vtt", tags=["vtt"])

# In-memory VTT state
# TODO: Replace with Redis or database for production
# Current limitations:
# - State lost on server restart
# - No horizontal scaling support
# - Single game instance only
vtt_state: Dict[str, dict] = {
    "current_map": None,
    "tokens": {},
    "fog_of_war": {},
    "chat_messages": [],
    "initiative_order": [],
    "game_phase": "exploration",
    "active_effects": []
}


class Token(BaseModel):
    id: Optional[str] = None
    name: str
    type: str  # "player", "npc", "enemy", "object"
    position: dict  # {"x": int, "y": int}
    size: str = "medium"  # "tiny", "small", "medium", "large", "huge"
    image_url: Optional[str] = None
    hp: Optional[int] = None
    max_hp: Optional[int] = None
    conditions: Optional[List[str]] = None
    visible_to_players: bool = True
    owner_session: Optional[str] = None


class MapConfig(BaseModel):
    map_id: str
    name: str
    background_url: Optional[str] = None
    grid_size: int = 50
    width: int = 20
    height: int = 15
    fog_enabled: bool = False


class ChatMessage(BaseModel):
    sender: str
    sender_type: str  # "player", "gm", "system"
    content: str
    message_type: str = "chat"  # "chat", "roll", "action", "narration"
    timestamp: Optional[str] = None


class InitiativeEntry(BaseModel):
    token_id: str
    name: str
    initiative: int
    is_current: bool = False


class FogUpdate(BaseModel):
    revealed_cells: List[dict]  # [{"x": int, "y": int}]
    hidden_cells: Optional[List[dict]] = None


# ============================================
# Map Management
# ============================================

@router.post("/map/set")
async def set_current_map(config: MapConfig):
    """Set the current active map."""
    vtt_state["current_map"] = {
        "map_id": config.map_id,
        "name": config.name,
        "background_url": config.background_url,
        "grid_size": config.grid_size,
        "width": config.width,
        "height": config.height,
        "fog_enabled": config.fog_enabled
    }
    return {"success": True, "map": vtt_state["current_map"]}


@router.get("/map/current")
async def get_current_map():
    """Get the current map configuration."""
    return {"map": vtt_state["current_map"]}


# ============================================
# Token Management
# ============================================

@router.post("/tokens/add")
async def add_token(token: Token):
    """Add a token to the map."""
    token_id = token.id or str(uuid.uuid4())
    vtt_state["tokens"][token_id] = {
        "id": token_id,
        "name": token.name,
        "type": token.type,
        "position": token.position,
        "size": token.size,
        "image_url": token.image_url,
        "hp": token.hp,
        "max_hp": token.max_hp,
        "conditions": token.conditions or [],
        "visible_to_players": token.visible_to_players,
        "owner_session": token.owner_session
    }
    return {"success": True, "token_id": token_id, "token": vtt_state["tokens"][token_id]}


@router.put("/tokens/{token_id}/move")
async def move_token(token_id: str, position: dict):
    """Move a token to a new position."""
    if token_id not in vtt_state["tokens"]:
        raise HTTPException(status_code=404, detail="Token not found")
    
    vtt_state["tokens"][token_id]["position"] = position
    return {"success": True, "token": vtt_state["tokens"][token_id]}


@router.put("/tokens/{token_id}/update")
async def update_token(token_id: str, updates: dict):
    """Update token properties."""
    if token_id not in vtt_state["tokens"]:
        raise HTTPException(status_code=404, detail="Token not found")
    
    token = vtt_state["tokens"][token_id]
    for key, value in updates.items():
        if key in token and key != "id":
            token[key] = value
    
    return {"success": True, "token": token}


@router.delete("/tokens/{token_id}")
async def remove_token(token_id: str):
    """Remove a token from the map."""
    if token_id not in vtt_state["tokens"]:
        raise HTTPException(status_code=404, detail="Token not found")
    
    del vtt_state["tokens"][token_id]
    return {"success": True}


@router.get("/tokens")
async def get_all_tokens(include_hidden: bool = False):
    """Get all tokens on the map."""
    if include_hidden:
        return {"tokens": list(vtt_state["tokens"].values())}
    
    # Filter to only visible tokens for players
    visible = [t for t in vtt_state["tokens"].values() if t["visible_to_players"]]
    return {"tokens": visible}


# ============================================
# Chat System
# ============================================

@router.post("/chat/send")
async def send_chat_message(message: ChatMessage):
    """Send a chat message."""
    msg = {
        "id": str(uuid.uuid4()),
        "sender": message.sender,
        "sender_type": message.sender_type,
        "content": message.content,
        "message_type": message.message_type,
        "timestamp": message.timestamp or datetime.utcnow().isoformat()
    }
    vtt_state["chat_messages"].append(msg)
    
    # Keep last 200 messages
    if len(vtt_state["chat_messages"]) > 200:
        vtt_state["chat_messages"] = vtt_state["chat_messages"][-200:]
    
    return {"success": True, "message": msg}


@router.get("/chat/messages")
async def get_chat_messages(limit: int = 50, since_id: Optional[str] = None):
    """Get chat messages."""
    messages = vtt_state["chat_messages"]
    
    if since_id:
        # Find messages after the given ID
        found_idx = -1
        for i, msg in enumerate(messages):
            if msg["id"] == since_id:
                found_idx = i
                break
        if found_idx >= 0:
            messages = messages[found_idx + 1:]
    
    return {"messages": messages[-limit:]}


@router.delete("/chat/clear")
async def clear_chat():
    """Clear all chat messages (GM only)."""
    vtt_state["chat_messages"] = []
    return {"success": True}


# ============================================
# Initiative Tracker
# ============================================

@router.post("/initiative/set")
async def set_initiative_order(entries: List[InitiativeEntry]):
    """Set the initiative order."""
    vtt_state["initiative_order"] = [
        {
            "token_id": e.token_id,
            "name": e.name,
            "initiative": e.initiative,
            "is_current": e.is_current
        }
        for e in sorted(entries, key=lambda x: x.initiative, reverse=True)
    ]
    return {"success": True, "initiative": vtt_state["initiative_order"]}


@router.post("/initiative/next")
async def next_initiative():
    """Advance to next in initiative order."""
    order = vtt_state["initiative_order"]
    if not order:
        return {"success": False, "error": "No initiative order set"}
    
    current_idx = -1
    for i, entry in enumerate(order):
        if entry["is_current"]:
            entry["is_current"] = False
            current_idx = i
            break
    
    next_idx = (current_idx + 1) % len(order)
    order[next_idx]["is_current"] = True
    
    return {"success": True, "current": order[next_idx], "initiative": order}


@router.get("/initiative")
async def get_initiative():
    """Get current initiative order."""
    return {"initiative": vtt_state["initiative_order"]}


@router.delete("/initiative/clear")
async def clear_initiative():
    """Clear initiative order."""
    vtt_state["initiative_order"] = []
    return {"success": True}


# ============================================
# Fog of War
# ============================================

@router.post("/fog/reveal")
async def reveal_fog(update: FogUpdate):
    """Reveal areas of the map."""
    for cell in update.revealed_cells:
        key = f"{cell['x']},{cell['y']}"
        vtt_state["fog_of_war"][key] = True
    
    if update.hidden_cells:
        for cell in update.hidden_cells:
            key = f"{cell['x']},{cell['y']}"
            vtt_state["fog_of_war"][key] = False
    
    return {"success": True, "revealed_count": len(update.revealed_cells)}


@router.get("/fog")
async def get_fog_state():
    """Get current fog of war state."""
    return {"fog_of_war": vtt_state["fog_of_war"]}


@router.delete("/fog/reset")
async def reset_fog():
    """Reset fog of war (hide all)."""
    vtt_state["fog_of_war"] = {}
    return {"success": True}


# ============================================
# Game Phase
# ============================================

@router.post("/phase/set")
async def set_game_phase(phase: str):
    """Set the current game phase."""
    valid_phases = ["exploration", "combat", "social", "rest", "cutscene"]
    if phase not in valid_phases:
        raise HTTPException(status_code=400, detail=f"Invalid phase. Must be one of: {valid_phases}")
    
    vtt_state["game_phase"] = phase
    
    # Add system message
    vtt_state["chat_messages"].append({
        "id": str(uuid.uuid4()),
        "sender": "System",
        "sender_type": "system",
        "content": f"Game phase changed to: {phase.upper()}",
        "message_type": "action",
        "timestamp": datetime.utcnow().isoformat()
    })
    
    return {"success": True, "phase": phase}


@router.get("/phase")
async def get_game_phase():
    """Get current game phase."""
    return {"phase": vtt_state["game_phase"]}


# ============================================
# Full State Sync
# ============================================

@router.get("/state")
async def get_full_state(include_hidden: bool = False):
    """Get the complete VTT state for synchronization."""
    tokens = list(vtt_state["tokens"].values())
    if not include_hidden:
        tokens = [t for t in tokens if t["visible_to_players"]]
    
    return {
        "map": vtt_state["current_map"],
        "tokens": tokens,
        "fog_of_war": vtt_state["fog_of_war"],
        "chat_messages": vtt_state["chat_messages"][-50:],
        "initiative": vtt_state["initiative_order"],
        "phase": vtt_state["game_phase"]
    }


@router.post("/state/reset")
async def reset_vtt_state():
    """Reset all VTT state (GM only)."""
    global vtt_state
    vtt_state = {
        "current_map": None,
        "tokens": {},
        "fog_of_war": {},
        "chat_messages": [],
        "initiative_order": [],
        "game_phase": "exploration",
        "active_effects": []
    }
    return {"success": True, "message": "VTT state reset"}
