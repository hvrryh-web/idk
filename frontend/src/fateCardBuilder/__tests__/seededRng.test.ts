/**
 * Tests for Seeded RNG Utility
 * 
 * Validates deterministic random number generation for reproducible fate card draws.
 */

import { describe, it, expect } from "vitest";
import { SeededRNG, generateSeed, isValidSeed } from "../utils/seededRng";

describe("SeededRNG", () => {
  describe("Determinism", () => {
    it("should produce the same sequence with the same seed", () => {
      const seed = "test123";
      const rng1 = new SeededRNG(seed);
      const rng2 = new SeededRNG(seed);

      const sequence1 = Array.from({ length: 10 }, () => rng1.next());
      const sequence2 = Array.from({ length: 10 }, () => rng2.next());

      expect(sequence1).toEqual(sequence2);
    });

    it("should produce different sequences with different seeds", () => {
      const rng1 = new SeededRNG("seed1");
      const rng2 = new SeededRNG("seed2");

      const sequence1 = Array.from({ length: 10 }, () => rng1.next());
      const sequence2 = Array.from({ length: 10 }, () => rng2.next());

      expect(sequence1).not.toEqual(sequence2);
    });

    it("should handle numeric seeds", () => {
      const rng1 = new SeededRNG(42);
      const rng2 = new SeededRNG(42);

      const sequence1 = Array.from({ length: 5 }, () => rng1.next());
      const sequence2 = Array.from({ length: 5 }, () => rng2.next());

      expect(sequence1).toEqual(sequence2);
    });
  });

  describe("next()", () => {
    it("should return values between 0 and 1", () => {
      const rng = new SeededRNG("test");
      
      for (let i = 0; i < 100; i++) {
        const value = rng.next();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it("should advance the RNG state", () => {
      const rng = new SeededRNG("test");
      
      const first = rng.next();
      const second = rng.next();
      const third = rng.next();

      expect(first).not.toBe(second);
      expect(second).not.toBe(third);
      expect(first).not.toBe(third);
    });
  });

  describe("nextInt()", () => {
    it("should return integers within the specified range", () => {
      const rng = new SeededRNG("test");
      
      for (let i = 0; i < 100; i++) {
        const value = rng.nextInt(0, 10);
        expect(Number.isInteger(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(10);
      }
    });

    it("should handle single-value ranges", () => {
      const rng = new SeededRNG("test");
      const value = rng.nextInt(5, 6);
      expect(value).toBe(5);
    });

    it("should produce deterministic integer sequences", () => {
      const rng1 = new SeededRNG("intTest");
      const rng2 = new SeededRNG("intTest");

      const ints1 = Array.from({ length: 20 }, () => rng1.nextInt(0, 100));
      const ints2 = Array.from({ length: 20 }, () => rng2.nextInt(0, 100));

      expect(ints1).toEqual(ints2);
    });
  });

  describe("shuffle()", () => {
    it("should shuffle array deterministically", () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const rng1 = new SeededRNG("shuffle");
      const rng2 = new SeededRNG("shuffle");

      const shuffled1 = rng1.shuffle(array);
      const shuffled2 = rng2.shuffle(array);

      expect(shuffled1).toEqual(shuffled2);
    });

    it("should not modify the original array", () => {
      const array = [1, 2, 3, 4, 5];
      const original = [...array];
      const rng = new SeededRNG("test");

      rng.shuffle(array);

      expect(array).toEqual(original);
    });

    it("should contain all original elements", () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8];
      const rng = new SeededRNG("test");

      const shuffled = rng.shuffle(array);

      expect(shuffled.sort()).toEqual(array.sort());
      expect(shuffled.length).toBe(array.length);
    });

    it("should produce different shuffles with different seeds", () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const rng1 = new SeededRNG("seed1");
      const rng2 = new SeededRNG("seed2");

      const shuffled1 = rng1.shuffle(array);
      const shuffled2 = rng2.shuffle(array);

      expect(shuffled1).not.toEqual(shuffled2);
    });
  });

  describe("pickN()", () => {
    it("should pick exactly N elements", () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const rng = new SeededRNG("pick");

      const picked = rng.pickN(array, 3);
      expect(picked.length).toBe(3);
    });

    it("should pick deterministically", () => {
      const array = ["a", "b", "c", "d", "e", "f"];
      const rng1 = new SeededRNG("pick");
      const rng2 = new SeededRNG("pick");

      const picked1 = rng1.pickN(array, 3);
      const picked2 = rng2.pickN(array, 3);

      expect(picked1).toEqual(picked2);
    });

    it("should return all elements if N >= array length", () => {
      const array = [1, 2, 3];
      const rng = new SeededRNG("test");

      const picked = rng.pickN(array, 5);
      expect(picked.length).toBe(3);
      expect(picked.sort()).toEqual(array.sort());
    });

    it("should not contain duplicates", () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const rng = new SeededRNG("test");

      const picked = rng.pickN(array, 5);
      const unique = [...new Set(picked)];
      expect(unique.length).toBe(picked.length);
    });
  });

  describe("State Management", () => {
    it("should save and restore state", () => {
      const rng = new SeededRNG("stateTest");
      
      // Generate some numbers
      rng.next();
      rng.next();
      
      // Save state
      const state = rng.getState();
      
      // Generate more numbers
      const after1 = rng.next();
      const after2 = rng.next();
      
      // Restore state
      rng.setState(state);
      
      // Should generate same numbers
      const restored1 = rng.next();
      const restored2 = rng.next();
      
      expect(restored1).toBe(after1);
      expect(restored2).toBe(after2);
    });

    it("should reset to initial seed", () => {
      const seed = "resetTest";
      const rng = new SeededRNG(seed);
      
      const initial1 = rng.next();
      const initial2 = rng.next();
      
      // Generate more numbers
      rng.next();
      rng.next();
      rng.next();
      
      // Reset
      rng.reset();
      
      // Should match initial sequence
      const reset1 = rng.next();
      const reset2 = rng.next();
      
      expect(reset1).toBe(initial1);
      expect(reset2).toBe(initial2);
    });
  });
});

