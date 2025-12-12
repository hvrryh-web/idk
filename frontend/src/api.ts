import { useCallback, useEffect, useState } from "react";
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
const API_ROOT = "http://localhost:8000";

type HealthResponse = { status: string };
type DbStatusResponse = { db_status: string; detail?: string };

export type ApiDiagnostics = {
  apiError: string | null;
  lastApiCall: string | null;
  lastStatus: number | null;
  health: HealthResponse | null;
  dbStatus: DbStatusResponse | null;
  refresh: () => Promise<void>;
};

export function useApi() {
  return { apiError: null, lastApiCall: null, lastStatus: null } as const;
}

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

export function useApi(): ApiDiagnostics {
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastApiCall, setLastApiCall] = useState<string | null>(null);
  const [lastStatus, setLastStatus] = useState<number | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [dbStatus, setDbStatus] = useState<DbStatusResponse | null>(null);

  const refresh = useCallback(async () => {
    try {
      setApiError(null);
      setHealth(null);
      setDbStatus(null);

      setLastApiCall("/health");
      const healthRes = await fetch(`${API_ROOT}/health`);
      setLastStatus(healthRes.status);
      if (!healthRes.ok) {
        throw new Error(`Health check failed (${healthRes.status})`);
      }
      const healthJson = (await healthRes.json()) as HealthResponse;
      setHealth(healthJson);

      setLastApiCall("/db-status");
      const dbRes = await fetch(`${API_ROOT}/db-status`);
      setLastStatus(dbRes.status);
      if (!dbRes.ok) {
        throw new Error(`Database status failed (${dbRes.status})`);
      }
      const dbJson = (await dbRes.json()) as DbStatusResponse;
      setDbStatus(dbJson);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "API error");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { apiError, lastApiCall, lastStatus, health, dbStatus, refresh };
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

export async function fetchAsciiArt(): Promise<{ art: string }> {
  try {
    const res = await fetch(`${API_BASE}/ascii`);
    if (res.ok) {
      const data = await res.json();
      const art =
        (data as { art?: string })?.art ??
        (Array.isArray(data) && data.length > 0 ? (data[0] as { ascii_art?: string }).ascii_art : "");
      if (art) {
        return { art };
      }
    }
  } catch (error) {
    // Non-fatal: fall back to default message
    console.error("Failed to fetch ASCII art", error);
  }

  return { art: "Connect the ASCII renderer to view live output." };
}

export async function renderAsciiArt(formData: FormData): Promise<AsciiRenderResponse> {
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

export async function createCharacter(body: Partial<Character>): Promise<Character> {
  const res = await fetch(`${API_BASE}/characters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handle<Character>(res);
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
