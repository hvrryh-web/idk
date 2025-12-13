/**
 * API Response Validation Utilities
 *
 * Runtime validation for API responses to catch contract mismatches
 * between frontend expectations and backend responses.
 */

import type {
  Character,
  CombatState,
  CombatantState,
  Technique,
  LogEntry,
  CombatPhase,
} from "../types";

// ============================================================================
// Validation Error
// ============================================================================

export class ApiValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly received: unknown
  ) {
    super(`API Validation Error: ${message} (field: ${field})`);
    this.name = "ApiValidationError";
  }
}

// ============================================================================
// Type Guards
// ============================================================================

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isCombatPhase(value: unknown): value is CombatPhase {
  return value === "Quick1" || value === "Major" || value === "Quick2";
}

// ============================================================================
// Field Validators
// ============================================================================

function validateRequiredField<T>(
  obj: Record<string, unknown>,
  field: string,
  validator: (v: unknown) => v is T
): T {
  const value = obj[field];
  if (value === undefined) {
    throw new ApiValidationError(`Missing required field`, field, undefined);
  }
  if (!validator(value)) {
    throw new ApiValidationError(
      `Invalid type for field`,
      field,
      typeof value
    );
  }
  return value;
}

function validateOptionalField<T>(
  obj: Record<string, unknown>,
  field: string,
  validator: (v: unknown) => v is T
): T | undefined {
  const value = obj[field];
  if (value === undefined || value === null) {
    return undefined;
  }
  if (!validator(value)) {
    throw new ApiValidationError(
      `Invalid type for optional field`,
      field,
      typeof value
    );
  }
  return value;
}

// ============================================================================
// Entity Validators
// ============================================================================

export function validateCombatantState(data: unknown): CombatantState {
  if (!isObject(data)) {
    throw new ApiValidationError("Expected object", "CombatantState", typeof data);
  }

  return {
    id: validateRequiredField(data, "id", isString),
    name: validateRequiredField(data, "name", isString),
    is_boss: validateOptionalField(data, "is_boss", isBoolean) ?? false,
    thp: validateRequiredField(data, "thp", isNumber),
    max_thp: validateRequiredField(data, "max_thp", isNumber),
    ae: validateRequiredField(data, "ae", isNumber),
    max_ae: validateRequiredField(data, "max_ae", isNumber),
    ae_reg: validateOptionalField(data, "ae_reg", isNumber) ?? 0,
    dr: validateOptionalField(data, "dr", isNumber) ?? 0,
    strain: validateOptionalField(data, "strain", isNumber) ?? 0,
    guard: validateOptionalField(data, "guard", isNumber) ?? 0,
    spd_band: validateOptionalField(data, "spd_band", isString) ?? "Normal",
    technique_ids: validateOptionalField(data, "technique_ids", isArray) as string[] | undefined ?? [],
    conditions: validateOptionalField(data, "conditions", isArray) as string[] | undefined ?? [],
    scl: validateOptionalField(data, "scl", isNumber),
    sequence_band: validateOptionalField(data, "sequence_band", isString),
    cost_tracks: isObject(data.cost_tracks) ? {
      blood: isObject(data.cost_tracks.blood) ? {
        current: Number((data.cost_tracks.blood as Record<string, unknown>).current) || 0,
        maximum: Number((data.cost_tracks.blood as Record<string, unknown>).maximum) || 10,
      } : undefined,
      fate: isObject(data.cost_tracks.fate) ? {
        current: Number((data.cost_tracks.fate as Record<string, unknown>).current) || 0,
        maximum: Number((data.cost_tracks.fate as Record<string, unknown>).maximum) || 10,
      } : undefined,
      stain: isObject(data.cost_tracks.stain) ? {
        current: Number((data.cost_tracks.stain as Record<string, unknown>).current) || 0,
        maximum: Number((data.cost_tracks.stain as Record<string, unknown>).maximum) || 10,
      } : undefined,
    } : undefined,
  };
}

export function validateCombatState(data: unknown): CombatState {
  if (!isObject(data)) {
    throw new ApiValidationError("Expected object", "CombatState", typeof data);
  }

  const party = data.party;
  const enemies = data.enemies;

  if (!isArray(party)) {
    throw new ApiValidationError("Expected array", "party", typeof party);
  }
  if (!isArray(enemies)) {
    throw new ApiValidationError("Expected array", "enemies", typeof enemies);
  }

  const phaseValue = data.phase;
  const phase: CombatPhase = isCombatPhase(phaseValue) ? phaseValue : "Major";

  return {
    encounter_id: validateRequiredField(data, "encounter_id", isString),
    round: validateRequiredField(data, "round", isNumber),
    phase,
    party: party.map((p) => validateCombatantState(p)),
    enemies: enemies.map((e) => validateCombatantState(e)),
    active_character_id: validateOptionalField(data, "active_character_id", isString) ?? null,
    is_player_turn: validateOptionalField(data, "is_player_turn", isBoolean) ?? false,
    combat_ended: validateOptionalField(data, "combat_ended", isBoolean) ?? false,
    victor: validateOptionalField(data, "victor", isString) ?? null,
  };
}

