/**
 * Fate Card Builder - Validation Utilities
 * 
 * Validation functions for foundation statements and constraint checking.
 */

import { FoundationStatements, FoundationValidation, CategoryId, ConstraintViolation, ValidationResult, BuildState } from "../types";

// ============================================================================
// Constants
// ============================================================================

export const MIN_STATEMENT_LENGTH = 10;
export const MAX_STATEMENT_LENGTH = 200;

// ============================================================================
// Foundation Statement Validation
// ============================================================================

/**
 * Validate action statement
 */
export function validateActionStatement(statement: string): { valid: boolean; error?: string } {
  const trimmed = statement.trim();
  
  if (!trimmed) {
    return { valid: false, error: "Action statement is required" };
  }
  
  if (trimmed.length < MIN_STATEMENT_LENGTH) {
    return { valid: false, error: `Action statement must be at least ${MIN_STATEMENT_LENGTH} characters` };
  }
  
  if (trimmed.length > MAX_STATEMENT_LENGTH) {
    return { valid: false, error: `Action statement must be no more than ${MAX_STATEMENT_LENGTH} characters` };
  }
  
  // Check for format guidance (should start with "I")
  if (!trimmed.toLowerCase().startsWith('i ')) {
    return { valid: false, error: 'Action statement should follow the format: "I <verb> <object/target> (to/for <goal>)"' };
  }
  
  return { valid: true };
}

/**
 * Validate problem statement
 */
export function validateProblemStatement(statement: string): { valid: boolean; error?: string } {
  const trimmed = statement.trim();
  
  if (!trimmed) {
    return { valid: false, error: "Problem statement is required" };
  }
  
  if (trimmed.length < MIN_STATEMENT_LENGTH) {
    return { valid: false, error: `Problem statement must be at least ${MIN_STATEMENT_LENGTH} characters` };
  }
  
  if (trimmed.length > MAX_STATEMENT_LENGTH) {
    return { valid: false, error: `Problem statement must be no more than ${MAX_STATEMENT_LENGTH} characters` };
  }
  
  // Check for format guidance (should start with "Because")
  if (!trimmed.toLowerCase().startsWith('because ')) {
    return { valid: false, error: 'Problem statement should follow the format: "Because <cause>, I <constraint/need/can\'t/must> ..."' };
  }
  
  return { valid: true };
}

/**
 * Validate both foundation statements
 */
export function validateFoundationStatements(foundation: FoundationStatements): FoundationValidation {
  return {
    action: validateActionStatement(foundation.action),
    problem: validateProblemStatement(foundation.problem)
  };
}

/**
 * Check if foundation statements are valid for progression
 */
export function canProceedFromFoundation(foundation: FoundationStatements): boolean {
  const validation = validateFoundationStatements(foundation);
  return validation.action.valid && validation.problem.valid;
}

// ============================================================================
// Constraint Validation
// ============================================================================

/**
 * Check for contradictions between ReLife Vessel and Technique Mechanism
 * 
 * Example contradictions:
 * - Voice trigger but vessel has "Cannot speak above a whisper"
 * - Hand signs but vessel has "Fragile bones that break easily"
 * - Eye contact but vessel has blindness
 */
export function checkVesselMechanismConstraints(buildState: BuildState): ConstraintViolation[] {
  const violations: ConstraintViolation[] = [];
  
  const vesselProgress = buildState.categories[CategoryId.RELIFE_VESSEL];
  const mechanismProgress = buildState.categories[CategoryId.TECHNIQUE_MECHANISM];
  
  if (!vesselProgress || !mechanismProgress) {
    return violations;
  }
  
  // Check for voice-related contradictions
  const voiceTriggers = mechanismProgress.answers.filter(a => 
    a.tags?.includes('voice') || a.tags?.includes('chant') || a.tags?.includes('shout') || a.tags?.includes('whisper')
  );
  
  const voiceConstraints = vesselProgress.answers.filter(a => 
    a.tags?.includes('whisper') || a.tags?.includes('quiet')
  );
  
  if (voiceTriggers.length > 0 && voiceConstraints.length > 0) {
    violations.push({
      type: 'incompatibility',
      categoryA: CategoryId.RELIFE_VESSEL,
      categoryB: CategoryId.TECHNIQUE_MECHANISM,
      description: 'Your vessel limits voice usage, but your technique requires vocal activation',
      suggestionText: 'Consider translating to a gesture or thought trigger',
      canTranslateTrigger: true
    });
  }
  
  // Check for gesture-related contradictions
  const gestureTriggers = mechanismProgress.answers.filter(a => 
    a.tags?.includes('mudra') || a.tags?.includes('snap') || a.tags?.includes('clap')
  );
  
  const handConstraints = vesselProgress.answers.filter(a => 
    a.tags?.includes('fragile') && a.tags?.includes('bones')
  );
  
  if (gestureTriggers.length > 0 && handConstraints.length > 0) {
    violations.push({
      type: 'incompatibility',
      categoryA: CategoryId.RELIFE_VESSEL,
      categoryB: CategoryId.TECHNIQUE_MECHANISM,
      description: 'Your vessel has fragile bones, but your technique requires complex hand gestures',
      suggestionText: 'Consider translating to a focus object or mental trigger',
      canTranslateTrigger: true
    });
  }
  
  // Check for vision-related contradictions
  const eyeTriggers = mechanismProgress.answers.filter(a => 
    a.tags?.includes('gaze') || a.tags?.includes('eye')
  );
  
  const visionConstraints = vesselProgress.answers.filter(a => 
    a.tags?.includes('blind')
  );
  
  if (eyeTriggers.length > 0 && visionConstraints.length > 0) {
    violations.push({
      type: 'contradiction',
      categoryA: CategoryId.RELIFE_VESSEL,
      categoryB: CategoryId.TECHNIQUE_MECHANISM,
      description: 'Your vessel has vision impairment, but your technique requires eye contact',
      suggestionText: 'This is a fundamental contradiction. Consider translating the trigger type.',
      canTranslateTrigger: true
    });
  }
  
  return violations;
}

/**
 * Validate entire build state for constraints
 */
export function validateBuildState(buildState: BuildState): ValidationResult {
  const violations: ConstraintViolation[] = [];
  const warnings: string[] = [];
  
  // Check vessel-mechanism constraints
  violations.push(...checkVesselMechanismConstraints(buildState));
  
  // Check if too many complications
  if (buildState.complicationCount > 5) {
    warnings.push(`You have ${buildState.complicationCount} complications. High complication counts may make your character difficult to play.`);
  }
  
  // Check if foundation statements are set
  if (!buildState.foundation.action || !buildState.foundation.problem) {
    violations.push({
      type: 'contradiction',
      categoryA: CategoryId.PRIOR_LIFE_DEMISE,
      categoryB: CategoryId.PRIOR_LIFE_DEMISE,
      description: 'Foundation statements (Action and Problem) must be completed before proceeding',
      suggestionText: 'Return to the Foundation Chat step',
      canTranslateTrigger: false
    });
  }
  
  return {
    valid: violations.filter(v => v.type === 'contradiction').length === 0,
    violations,
    warnings
  };
}

/**
 * Check if a category is complete (all 4 questions answered)
 */
export function isCategoryComplete(categoryProgress: any): boolean {
  if (!categoryProgress) return false;
  return categoryProgress.answers && categoryProgress.answers.length === 4;
}
