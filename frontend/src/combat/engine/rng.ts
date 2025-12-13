/**
 * Seeded Random Number Generator (Mulberry32)
 *
 * Provides deterministic random number generation for combat engine.
 * Uses Mulberry32 algorithm - fast, deterministic, good distribution.
 *
 * @module combat/engine/rng
 */

export interface SeededRNG {
  /** Get next random number between 0 and 1 */
  next(): number;
  /** Roll a d20 (1-20) */
  d20(): number;
  /** Roll a d6 (1-6) */
  d6(): number;
  /** Roll a die with specified sides */
  roll(sides: number): number;
  /** Get the original seed */
  getSeed(): number;
  /** Get current internal state (for serialization) */
  getState(): number;
  /** Create a copy of this RNG at current state */
  clone(): SeededRNG;
}

/**
 * Create a seeded random number generator
 *
 * @param seed - Initial seed value (any integer)
 * @returns SeededRNG instance
 *
 * @example
 * const rng = createRNG(12345);
 * const roll = rng.d20(); // Deterministic result
 */
export function createRNG(seed: number): SeededRNG {
  let state = seed >>> 0; // Ensure unsigned 32-bit

  function next(): number {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  return {
    next,
    d20: () => Math.floor(next() * 20) + 1,
    d6: () => Math.floor(next() * 6) + 1,
    roll: (sides: number) => Math.floor(next() * sides) + 1,
    getSeed: () => seed,
    getState: () => state,
    clone: () => {
      const cloned = createRNG(seed);
      // Advance to same state
      while (cloned.getState() !== state) {
        cloned.next();
      }
      return cloned;
    },
  };
}

/**
 * Generate a random seed from current time + random
 */
export function generateSeed(): number {
  return Math.floor(Date.now() * Math.random()) >>> 0;
}