export function validateCharacter(data: unknown): Partial<Character> {
  if (!isObject(data)) {
    throw new ApiValidationError("Expected object", "Character", typeof data);
  }

  const id = data.id;
  const idNumber = typeof id === "number" ? id : (typeof id === "string" ? parseInt(id, 10) : 0);

  return {
    id: idNumber,
    name: validateRequiredField(data, "name", isString),
    type: validateOptionalField(data, "type", isString),
    description: validateOptionalField(data, "description", isString),
    // Stats - all optional with defaults
    strength: validateOptionalField(data, "strength", isNumber),
    dexterity: validateOptionalField(data, "dexterity", isNumber),
    constitution: validateOptionalField(data, "constitution", isNumber),
    intelligence: validateOptionalField(data, "intelligence", isNumber),
    wisdom: validateOptionalField(data, "wisdom", isNumber),
    charisma: validateOptionalField(data, "charisma", isNumber),
    perception: validateOptionalField(data, "perception", isNumber),
    resolve: validateOptionalField(data, "resolve", isNumber),
    presence: validateOptionalField(data, "presence", isNumber),
    aether_fire: validateOptionalField(data, "aether_fire", isNumber),
    aether_ice: validateOptionalField(data, "aether_ice", isNumber),
    aether_void: validateOptionalField(data, "aether_void", isNumber),
    scl: validateOptionalField(data, "scl", isNumber),
  };
}

export function validateTechnique(data: unknown): Partial<Technique> {
  if (!isObject(data)) {
    throw new ApiValidationError("Expected object", "Technique", typeof data);
  }

  const id = data.id;
  const idNumber = typeof id === "number" ? id : (typeof id === "string" ? parseInt(id, 10) : 0);

  return {
    id: idNumber,
    name: validateRequiredField(data, "name", isString),
    description: validateOptionalField(data, "description", isString),
    technique_type: validateOptionalField(data, "technique_type", isString),
    base_damage: validateOptionalField(data, "base_damage", isNumber),
    ae_cost: validateOptionalField(data, "ae_cost", isNumber),
    self_strain: validateOptionalField(data, "self_strain", isNumber),
    damage_routing: validateOptionalField(data, "damage_routing", isString),
    attack_bonus: validateOptionalField(data, "attack_bonus", isNumber),
    effect_rank: validateOptionalField(data, "effect_rank", isNumber),
    max_scl: validateOptionalField(data, "max_scl", isNumber),
  };
}

export function validateLogEntry(data: unknown): LogEntry {
  if (!isObject(data)) {
    throw new ApiValidationError("Expected object", "LogEntry", typeof data);
  }

  return {
    timestamp: validateOptionalField(data, "timestamp", isNumber) ?? 0,
    actor: validateRequiredField(data, "actor", isString),
    action: validateRequiredField(data, "action", isString),
    target: validateOptionalField(data, "target", isString),
    result: validateOptionalField(data, "result", isString) ?? "",
    damage: validateOptionalField(data, "damage", isNumber),
    conditions: validateOptionalField(data, "conditions", isArray) as string[] | undefined,
  };
}

// ============================================================================
// Validated API Response Handlers
// ============================================================================

/**
 * Wrap an API response handler with validation.
 * Logs warnings for validation failures but returns data anyway for graceful degradation.
 */
export function withValidation<T>(
  validator: (data: unknown) => T,
  context: string
) {
  return (data: unknown): T => {
    try {
      return validator(data);
    } catch (error) {
      if (error instanceof ApiValidationError) {
        console.warn(
          `[API Validation] ${context}: ${error.message}`,
          { field: error.field, received: error.received }
        );
      }
      // Return the data as-is for graceful degradation
      return data as T;
    }
  };
}

/**
 * Validate array of items
 */
export function validateArray<T>(
  data: unknown,
  itemValidator: (item: unknown) => T,
  context: string
): T[] {
  if (!isArray(data)) {
    console.warn(`[API Validation] ${context}: Expected array, got ${typeof data}`);
    return [];
  }
  return data.map((item, index) => {
    try {
      return itemValidator(item);
    } catch (error) {
      console.warn(`[API Validation] ${context}[${index}]: Validation failed`, error);
      return item as T;
    }
  });
}
