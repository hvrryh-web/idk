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
  ae_cost?: number;
  base_damage?: number;
  self_strain?: number;
  damage_routing?: string;
  technique_type?: string;
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

// Combat UI Types
export interface CombatantState {
  id: string;
  name: string;
  is_boss: boolean;
  thp: number;
  max_thp: number;
  ae: number;
  max_ae: number;
  ae_reg: number;
  dr: number;
  strain: number;
  guard: number;
  spd_band: string;
  technique_ids?: string[];
  conditions?: string[];
}

export interface CombatState {
  encounter_id: string;
  round: number;
  phase: CombatPhase;
  party: CombatantState[];
  enemies: CombatantState[];
  active_character_id: string | null;
  is_player_turn: boolean;
  combat_ended: boolean;
  victor: string | null;
}

export type CombatPhase = 'Quick1' | 'Major' | 'Quick2';

export interface LogEntry {
  timestamp: number;
  actor: string;
  action: string;
  target?: string;
  result: string;
  damage?: number;
  conditions?: string[];
}

export interface ActionPreview {
  technique_id: string;
  technique_name: string;
  ae_cost: number;
  self_strain: number;
  estimated_damage: number;
  blood_marks: number;
  fate_marks: number;
  stain_marks: number;
  warnings: string[];
}
