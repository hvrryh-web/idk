"""
Zhou Xu Divine Advisor API Routes

Enhanced chatbot system inspired by Zhou Yu and Sun Ce relationship from ROTK.
Zhou Xu treats the player like Sun Ce - as a trusted best friend and sworn brother.

Features:
- Best friend advisor role with emotional support
- Tag-based response building system
- Session logging for quest events
- Per-player profile logs with memory management
- Auto-save and manual save capabilities
"""

import os
import json
import re
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

router = APIRouter(prefix="/zhou-xu", tags=["zhou-xu-advisor"])

# ============================================
# Configuration Constants
# ============================================

# Memory management limits
MAX_SESSION_MESSAGES = 100  # Maximum messages per session
MAX_CHAT_HISTORY_SIZE = 50  # Chat history entries to keep for context
MAX_QUEST_EVENTS = 50  # Maximum quest events to log
MAX_LOG_FILE_SIZE_KB = 512  # Maximum size of a single log file in KB
MAX_TOTAL_LOGS_MB = 10  # Maximum total log storage per player in MB
AUTO_SAVE_LIMIT = 1  # Only keep last session for auto-save

# Storage paths
# Resolve to absolute path to prevent directory traversal attacks
_DEFAULT_LOGS_DIR = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'storage', 'zhou_xu_logs')
PLAYER_LOGS_DIR = os.path.abspath(os.environ.get('ZHOU_XU_LOGS_DIR', _DEFAULT_LOGS_DIR))

# ============================================
# Response Tag Tables
# ============================================

# Emotional state tags for building considerate responses
EMOTIONAL_TAGS = {
    "happy": ["joyful", "celebratory", "proud", "accomplished", "excited"],
    "sad": ["melancholy", "sympathetic", "comforting", "understanding", "supportive"],
    "worried": ["concerned", "protective", "reassuring", "strategic", "cautious"],
    "frustrated": ["patient", "analytical", "solution-focused", "encouraging", "calm"],
    "neutral": ["friendly", "conversational", "informative", "casual", "warm"],
    "curious": ["scholarly", "teaching", "enlightening", "engaged", "thorough"],
    "grateful": ["humble", "honored", "reciprocal", "sincere", "appreciative"],
    "stressed": ["calming", "grounding", "perspective-giving", "supportive", "practical"],
}

# Conversation type tags
CONVERSATION_TYPES = {
    "greeting": "how_are_you",
    "farewell": "parting",
    "quest_update": "strategic_counsel",
    "emotional_support": "friendship_bond",
    "game_help": "tactical_advice",
    "casual_chat": "brotherly_bond",
    "celebration": "shared_victory",
    "encouragement": "sworn_brother_support",
}

