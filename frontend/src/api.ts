import type {
  Character,
  Technique,
  SimulationResult,
  CombatState,
  LogEntry,
  ActionPreview,
  AsciiRenderOptions,
  AsciiRenderResponse,
} from "./types";

const API_BASE = "http://localhost:8000/api/v1";

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }
  return response.json() as Promise<T>;
}

async function handleAsciiResponse(
  response: Response
): Promise<AsciiRenderResponse> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json() as Promise<AsciiRenderResponse>;
  }

  const ascii = await response.text();
  return { ascii };
}

function appendAsciiOptions(
  formData: FormData,
  options?: AsciiRenderOptions
): void {
  if (!options) return;

  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
}

export async function renderAsciiFromUrl(
  imageUrl: string,
  options?: AsciiRenderOptions
): Promise<AsciiRenderResponse> {
  const res = await fetch(`${API_BASE}/ascii/render`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl, ...options }),
  });

  return handleAsciiResponse(res);
}

export async function renderAsciiFromFile(
  image: File,
  options?: AsciiRenderOptions
): Promise<AsciiRenderResponse> {
  const formData = new FormData();
  formData.append("image", image);
  appendAsciiOptions(formData, options);

  const res = await fetch(`${API_BASE}/ascii/render`, {
    method: "POST",
    body: formData,
  });

  return handleAsciiResponse(res);
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

// ASCII Art API Functions
export async function convertImageToASCII(
  file: File,
  style: string = "retro_terminal",
  width?: number,
  height?: number
): Promise<import("./types").ASCIIArtifact> {
  const formData = new FormData();
  formData.append("file", file);

  const params = new URLSearchParams();
  params.append("style", style);
  if (width) params.append("width", width.toString());
  if (height) params.append("height", height.toString());

  const res = await fetch(`${API_BASE}/ascii/convert?${params}`, {
    method: "POST",
    body: formData,
  });
  return handle(res);
}

export async function getASCIIPresets(): Promise<Record<string, import("./types").ASCIIPreset>> {
  const res = await fetch(`${API_BASE}/ascii/presets`);
  return handle(res);
}

export async function getASCIIArtifact(id: string): Promise<import("./types").ASCIIArtifact> {
  const res = await fetch(`${API_BASE}/ascii/${id}`);
  return handle(res);
}

export async function listASCIIArtifacts(
  skip: number = 0,
  limit: number = 20
): Promise<import("./types").ASCIIListItem[]> {
  const res = await fetch(`${API_BASE}/ascii?skip=${skip}&limit=${limit}`);
  return handle(res);
}

export function renderAsciiArt(options: import("./types").AsciiRenderOptions): Promise<import("./types").AsciiRenderResponse> {
  // Stub implementation
  return Promise.resolve({ ascii: "", meta: {} });
}

export function fetchAsciiArt(id: string): Promise<{ art: string }> {
  // Stub implementation
  return Promise.resolve({ art: "" });
}
