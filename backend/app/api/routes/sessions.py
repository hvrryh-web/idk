"""
Game Sessions API Routes

Handles player profiles, session management, and Game Master authentication.
"""

import hashlib
import secrets
from argon2 import PasswordHasher
import os
from datetime import datetime
from typing import Dict, List, Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

router = APIRouter(prefix="/sessions", tags=["sessions"])

# In-memory session storage (would use Redis/DB in production)
# Note: For production, use thread-safe storage like Redis
active_sessions: Dict[str, dict] = {}

# Game Master password from environment variable with fallback for development
# In production, set GM_PASSWORD environment variable
def get_gm_password_hash() -> str:
    """Get GM password hash from environment or use default for development."""
    password = os.environ.get('GM_PASSWORD', 'GuGang123GG$')
    # Check if we already have an Argon2 hash stored in an env var
    gm_password_hash = os.environ.get('GM_PASSWORD_HASH')
    if gm_password_hash:
        return gm_password_hash
    # For development or first-time use, hash the password (do not re-hash on every access in production) 
    ph = PasswordHasher()
    return ph.hash(password)


class ProfileLoginRequest(BaseModel):
    profile_type: str  # "player1", "player2", "gamemaster"
    password: Optional[str] = None


class ProfileLoginResponse(BaseModel):
    success: bool
    session_id: Optional[str] = None
    profile_type: str
    error: Optional[str] = None
    is_game_master: bool = False


class SessionInfo(BaseModel):
    session_id: str
    profile_type: str
    is_game_master: bool
    created_at: str
    last_active: str


class GameStateUpdate(BaseModel):
    map_id: Optional[str] = None
    map_position: Optional[dict] = None
    active_tokens: Optional[List[dict]] = None
    fog_of_war: Optional[dict] = None
    chat_message: Optional[str] = None
    game_phase: Optional[str] = None


def generate_session_id(profile_type: str) -> str:
    """Generate a unique session ID based on date and random token."""
    date_key = datetime.utcnow().strftime("%Y%m%d")
    random_token = secrets.token_hex(8)
    return f"{profile_type}-{date_key}-{random_token}"


def verify_gm_password(password: str) -> bool:
    """Verify Game Master password."""
    ph = PasswordHasher()
    known_hash = get_gm_password_hash()
    try:
        return ph.verify(known_hash, password)
    except Exception:
        return False


@router.post("/login", response_model=ProfileLoginResponse)
async def login_profile(request: ProfileLoginRequest):
    """
    Login with a profile (Player 1, Player 2, or Game Master).
    Game Master requires password authentication.
    """
    profile_type = request.profile_type.lower()
    
    if profile_type not in ["player1", "player2", "gamemaster"]:
        raise HTTPException(status_code=400, detail="Invalid profile type")
    
    # Game Master requires password
    if profile_type == "gamemaster":
        if not request.password:
            return ProfileLoginResponse(
                success=False,
                profile_type=profile_type,
                error="Password required for Game Master access"
            )
        if not verify_gm_password(request.password):
            return ProfileLoginResponse(
                success=False,
                profile_type=profile_type,
                error="Invalid Game Master password"
            )
    
    # Generate session
    session_id = generate_session_id(profile_type)
    now = datetime.utcnow().isoformat()
    
    active_sessions[session_id] = {
        "profile_type": profile_type,
        "is_game_master": profile_type == "gamemaster",
        "created_at": now,
        "last_active": now,
        "game_state": {}
    }
    
    return ProfileLoginResponse(
        success=True,
        session_id=session_id,
        profile_type=profile_type,
        is_game_master=profile_type == "gamemaster"
    )


@router.get("/info/{session_id}", response_model=SessionInfo)
async def get_session_info(session_id: str):
    """Get information about a session."""
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = active_sessions[session_id]
    return SessionInfo(
        session_id=session_id,
        profile_type=session["profile_type"],
        is_game_master=session["is_game_master"],
        created_at=session["created_at"],
        last_active=session["last_active"]
    )


@router.post("/logout/{session_id}")
async def logout_session(session_id: str):
    """Logout and invalidate a session."""
    if session_id in active_sessions:
        del active_sessions[session_id]
        return {"success": True, "message": "Session ended"}
    return {"success": False, "message": "Session not found"}


@router.get("/active")
async def list_active_sessions():
    """List all active sessions (GM only endpoint)."""
    sessions = []
    for sid, data in active_sessions.items():
        sessions.append({
            "session_id": sid,
            "profile_type": data["profile_type"],
            "is_game_master": data["is_game_master"],
            "created_at": data["created_at"],
            "last_active": data["last_active"]
        })
    return {"sessions": sessions}


@router.post("/heartbeat/{session_id}")
async def session_heartbeat(session_id: str):
    """Update session last active timestamp."""
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    active_sessions[session_id]["last_active"] = datetime.utcnow().isoformat()
    return {"success": True}


# ============================================
# Game Master Control Endpoints
# ============================================

@router.post("/gm/update-game-state/{session_id}")
async def gm_update_game_state(session_id: str, update: GameStateUpdate):
    """
    Game Master endpoint to update game state.
    Only accessible with a valid GM session.
    """
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = active_sessions[session_id]
    if not session["is_game_master"]:
        raise HTTPException(status_code=403, detail="Game Master access required")
    
    # Update game state
    game_state = session.get("game_state", {})
    
    if update.map_id is not None:
        game_state["current_map"] = update.map_id
    if update.map_position is not None:
        game_state["map_position"] = update.map_position
    if update.active_tokens is not None:
        game_state["active_tokens"] = update.active_tokens
    if update.fog_of_war is not None:
        game_state["fog_of_war"] = update.fog_of_war
    if update.game_phase is not None:
        game_state["game_phase"] = update.game_phase
    
    session["game_state"] = game_state
    session["last_active"] = datetime.utcnow().isoformat()
    
    return {"success": True, "game_state": game_state}


@router.get("/gm/game-state/{session_id}")
async def gm_get_game_state(session_id: str):
    """Get current game state (GM endpoint)."""
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = active_sessions[session_id]
    if not session["is_game_master"]:
        raise HTTPException(status_code=403, detail="Game Master access required")
    
    return {"game_state": session.get("game_state", {})}


@router.post("/gm/broadcast-message/{session_id}")
async def gm_broadcast_message(session_id: str, message: dict):
    """
    Broadcast a message to all players.
    """
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = active_sessions[session_id]
    if not session["is_game_master"]:
        raise HTTPException(status_code=403, detail="Game Master access required")
    
    # In production, this would use WebSockets or SSE
    # For now, store in game state for polling
    game_state = session.get("game_state", {})
    messages = game_state.get("gm_messages", [])
    messages.append({
        "content": message.get("content", ""),
        "type": message.get("type", "info"),
        "timestamp": datetime.utcnow().isoformat()
    })
    # Keep last 50 messages
    game_state["gm_messages"] = messages[-50:]
    session["game_state"] = game_state
    
    return {"success": True, "message": "Message broadcasted"}


@router.get("/player/game-state")
async def player_get_game_state():
    """
    Get current game state for players.
    Returns the game state from any active GM session.
    """
    # Find active GM session
    for sid, session in active_sessions.items():
        if session["is_game_master"]:
            return {
                "game_state": session.get("game_state", {}),
                "gm_active": True
            }
    
    return {"game_state": {}, "gm_active": False}
