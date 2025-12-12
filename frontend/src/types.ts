export interface Character {
  id: number;
  name: string;
  type?: string;
  description?: string;
  rank?: string;
  techniques?: Technique[];
  
  // Alpha testing: Avatar/visual representation
  avatar?: CharacterAvatar;
  
  // Alpha testing: Fate cards
  fateCards?: FateCardSet;
  
  // Primary stats
  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
  perception?: number;
  resolve?: number;
  presence?: number;
  
  // Aether stats
  aether_fire?: number;
  aether_ice?: number;
  aether_void?: number;
  
  // Computed stat
  scl?: number;
  
  // Condition and cost tracks
  conditions?: {
    violence?: ConditionTrack;
    influence?: ConditionTrack;
    revelation?: ConditionTrack;
  };
  cost_tracks?: {
    blood?: CostTrack;
    fate?: CostTrack;
    stain?: CostTrack;
  };
}

export interface ConditionTrack {
  current: number;
  history: ConditionEvent[];
}

export interface ConditionEvent {
  timestamp: string;
  cause: string;
  delta: number;
  note?: string;
}

export interface CostTrack {
  current: number;
  maximum: number;
}

export interface Technique {
  id: number;
  name: string;
  description?: string;
  damage?: number;
  cost?: number;
  ae_cost?: number;
  base_damage?: number;  // Kept for backward compatibility
  self_strain?: number;
  damage_routing?: string;
  technique_type?: string;
  
  // Phase 2: New fields for data-driven combat
  attack_bonus?: number;  // Modifier applied to attack roll/damage
  effect_rank?: number;   // Non-damage effect magnitude (0-10)
  max_scl?: number;       // Maximum SCL allowed to use this technique
  
  // Phase 2: Cost requirements
  cost_requirements?: {
    blood?: number;
    fate?: number;
    stain?: number;
  };
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

export type CombatPhase = "Quick1" | "Major" | "Quick2";

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

// ASCII Art Types
export interface ASCIIArtifact {
  id: string;
  ascii_art: string;
  width: number;
  height: number;
  style: string;
  preset_name: string;
  content_hash: string;
  use_color: boolean;
}

export interface ASCIIPreset {
  name: string;
  description: string;
  use_color: boolean;
}

export interface ASCIIListItem {
  id: string;
  width: number;
  height: number;
  style: string;
  preset_name: string;
  content_hash: string;
  created_at: string;
}

export interface AsciiRenderOptions {
  width?: number;
  height?: number;
  contrast?: number;
  invert?: boolean;
  [key: string]: any;
}

export interface AsciiRenderResponse {
  ascii?: string;
  meta?: Record<string, any>;
  colorized?: boolean;
  cached?: boolean;
  duration_ms?: number;
  charset?: string;
  brightness_threshold?: number;
  width?: number;
}

export interface CharacterAvatar {
  url?: string;
  alt?: string;
  color?: string;
  backgroundPattern?: string;
  icon?: string;
  portraitUrl?: string;
}

export interface FateCard {
  id?: string;
  name?: string;
  description?: string;
  keywords?: string[];
  rarity?: string;
  type?: string;
  colour?: string;
  archetype?: string;
  aspect?: string;
  summary?: string;
  mechanicalHooks?: Record<string, unknown>;
  statMods?: Record<string, unknown>;
}

export interface FateCardSet {
  seedCards?: FateCard[];
  bonusCards?: FateCard[];
  deathCard?: FateCard;
  bodyCard?: FateCard;
}

export interface CharacterCreationData {
  name?: string;
  type?: string;
  avatar?: CharacterAvatar;
  selectedFateCards?: FateCardSet;
  [key: string]: any;
}
