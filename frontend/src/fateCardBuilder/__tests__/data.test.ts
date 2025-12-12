/**
 * Tests for Fate Card Data
 * 
 * Validates deck data integrity and structure.
 */

import { describe, it, expect } from "vitest";
import { FATE_CARDS, getFateCardById, getFateCardByCategoryId } from "../data/fateCards";
import { 
  PRIOR_LIFE_DEMISE_DECK, 
  RELIFE_VESSEL_DECK,
  getDeckById, 
  getDeckByCategoryId 
} from "../data/tokenDecks";
import { 
  CURSED_TECHNIQUE_CORE_DECK, 
  TECHNIQUE_MECHANISM_DECK 
} from "../data/tokenDecks2";
import {
  BINDING_VOWS_COSTS_DECK,
  GROWTH_AWAKENING_DECK
} from "../data/tokenDecks3";
import { CategoryId, Side } from "../types";

describe("Fate Cards Data", () => {
  describe("FATE_CARDS", () => {
    it("should contain exactly 6 fate cards", () => {
      expect(FATE_CARDS.length).toBe(6);
    });

    it("should have all required categories", () => {
      const categoryIds = FATE_CARDS.map(card => card.categoryId);
      
      expect(categoryIds).toContain(CategoryId.PRIOR_LIFE_DEMISE);
      expect(categoryIds).toContain(CategoryId.RELIFE_VESSEL);
      expect(categoryIds).toContain(CategoryId.CURSED_TECHNIQUE_CORE);
      expect(categoryIds).toContain(CategoryId.TECHNIQUE_MECHANISM);
      expect(categoryIds).toContain(CategoryId.BINDING_VOWS_COSTS);
      expect(categoryIds).toContain(CategoryId.GROWTH_AWAKENING);
    });

    it("should have exactly 4 questions per fate card", () => {
      FATE_CARDS.forEach(card => {
        expect(card.questions.length).toBe(4);
      });
    });

    it("should have properly indexed questions (0-3)", () => {
      FATE_CARDS.forEach(card => {
        card.questions.forEach((question, idx) => {
          expect(question.index).toBe(idx);
        });
      });
    });

    it("should have non-empty question text", () => {
      FATE_CARDS.forEach(card => {
        card.questions.forEach(question => {
          expect(question.text).toBeTruthy();
          expect(question.text.length).toBeGreaterThan(0);
        });
      });
    });

    it("should have valid deck IDs", () => {
      FATE_CARDS.forEach(card => {
        expect(card.deckId).toBeTruthy();
        expect(card.deckId).toMatch(/^deck-/);
      });
    });
  });

  describe("getFateCardById", () => {
    it("should retrieve fate card by ID", () => {
      const card = getFateCardById("fc-prior-life-demise");
      expect(card).toBeDefined();
      expect(card?.name).toBe("Prior Life Demise");
    });

    it("should return undefined for non-existent ID", () => {
      const card = getFateCardById("non-existent-id");
      expect(card).toBeUndefined();
    });
  });

  describe("getFateCardByCategoryId", () => {
    it("should retrieve fate card by category ID", () => {
      const card = getFateCardByCategoryId(CategoryId.PRIOR_LIFE_DEMISE);
      expect(card).toBeDefined();
      expect(card?.categoryId).toBe(CategoryId.PRIOR_LIFE_DEMISE);
    });

    it("should return undefined for invalid category", () => {
      const card = getFateCardByCategoryId("invalid" as CategoryId);
      expect(card).toBeUndefined();
    });
  });
});

