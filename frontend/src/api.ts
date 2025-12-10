const API_BASE = 'http://localhost:8000/api/v1';

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }
  return response.json() as Promise<T>;
}

export async function fetchCharacters() {
  const res = await fetch(`${API_BASE}/characters`);
  return handle(res);
}

export async function fetchCharacter(id: number) {
  const res = await fetch(`${API_BASE}/characters/${id}`);
  return handle(res);
}

export async function fetchTechniques() {
  const res = await fetch(`${API_BASE}/techniques`);
  return handle(res);
}

export async function runSimulation(body: unknown) {
  const res = await fetch(`${API_BASE}/simulations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handle(res);
}