# Zhou Yu/Sun Ce inspired preset responses
PRESET_RESPONSES = {
    # Greetings - treating player like Sun Ce
    "greeting_responses": [
        "Ah, my sworn brother! How does the day find you? I was just reviewing our campaign strategies, but your presence is always the priority.",
        "Brother! Come, sit with me. The affairs of the realm can wait - tell me, how fares your spirit today?",
        "There you are! I've been thinking of you. The strategist in me never rests, but neither does my concern for your wellbeing.",
        "My friend! Your arrival brightens this hall more than any victory could. Speak freely - what weighs on your mind?",
        "Sun Ce... ah, I mean, my friend! Forgive me, you remind me so much of someone I once knew. How may I serve you today?",
    ],
    
    # Emotional support responses
    "how_are_you_responses": [
        "I fare well when you fare well, brother. Our fates are intertwined like the rivers that flow to the sea.",
        "The burdens of strategy weigh on me, but seeing you lifts them all. And you? How does your heart fare?",
        "I am... contemplative today. But let us speak of you - a good strategist knows when to listen.",
        "In truth? I worry for our path, but such worries fade in good company. What troubles you, my friend?",
        "Better now that you're here. A general without his lord is merely a scholar with too many books.",
    ],
    
    # Encouragement for struggles
    "encouragement_responses": [
        "Remember, brother - even Zhou Yu faced setbacks before Chibi. Your moment of triumph awaits.",
        "The river carves the mountain not through force, but through persistence. Stay your course.",
        "I have seen you overcome impossible odds before. This? This is merely another test of your resolve.",
        "When the path seems darkest, that is when the strategist finds the hidden way. I believe in you.",
        "You carry the spirit of a hero. Doubt is natural, but it will not define you - your actions will.",
    ],
    
    # Celebration responses
    "celebration_responses": [
        "HAHA! Victory! This calls for wine and song! You've done it again, brother!",
        "I knew you could do it! When they write of this day, they will speak of your brilliance!",
        "The ancestors smile upon you today! This victory... it reminds me of Hefei, when hope seemed lost!",
        "By the heavens, what a triumph! Come, let me toast to your honor!",
        "You make your advisor proud beyond words. This is why I believe in you, always.",
    ],
    
    # Sad/comforting responses
    "comfort_responses": [
        "Brother... I am here. Whatever weighs upon you, you do not carry it alone.",
        "The path of the hero is often lonely, but not today. Speak your heart - I will listen.",
        "Even the mightiest generals weep. There is no shame in it. I am here, as I always will be.",
        "Your pain is my pain, brother. Let us face this darkness together, as we have faced all challenges.",
        "Take your time. Some wounds need not words, only the presence of those who care.",
    ],
    
    # Quest/strategic counsel
    "strategic_responses": [
        "Hmm, an interesting development. Let me consider the angles... *strokes chin thoughtfully*",
        "This situation requires careful analysis. Tell me more - every detail matters in strategy.",
        "Ah, I see the chess pieces moving. Here is what I advise...",
        "The enemy reveals their hand. Let us discuss how to turn this to our advantage.",
        "A good general adapts. Here are the options I see before us...",
    ],
    
    # Casual conversation
    "casual_responses": [
        "Ha! You know, this reminds me of a story from my youth...",
        "Indeed? How fascinating. Tell me more, brother.",
        "Ah, the simple pleasures of conversation. These moments are precious.",
        "You have such a way with words, my friend. It's one of the things I admire about you.",
        "Yes, yes! I was just thinking the same thing. Great minds, as they say!",
    ],
    
    # Farewell responses
    "farewell_responses": [
        "Until we meet again, brother. May the winds favor your journey.",
        "Go well, and know that my thoughts go with you. We shall speak again soon.",
        "Take care, my friend. The realm needs you - and so do I.",
        "Farewell for now. Remember: you are never truly alone in your struggles.",
        "May fortune guide your steps. Until next time, sworn brother.",
    ],
}

# Keyword detection for emotional/conversation context
KEYWORD_PATTERNS = {
    "greeting": r"\b(hello|hi|hey|greetings?|good\s?(morning|afternoon|evening))\b",
    "how_are_you": r"\b(how\s+are\s+you|how('s|\s+is)\s+(it\s+going|things|life|everything|your\s+day))\b",
    "farewell": r"\b(goodbye|bye|farewell|see\s+you|take\s+care|later|gotta\s+go)\b",
    "thanks": r"\b(thanks?|thank\s+you|grateful|appreciate)\b",
    "sad": r"\b(sad|upset|depressed|down|unhappy|hurt|pain|cry|crying|tears|struggling|hard\s+time)\b",
    "frustrated": r"\b(frustrated|annoyed|angry|mad|stuck|can't|impossible|failing|failed)\b",
    "happy": r"\b(happy|excited|great|wonderful|amazing|victory|won|success|accomplished|did\s+it)\b",
    "worried": r"\b(worried|anxious|scared|nervous|concerned|afraid|fear)\b",
    "quest": r"\b(quest|mission|task|objective|goal|battle|fight|enemy|boss|challenge)\b",
    "help": r"\b(help|how\s+do\s+i|explain|what\s+is|guide|tutorial|confused|don't\s+understand)\b",
}


# ============================================
# Pydantic Models
# ============================================

class ChatMessage(BaseModel):
    content: str
    sender: str = "player"  # "player" or "advisor"
    timestamp: Optional[str] = None
    emotional_tags: Optional[List[str]] = None
    conversation_type: Optional[str] = None


class ChatRequest(BaseModel):
    player_id: str
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    emotional_state: str
    conversation_type: str
    tags_used: List[str]
    session_id: str


class QuestEvent(BaseModel):
    event_type: str  # "started", "completed", "failed", "milestone", "discovery"
    quest_name: str
    description: str
    timestamp: Optional[str] = None
    importance: str = "normal"  # "low", "normal", "high", "critical"


class SessionData(BaseModel):
    session_id: str
    player_id: str
    started_at: str
    messages: List[ChatMessage] = []
    quest_events: List[QuestEvent] = []
    chat_summary: Optional[str] = None


class SaveRequest(BaseModel):
    player_id: str
    session_id: str
    save_name: Optional[str] = None