describe("generateSeed", () => {
  it("should generate a 12-character seed", () => {
    const seed = generateSeed();
    expect(seed.length).toBe(12);
  });

  it("should only contain alphanumeric characters", () => {
    const seed = generateSeed();
    expect(/^[A-Za-z0-9]+$/.test(seed)).toBe(true);
  });

  it("should generate different seeds each time", () => {
    const seeds = new Set();
    for (let i = 0; i < 100; i++) {
      seeds.add(generateSeed());
    }
    // Should have at least 99 unique seeds (allowing 1 collision in 100)
    expect(seeds.size).toBeGreaterThan(98);
  });
});

describe("isValidSeed", () => {
  it("should accept valid alphanumeric seeds", () => {
    expect(isValidSeed("abc123")).toBe(true);
    expect(isValidSeed("ABC123xyz")).toBe(true);
    expect(isValidSeed("test")).toBe(true);
  });

  it("should reject seeds that are too short", () => {
    expect(isValidSeed("ab")).toBe(false);
    expect(isValidSeed("")).toBe(false);
  });

  it("should reject seeds that are too long", () => {
    const longSeed = "a".repeat(51);
    expect(isValidSeed(longSeed)).toBe(false);
  });

  it("should reject seeds with special characters", () => {
    expect(isValidSeed("abc-123")).toBe(false);
    expect(isValidSeed("test seed")).toBe(false);
    expect(isValidSeed("test@123")).toBe(false);
  });

  it("should reject non-string values", () => {
    expect(isValidSeed(null as any)).toBe(false);
    expect(isValidSeed(undefined as any)).toBe(false);
    expect(isValidSeed(123 as any)).toBe(false);
  });
});