describe("Answer Token Decks", () => {
  const allDecks = [
    PRIOR_LIFE_DEMISE_DECK,
    RELIFE_VESSEL_DECK,
    CURSED_TECHNIQUE_CORE_DECK,
    TECHNIQUE_MECHANISM_DECK,
    BINDING_VOWS_COSTS_DECK,
    GROWTH_AWAKENING_DECK
  ];

  describe("Deck Structure", () => {
    it("should have 6 total decks", () => {
      expect(allDecks.length).toBe(6);
    });

    it("should have exactly 12 tokens per deck", () => {
      allDecks.forEach(deck => {
        expect(deck.tokens.length).toBe(12);
      });
    });

    it("should have all 4 sides (N/E/S/W) per token", () => {
      allDecks.forEach(deck => {
        deck.tokens.forEach(token => {
          expect(token.sides[Side.NORTH]).toBeTruthy();
          expect(token.sides[Side.EAST]).toBeTruthy();
          expect(token.sides[Side.SOUTH]).toBeTruthy();
          expect(token.sides[Side.WEST]).toBeTruthy();
        });
      });
    });

    it("should have unique token IDs within each deck", () => {
      allDecks.forEach(deck => {
        const ids = deck.tokens.map(t => t.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
      });
    });

    it("should have non-empty side text", () => {
      allDecks.forEach(deck => {
        deck.tokens.forEach(token => {
          expect(token.sides[Side.NORTH].length).toBeGreaterThan(0);
          expect(token.sides[Side.EAST].length).toBeGreaterThan(0);
          expect(token.sides[Side.SOUTH].length).toBeGreaterThan(0);
          expect(token.sides[Side.WEST].length).toBeGreaterThan(0);
        });
      });
    });

    it("should have valid labels", () => {
      allDecks.forEach(deck => {
        deck.tokens.forEach(token => {
          expect(token.label).toBeTruthy();
          expect(token.label.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Token Tags", () => {
    it("should have tags as arrays of strings when present", () => {
      allDecks.forEach(deck => {
        deck.tokens.forEach(token => {
          if (token.tags) {
            Object.values(token.tags).forEach(tagArray => {
              if (tagArray) {
                expect(Array.isArray(tagArray)).toBe(true);
                tagArray.forEach((tag: string) => {
                  expect(typeof tag).toBe("string");
                  expect(tag.length).toBeGreaterThan(0);
                });
              }
            });
          }
        });
      });
    });
  });

  describe("getDeckById", () => {
    it("should retrieve deck by deck ID", () => {
      const deck = getDeckById("deck-prior-life-demise");
      expect(deck).toBeDefined();
      expect(deck?.deckId).toBe("deck-prior-life-demise");
    });

    it("should return undefined for non-existent deck ID", () => {
      const deck = getDeckById("non-existent-deck");
      expect(deck).toBeUndefined();
    });
  });

  describe("getDeckByCategoryId", () => {
    it("should retrieve deck by category ID", () => {
      const deck = getDeckByCategoryId(CategoryId.PRIOR_LIFE_DEMISE);
      expect(deck).toBeDefined();
      expect(deck?.categoryId).toBe(CategoryId.PRIOR_LIFE_DEMISE);
    });

    it("should return undefined for invalid category", () => {
      const deck = getDeckByCategoryId("invalid" as CategoryId);
      expect(deck).toBeUndefined();
    });
  });

  describe("Data Volume Verification", () => {
    it("should have 72 total tokens (12 per deck × 6 decks)", () => {
      const totalTokens = allDecks.reduce((sum, deck) => sum + deck.tokens.length, 0);
      expect(totalTokens).toBe(72);
    });

    it("should have 288 total answer options (72 tokens × 4 sides)", () => {
      const totalOptions = allDecks.reduce((sum, deck) => {
        return sum + deck.tokens.length * 4;
      }, 0);
      expect(totalOptions).toBe(288);
    });
  });

  describe("Category-Deck Mapping", () => {
    it("should have matching category IDs between fate cards and decks", () => {
      FATE_CARDS.forEach(card => {
        const deck = getDeckByCategoryId(card.categoryId);
        expect(deck).toBeDefined();
        expect(deck?.categoryId).toBe(card.categoryId);
      });
    });

    it("should reference existing deck IDs from fate cards", () => {
      FATE_CARDS.forEach(card => {
        const deck = getDeckById(card.deckId);
        expect(deck).toBeDefined();
        expect(deck?.deckId).toBe(card.deckId);
      });
    });
  });
});

describe("Data Consistency", () => {
  it("should have consistent ID prefixes", () => {
    expect(PRIOR_LIFE_DEMISE_DECK.tokens[0].id).toMatch(/^pld-/);
    expect(RELIFE_VESSEL_DECK.tokens[0].id).toMatch(/^rlv-/);
    expect(CURSED_TECHNIQUE_CORE_DECK.tokens[0].id).toMatch(/^ctc-/);
    expect(TECHNIQUE_MECHANISM_DECK.tokens[0].id).toMatch(/^tm-/);
    expect(BINDING_VOWS_COSTS_DECK.tokens[0].id).toMatch(/^bvc-/);
    expect(GROWTH_AWAKENING_DECK.tokens[0].id).toMatch(/^ga-/);
  });

  it("should have unique fate card IDs", () => {
    const ids = FATE_CARDS.map(card => card.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have unique deck IDs", () => {
    const allDecks = [
      PRIOR_LIFE_DEMISE_DECK,
      RELIFE_VESSEL_DECK,
      CURSED_TECHNIQUE_CORE_DECK,
      TECHNIQUE_MECHANISM_DECK,
      BINDING_VOWS_COSTS_DECK,
      GROWTH_AWAKENING_DECK
    ];
    
    const deckIds = allDecks.map(deck => deck.deckId);
    const uniqueDeckIds = new Set(deckIds);
    expect(uniqueDeckIds.size).toBe(deckIds.length);
  });
});