class LogsStatusResponse(BaseModel):
    player_id: str
    has_auto_save: bool
    manual_saves: List[str]
    total_size_kb: float
    oldest_log: Optional[str]
    newest_log: Optional[str]


class DiagnosticsResponse(BaseModel):
    status: str
    logs_directory: str
    logs_exist: bool
    player_count: int
    total_size_mb: float
    issues: List[str]
    recommendations: List[str]


# ============================================
# In-Memory Session Storage
# ============================================

# Active sessions (in production, use Redis)
active_sessions: Dict[str, SessionData] = {}


# ============================================
# Utility Functions
# ============================================

def get_player_logs_dir(player_id: str) -> str:
    """Get the logs directory for a specific player."""
    safe_player_id = re.sub(r'[^\w\-]', '_', player_id)
    return os.path.join(PLAYER_LOGS_DIR, safe_player_id)


def ensure_player_dir(player_id: str) -> str:
    """Ensure player logs directory exists and return path."""
    player_dir = get_player_logs_dir(player_id)
    os.makedirs(player_dir, exist_ok=True)
    return player_dir


def get_directory_size_mb(directory: str) -> float:
    """Calculate total size of a directory in MB."""
    total_size = 0
    if os.path.exists(directory):
        for dirpath, dirnames, filenames in os.walk(directory):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                total_size += os.path.getsize(fp)
    return total_size / (1024 * 1024)


def detect_emotional_context(message: str) -> tuple:
    """Detect emotional context and conversation type from message."""
    message_lower = message.lower()
    
    # Detect conversation type
    conversation_type = "casual_chat"
    for ctype, pattern in KEYWORD_PATTERNS.items():
        if re.search(pattern, message_lower, re.IGNORECASE):
            if ctype in ["greeting", "how_are_you", "farewell", "thanks", "quest", "help"]:
                conversation_type = ctype
                break
    
    # Detect emotional state
    emotional_state = "neutral"
    for emotion, pattern in [
        ("happy", KEYWORD_PATTERNS["happy"]),
        ("sad", KEYWORD_PATTERNS["sad"]),
        ("frustrated", KEYWORD_PATTERNS["frustrated"]),
        ("worried", KEYWORD_PATTERNS["worried"]),
    ]:
        if re.search(pattern, message_lower, re.IGNORECASE):
            emotional_state = emotion
            break
    
    # Get tags for this emotional state
    tags = EMOTIONAL_TAGS.get(emotional_state, EMOTIONAL_TAGS["neutral"])
    
    return emotional_state, conversation_type, tags


def build_response(message: str, session: SessionData) -> tuple:
    """Build a considerate response using the tag system."""
    emotional_state, conversation_type, tags = detect_emotional_context(message)
    
    # Select appropriate response pool based on context
    if conversation_type == "greeting":
        responses = PRESET_RESPONSES["greeting_responses"]
    elif conversation_type == "how_are_you":
        responses = PRESET_RESPONSES["how_are_you_responses"]
    elif conversation_type == "farewell":
        responses = PRESET_RESPONSES["farewell_responses"]
    elif conversation_type == "thanks":
        responses = PRESET_RESPONSES["celebration_responses"]
    elif conversation_type == "help" or conversation_type == "quest":
        responses = PRESET_RESPONSES["strategic_responses"]
    elif emotional_state == "happy":
        responses = PRESET_RESPONSES["celebration_responses"]
    elif emotional_state in ["sad", "worried"]:
        responses = PRESET_RESPONSES["comfort_responses"]
    elif emotional_state == "frustrated":
        responses = PRESET_RESPONSES["encouragement_responses"]
    else:
        responses = PRESET_RESPONSES["casual_responses"]
    
    # Pick a random response from the pool
    response = random.choice(responses)
    
    # Add personalization based on chat history (if available)
    if len(session.messages) > 5:
        # Add continuity references for longer conversations
        continuity_additions = [
            " As I mentioned earlier...",
            " Speaking of what we discussed...",
            " Following up on our conversation...",
        ]
        if random.random() < 0.2:  # 20% chance to add continuity
            response = response + random.choice(continuity_additions)
    
    return response, emotional_state, conversation_type, list(tags[:3])


def generate_session_id(player_id: str) -> str:
    """Generate a unique session ID."""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    random_suffix = random.randint(1000, 9999)
    return f"zx-{player_id[:8]}-{timestamp}-{random_suffix}"


