/**
 * Zhou Xu Advisor Service
 * 
 * Connects to the Zhou Xu backend API for enhanced chatbot functionality.
 * Handles chat requests, session management, and memory logging.
 */

const API_BASE = 'http://localhost:8000/api/v1/zhou-xu';

export interface ChatMessage {
  id: string;
  type: 'user' | 'advisor';
  text: string;
  timestamp: Date;
  emotionalTags?: string[];
  conversationType?: string;
}

export interface ChatResponse {
  response: string;
  emotional_state: string;
  conversation_type: string;
  tags_used: string[];
  session_id: string;
}

export interface QuestEvent {
  event_type: 'started' | 'completed' | 'failed' | 'milestone' | 'discovery';
  quest_name: string;
  description: string;
  timestamp?: string;
  importance?: 'low' | 'normal' | 'high' | 'critical';
}

export interface SessionData {
  session_id: string;
  player_id: string;
  started_at: string;
  message_count: number;
  recent_messages: any[];
  quest_events: QuestEvent[];
}

export interface LogsStatus {
  player_id: string;
  has_auto_save: boolean;
  manual_saves: string[];
  total_size_kb: number;
  oldest_log: string | null;
  newest_log: string | null;
}

export interface DiagnosticsData {
  status: string;
  logs_directory: string;
  logs_exist: boolean;
  player_count: number;
  total_size_mb: number;
  issues: string[];
  recommendations: string[];
}

/**
 * Get the current player ID from session storage
 */
export function getPlayerId(): string {
  const session = localStorage.getItem('wuxuxian_session');
  if (session) {
    try {
      const parsed = JSON.parse(session);
      return parsed.sessionId || 'guest';
    } catch {
      return 'guest';
    }
  }
  return 'guest';
}

/**
 * Send a chat message to Zhou Xu
 */
export async function sendChatMessage(
  message: string,
  sessionId?: string
): Promise<ChatResponse> {
  const playerId = getPlayerId();
  
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      player_id: playerId,
      message: message,
      session_id: sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Log a quest event for session memory
 */
export async function logQuestEvent(event: QuestEvent): Promise<void> {
  const playerId = getPlayerId();
  
  const response = await fetch(`${API_BASE}/log-quest-event?player_id=${playerId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    console.warn('Failed to log quest event:', response.statusText);
  }
}

/**
 * Get current session data
 */
export async function getSession(sessionId: string): Promise<SessionData> {
  const response = await fetch(`${API_BASE}/session/${sessionId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get session: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Save current session manually
 */
export async function saveSession(sessionId: string): Promise<{ success: boolean; saved_as: string }> {
  const playerId = getPlayerId();
  
  const response = await fetch(`${API_BASE}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      player_id: playerId,
      session_id: sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save session: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Auto-save current session
 */
export async function autoSaveSession(sessionId: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/auto-save/${sessionId}`, {
    method: 'POST',
  });

  if (!response.ok) {
    console.warn('Auto-save failed:', response.statusText);
    return { success: false };
  }

  return response.json();
}

/**
 * Get logs status for current player
 */
export async function getLogsStatus(): Promise<LogsStatus> {
  const playerId = getPlayerId();
  
  const response = await fetch(`${API_BASE}/logs/status/${playerId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get logs status: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Clear player logs
 */
export async function clearLogs(keepAutoSave: boolean = true): Promise<{ success: boolean; deleted_count: number }> {
  const playerId = getPlayerId();
  
  const response = await fetch(
    `${API_BASE}/logs/clear/${playerId}?keep_auto_save=${keepAutoSave}`,
    { method: 'DELETE' }
  );

  if (!response.ok) {
    throw new Error(`Failed to clear logs: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Load a saved session
 */
export async function loadSavedSession(
  filename: string
): Promise<{ success: boolean; session_id: string }> {
  const playerId = getPlayerId();
  
  const response = await fetch(`${API_BASE}/logs/load/${playerId}/${filename}`);

  if (!response.ok) {
    throw new Error(`Failed to load session: ${response.statusText}`);
  }

  return response.json();
}

/**
 * End current session
 */
export async function endSession(
  sessionId: string,
  saveBeforeEnd: boolean = true
): Promise<{ success: boolean }> {
  const response = await fetch(
    `${API_BASE}/end-session/${sessionId}?save_before_end=${saveBeforeEnd}`,
    { method: 'POST' }
  );

  if (!response.ok) {
    throw new Error(`Failed to end session: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get diagnostics data (for troubleshooting)
 */
export async function getDiagnostics(): Promise<DiagnosticsData> {
  const response = await fetch(`${API_BASE}/diagnostics`);
  
  if (!response.ok) {
    throw new Error(`Failed to get diagnostics: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get active sessions info (for GM)
 */
export async function getActiveSessionsInfo(): Promise<{ active_session_count: number; sessions: any[] }> {
  const response = await fetch(`${API_BASE}/diagnostics/active-sessions`);
  
  if (!response.ok) {
    throw new Error(`Failed to get active sessions: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Run cleanup (for maintenance)
 */
export async function runCleanup(): Promise<{ success: boolean; players_cleaned: number }> {
  const response = await fetch(`${API_BASE}/diagnostics/cleanup`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to run cleanup: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get response tag tables
 */
export async function getResponseTags(): Promise<{
  emotional_tags: Record<string, string[]>;
  conversation_types: Record<string, string>;
  keyword_patterns: string[];
  response_categories: string[];
}> {
  const response = await fetch(`${API_BASE}/response-tags`);
  
  if (!response.ok) {
    throw new Error(`Failed to get response tags: ${response.statusText}`);
  }

  return response.json();
}
