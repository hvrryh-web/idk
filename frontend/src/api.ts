import type {
  Character,
  Technique,
  SimulationResult,
  CombatState,
  LogEntry,
  ActionPreview,
} from "./types";

const API_BASE = "http://localhost:8000/api/v1";

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }
  return response.json() as Promise<T>;
}

export async function fetchCharacters(): Promise<Character[]> {
  const res = await fetch(`${API_BASE}/characters`);
  return handle<Character[]>(res);
}

export async function fetchCharacter(id: number): Promise<Character> {
  const res = await fetch(`${API_BASE}/characters/${id}`);
  return handle<Character>(res);
}

export async function fetchTechniques(): Promise<Technique[]> {
  const res = await fetch(`${API_BASE}/techniques`);
  return handle<Technique[]>(res);
}

export async function runSimulation(body: unknown): Promise<SimulationResult> {
  const res = await fetch(`${API_BASE}/simulations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handle<SimulationResult>(res);
}

// Combat API Functions
export async function createCombatEncounter(
  partyIds: string[],
  enemyIds: string[],
  enable3Stage: boolean = true
): Promise<{ encounter_id: string; combat_state: CombatState }> {
  const res = await fetch(`${API_BASE}/combat/encounters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      party_ids: partyIds,
      enemy_ids: enemyIds,
      enable_3_stage: enable3Stage,
    }),
  });
  return handle(res);
}

export async function getCombatState(encounterId: string): Promise<CombatState> {
  const res = await fetch(`${API_BASE}/combat/encounters/${encounterId}`);
  return handle<CombatState>(res);
}

export async function executeAction(
  encounterId: string,
  actorId: string,
  actionType: string,
  techniqueId?: string,
  targetId?: string
): Promise<{ combat_state: CombatState; log_entries: LogEntry[] }> {
  const res = await fetch(`${API_BASE}/combat/encounters/${encounterId}/actions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      actor_id: actorId,
      action_type: actionType,
      technique_id: techniqueId,
      target_id: targetId,
    }),
  });
  return handle(res);
}

export async function executeQuickAction(
  encounterId: string,
  actorId: string,
  quickActionType: string
): Promise<{ combat_state: CombatState; log_entries: LogEntry[] }> {
  const res = await fetch(`${API_BASE}/combat/encounters/${encounterId}/quick-actions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      actor_id: actorId,
      quick_action_type: quickActionType,
    }),
  });
  return handle(res);
}

export async function endTurn(
  encounterId: string
): Promise<{ combat_state: CombatState; log_entries: LogEntry[] }> {
  const res = await fetch(`${API_BASE}/combat/encounters/${encounterId}/end-turn`, {
    method: "POST",
  });
  return handle(res);
}

export async function getCombatLog(encounterId: string): Promise<LogEntry[]> {
  const res = await fetch(`${API_BASE}/combat/encounters/${encounterId}/log`);
  return handle<LogEntry[]>(res);
}

export async function getActionPreview(
  encounterId: string,
  actorId: string,
  techniqueId: string,
  targetId: string
): Promise<ActionPreview> {
  const res = await fetch(
    `${API_BASE}/combat/encounters/${encounterId}/preview?actor_id=${actorId}&technique_id=${techniqueId}&target_id=${targetId}`
  );
  return handle<ActionPreview>(res);
}