def save_session_to_file(session: SessionData, is_auto_save: bool = False) -> str:
    """Save session data to a JSON file."""
    player_dir = ensure_player_dir(session.player_id)
    
    if is_auto_save:
        # Auto-save overwrites the single auto-save file
        filename = "autosave.json"
    else:
        # Manual saves are timestamped
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        filename = f"save_{timestamp}.json"
    
    filepath = os.path.join(player_dir, filename)
    
    # Check message count first (cheaper than JSON serialization)
    session_dict = session.model_dump()
    needs_trim = len(session_dict.get("messages", [])) > MAX_SESSION_MESSAGES
    
    if needs_trim:
        # Trim messages before serialization to avoid double-serialization
        original_count = len(session_dict["messages"])
        session_dict["messages"] = session_dict["messages"][-MAX_SESSION_MESSAGES//2:]
        session_dict["chat_summary"] = f"Session trimmed due to size limits. Original had {original_count} messages."
    
    session_json = json.dumps(session_dict, indent=2)
    
    # Final size check after trimming
    if len(session_json) > MAX_LOG_FILE_SIZE_KB * 1024:
        # Further trim if still too large
        session_dict["messages"] = session_dict["messages"][-MAX_SESSION_MESSAGES//4:]
        session_json = json.dumps(session_dict, indent=2)
    
    with open(filepath, 'w') as f:
        f.write(session_json)
    
    return filename


def load_session_from_file(player_id: str, filename: str) -> Optional[SessionData]:
    """Load session data from a file."""
    player_dir = get_player_logs_dir(player_id)
    filepath = os.path.join(player_dir, filename)
    
    if not os.path.exists(filepath):
        return None
    
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
        return SessionData(**data)
    except Exception:
        return None


def cleanup_old_logs(player_id: str):
    """Clean up old logs to manage storage."""
    player_dir = get_player_logs_dir(player_id)
    if not os.path.exists(player_dir):
        return
    
    # Check total size
    current_size_mb = get_directory_size_mb(player_dir)
    
    if current_size_mb > MAX_TOTAL_LOGS_MB:
        # Get all save files (exclude autosave)
        save_files = []
        for f in os.listdir(player_dir):
            if f.startswith("save_") and f.endswith(".json"):
                filepath = os.path.join(player_dir, f)
                mtime = os.path.getmtime(filepath)
                save_files.append((f, mtime))
        
        # Sort by modification time (oldest first)
        save_files.sort(key=lambda x: x[1])
        
        # Remove oldest files until under limit
        for filename, _ in save_files:
            if get_directory_size_mb(player_dir) <= MAX_TOTAL_LOGS_MB * 0.8:
                break
            filepath = os.path.join(player_dir, filename)
            os.remove(filepath)


# ============================================
# API Endpoints
# ============================================

@router.post("/chat", response_model=ChatResponse)
async def chat_with_zhou_xu(request: ChatRequest):
    """
    Send a message to Zhou Xu and receive a thoughtful response.
    Zhou Xu acts as a best friend advisor, treating the player like Sun Ce.
    """
    player_id = request.player_id
    message = request.message.strip()
    
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    # Get or create session
    session_id = request.session_id
    if session_id and session_id in active_sessions:
        session = active_sessions[session_id]
    else:
        session_id = generate_session_id(player_id)
        session = SessionData(
            session_id=session_id,
            player_id=player_id,
            started_at=datetime.utcnow().isoformat(),
            messages=[],
            quest_events=[]
        )
        active_sessions[session_id] = session
    
    # Add player message to history
    player_message = ChatMessage(
        content=message,
        sender="player",
        timestamp=datetime.utcnow().isoformat()
    )
    session.messages.append(player_message)
    
    # Build response using tag system
    response_text, emotional_state, conv_type, tags = build_response(message, session)
    
    # Add advisor response to history
    advisor_message = ChatMessage(
        content=response_text,
        sender="advisor",
        timestamp=datetime.utcnow().isoformat(),
        emotional_tags=tags,
        conversation_type=conv_type
    )
    session.messages.append(advisor_message)
    
    # Enforce message limits
    if len(session.messages) > MAX_SESSION_MESSAGES:
        # Keep the most recent messages
        session.messages = session.messages[-MAX_SESSION_MESSAGES:]
    
    return ChatResponse(
        response=response_text,
        emotional_state=emotional_state,
        conversation_type=conv_type,
        tags_used=tags,
        session_id=session_id
    )


@router.post("/log-quest-event")
async def log_quest_event(player_id: str, event: QuestEvent):
    """
    Log an important quest event for session memory.
    Zhou Xu can reference these events in future conversations.
    """
    # Find active session for player
    session = None
    for sid, s in active_sessions.items():
        if s.player_id == player_id:
            session = s
            break
    
    if not session:
        raise HTTPException(status_code=404, detail="No active session found for player")
    
    # Add timestamp if not provided
    if not event.timestamp:
        event.timestamp = datetime.utcnow().isoformat()
    
    session.quest_events.append(event)
    
    # Enforce limits
    if len(session.quest_events) > MAX_QUEST_EVENTS:
        session.quest_events = session.quest_events[-MAX_QUEST_EVENTS:]
    
    return {"success": True, "event_logged": event.event_type, "quest": event.quest_name}


@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """Get current session data including chat history and quest events."""
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = active_sessions[session_id]
    return {
        "session_id": session_id,
        "player_id": session.player_id,
        "started_at": session.started_at,
        "message_count": len(session.messages),
        "recent_messages": session.messages[-MAX_CHAT_HISTORY_SIZE:],
        "quest_events": session.quest_events,
    }


@router.post("/save")
async def save_session(request: SaveRequest):
    """
    Manually save the current session to persistent storage.
    Creates a timestamped save file for the player.
    """
    session_id = request.session_id
    player_id = request.player_id
    
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = active_sessions[session_id]
    
    # Verify player owns this session
    if session.player_id != player_id:
        raise HTTPException(status_code=403, detail="Session does not belong to this player")
    
    # Save to file
    filename = save_session_to_file(session, is_auto_save=False)
    
    # Clean up old logs if needed
    cleanup_old_logs(player_id)
    
    return {"success": True, "saved_as": filename, "message_count": len(session.messages)}


@router.post("/auto-save/{session_id}")
async def auto_save_session(session_id: str):
    """
    Auto-save the session (overwrites previous auto-save).
    Limited to 1 session, automatically managed.
    """
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = active_sessions[session_id]
    filename = save_session_to_file(session, is_auto_save=True)
    
    return {"success": True, "auto_saved": True, "message_count": len(session.messages)}


@router.get("/logs/status/{player_id}", response_model=LogsStatusResponse)
async def get_logs_status(player_id: str):
    """Get status of player's log storage."""
    player_dir = get_player_logs_dir(player_id)
    
    has_auto_save = False
    manual_saves = []
    oldest_log = None
    newest_log = None
    
    if os.path.exists(player_dir):
        for f in os.listdir(player_dir):
            if f == "autosave.json":
                has_auto_save = True
            elif f.startswith("save_") and f.endswith(".json"):
                manual_saves.append(f)
        
        if manual_saves:
            manual_saves.sort()
            oldest_log = manual_saves[0]
            newest_log = manual_saves[-1]
    
    total_size = get_directory_size_mb(player_dir) * 1024  # Convert to KB
    
    return LogsStatusResponse(
        player_id=player_id,
        has_auto_save=has_auto_save,
        manual_saves=manual_saves,
        total_size_kb=round(total_size, 2),
        oldest_log=oldest_log,
        newest_log=newest_log
    )


@router.delete("/logs/clear/{player_id}")
async def clear_player_logs(
    player_id: str,
    keep_auto_save: bool = Query(default=True, description="Keep the auto-save file")
):
    """
    Clear player's log files.
    Optionally keeps the auto-save file.
    
    WARNING: This action is irreversible. Players should be prompted to save first.
    """
    player_dir = get_player_logs_dir(player_id)
    
    if not os.path.exists(player_dir):
        return {"success": True, "message": "No logs to clear", "deleted_count": 0}
    
    deleted_count = 0
    for f in os.listdir(player_dir):
        if f == "autosave.json" and keep_auto_save:
            continue
        filepath = os.path.join(player_dir, f)
        if os.path.isfile(filepath):
            os.remove(filepath)
            deleted_count += 1
    
    return {"success": True, "message": f"Cleared {deleted_count} log files", "deleted_count": deleted_count}


@router.get("/logs/load/{player_id}/{filename}")
async def load_saved_session(player_id: str, filename: str):
    """Load a previously saved session."""
    # Sanitize filename using Path.name to prevent path traversal
    safe_filename = os.path.basename(filename)
    
    # Additional validation
    if not safe_filename or safe_filename != filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    
    # Verify the file path stays within player's directory
    player_dir = get_player_logs_dir(player_id)
    expected_path = os.path.abspath(os.path.join(player_dir, safe_filename))
    if not expected_path.startswith(os.path.abspath(player_dir)):
        raise HTTPException(status_code=400, detail="Invalid filename")
    
    session = load_session_from_file(player_id, safe_filename)
    
    if not session:
        raise HTTPException(status_code=404, detail="Save file not found")
    
    # Register as active session
    active_sessions[session.session_id] = session
    
    return {
        "success": True,
        "session_id": session.session_id,
        "loaded_from": filename,
        "message_count": len(session.messages),
        "quest_event_count": len(session.quest_events)
    }


@router.post("/end-session/{session_id}")
async def end_session(session_id: str, save_before_end: bool = Query(default=True)):
    """
    End a session, optionally saving before closing.
    Players are prompted to save before ending.
    """
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = active_sessions[session_id]
    saved = False
    
    if save_before_end:
        save_session_to_file(session, is_auto_save=True)
        saved = True
    
    del active_sessions[session_id]
    
    return {"success": True, "session_ended": True, "auto_saved": saved}


# ============================================
# Diagnostics & Troubleshooting Endpoints
# ============================================

@router.get("/diagnostics", response_model=DiagnosticsResponse)
async def get_diagnostics():
    """
    Get diagnostic information for troubleshooting.
    Available to developers and game masters.
    """
    issues = []
    recommendations = []
    
    # Check logs directory
    logs_exist = os.path.exists(PLAYER_LOGS_DIR)
    
    if not logs_exist:
        issues.append("Logs directory does not exist")
        recommendations.append(f"Create directory: {PLAYER_LOGS_DIR}")
    
    # Count players with logs
    player_count = 0
    total_size_mb = 0
    
    if logs_exist:
        for item in os.listdir(PLAYER_LOGS_DIR):
            if os.path.isdir(os.path.join(PLAYER_LOGS_DIR, item)):
                player_count += 1
        total_size_mb = get_directory_size_mb(PLAYER_LOGS_DIR)
    
    # Check for size issues
    if total_size_mb > MAX_TOTAL_LOGS_MB * 10:  # 10x limit is concerning
        issues.append(f"Total log storage exceeds {MAX_TOTAL_LOGS_MB * 10}MB")
        recommendations.append("Consider running cleanup for older player logs")
    
    # Check active sessions
    if len(active_sessions) > 1000:
        issues.append("High number of active sessions in memory")
        recommendations.append("Consider implementing session timeout cleanup")
    
    return DiagnosticsResponse(
        status="healthy" if not issues else "issues_detected",
        logs_directory=PLAYER_LOGS_DIR,
        logs_exist=logs_exist,
        player_count=player_count,
        total_size_mb=round(total_size_mb, 2),
        issues=issues,
        recommendations=recommendations
    )


@router.get("/diagnostics/active-sessions")
async def get_active_sessions_info():
    """Get information about active sessions (GM/Developer endpoint)."""
    sessions_info = []
    for sid, session in active_sessions.items():
        sessions_info.append({
            "session_id": sid,
            "player_id": session.player_id,
            "started_at": session.started_at,
            "message_count": len(session.messages),
            "quest_event_count": len(session.quest_events),
        })
    
    return {
        "active_session_count": len(active_sessions),
        "sessions": sessions_info
    }


@router.post("/diagnostics/cleanup")
async def run_cleanup():
    """
    Run cleanup operations on log storage.
    Developer/GM endpoint for maintenance.
    """
    if not os.path.exists(PLAYER_LOGS_DIR):
        return {"success": True, "message": "No logs directory to clean"}
    
    cleaned_players = 0
    for player_id in os.listdir(PLAYER_LOGS_DIR):
        player_dir = os.path.join(PLAYER_LOGS_DIR, player_id)
        if os.path.isdir(player_dir):
            cleanup_old_logs(player_id)
            cleaned_players += 1
    
    return {
        "success": True,
        "players_cleaned": cleaned_players,
        "new_total_size_mb": round(get_directory_size_mb(PLAYER_LOGS_DIR), 2)
    }


@router.get("/response-tags")
async def get_response_tags():
    """
    Get the response tag tables used for building responses.
    Useful for debugging and understanding the response system.
    """
    return {
        "emotional_tags": EMOTIONAL_TAGS,
        "conversation_types": CONVERSATION_TYPES,
        "keyword_patterns": list(KEYWORD_PATTERNS.keys()),
        "response_categories": list(PRESET_RESPONSES.keys())
    }
