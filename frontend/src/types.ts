export interface Character {
  id: number;
  name: string;
  type?: string;
  description?: string;
  rank?: string;
  techniques?: Technique[];
}

export interface Technique {
  id: number;
  name: string;
  description?: string;
  damage?: number;
  cost?: number;
}

export interface SimulationRequest {
  attacker_id: number;
  defender_id: number;
  technique_id: number;
}

export interface SimulationResult {
  outcome: string;
  attacker: Character;
  defender: Character;
  technique: Technique;
  log?: string[];
}
