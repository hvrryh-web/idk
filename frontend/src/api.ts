import type { Character, Technique, SimulationResult } from './types';

const API_BASE = 'http://localhost:8000/api/v1';

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
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
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handle<SimulationResult>(res);
}
