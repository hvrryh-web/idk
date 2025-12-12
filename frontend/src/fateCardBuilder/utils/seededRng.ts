/**
 * Fate Card Builder - Seeded RNG Utility
 * 
 * Deterministic random number generator for reproducible token draws.
 */

/**
 * Seeded random number generator using Linear Congruential Generator (LCG)
 * Same algorithm as used in character creator for consistency
 */
export class SeededRNG {
  private state: number;
  private readonly initialSeed: number;

  constructor(seed: string | number) {
    // Convert string seed to number if needed
    if (typeof seed === 'string') {
      this.initialSeed = this.hashString(seed);
    } else {
      this.initialSeed = seed;
    }
    this.state = this.initialSeed;
  }

  /**
   * Hash a string to a number for use as seed
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get next random number between 0 and 1
   */
  next(): number {
    this.state = (this.state * 9301 + 49297) % 233280;
    return this.state / 233280;
  }

  /**
   * Get random integer between min (inclusive) and max (exclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  /**
   * Shuffle an array using Fisher-Yates algorithm
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Pick N random elements from array without replacement
   */
  pickN<T>(array: T[], n: number): T[] {
    if (n >= array.length) {
      return this.shuffle(array);
    }
    const shuffled = this.shuffle(array);
    return shuffled.slice(0, n);
  }

  /**
   * Get current RNG state for saving/restoring
   */
  getState(): number {
    return this.state;
  }

  /**
   * Restore RNG to a specific state
   */
  setState(state: number): void {
    this.state = state;
  }

  /**
   * Reset RNG to initial seed
   */
  reset(): void {
    this.state = this.initialSeed;
  }
}

/**
 * Generate a random seed string
 */
export function generateSeed(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let seed = '';
  for (let i = 0; i < 12; i++) {
    seed += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return seed;
}

/**
 * Validate seed format
 */
export function isValidSeed(seed: string): boolean {
  if (!seed || typeof seed !== 'string') return false;
  if (seed.length < 3 || seed.length > 50) return false;
  return /^[A-Za-z0-9]+$/.test(seed);
}
