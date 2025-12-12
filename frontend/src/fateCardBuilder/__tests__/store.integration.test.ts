/**
 * Integration Tests for Fate Card Builder Store
 * 
 * Tests the complete flow of the Fate Card Builder.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { useFateCardBuilderStore } from "../store/useFateCardBuilderStore";
import { BuildStep, CategoryId, Side } from "../types";

describe("Fate Card Builder Store Integration", () => {
  beforeEach(() => {
    // Reset the store before each test
    const { resetBuild } = useFateCardBuilderStore.getState();
    resetBuild();
    
    // Clear localStorage
    localStorage.clear();
  });

  describe("Initial State", () => {
    it("should initialize with setup step", () => {
      const { buildState } = useFateCardBuilderStore.getState();
      expect(buildState.step).toBe(BuildStep.SETUP);
    });

    it("should have a generated seed", () => {
      const { buildState } = useFateCardBuilderStore.getState();
      expect(buildState.seed).toBeTruthy();
      expect(buildState.seed.length).toBeGreaterThan(0);
    });

    it("should have empty foundation statements", () => {
      const { buildState } = useFateCardBuilderStore.getState();
      expect(buildState.foundation.action).toBe("");
      expect(buildState.foundation.problem).toBe("");
    });

    it("should have zero complications", () => {
      const { buildState } = useFateCardBuilderStore.getState();
      expect(buildState.complicationCount).toBe(0);
      expect(buildState.complications.length).toBe(0);
    });
  });

  describe("Foundation Chat Flow", () => {
    it("should block progression without valid foundation statements", () => {
      const { buildState, canProceedToNextStep } = useFateCardBuilderStore.getState();
      
      expect(buildState.step).toBe(BuildStep.SETUP);
      expect(canProceedToNextStep()).toBe(true); // Can leave setup
      
      const { nextStep } = useFateCardBuilderStore.getState();
      nextStep();
      
      const { buildState: state2, canProceedToNextStep: canProceed2 } = useFateCardBuilderStore.getState();
      expect(state2.step).toBe(BuildStep.FOUNDATION_CHAT);
      expect(canProceed2()).toBe(false); // Blocked without statements
    });

    it("should allow progression with valid foundation statements", () => {
      const { goToStep, setActionStatement, setProblemStatement, canProceedToNextStep } = useFateCardBuilderStore.getState();
      
      goToStep(BuildStep.FOUNDATION_CHAT);
      
      setActionStatement("I protect the innocent to atone for my past failures");
      setProblemStatement("Because I failed to save them, I must never hesitate again");
      
      expect(canProceedToNextStep()).toBe(true);
    });

    it("should update foundation statements", () => {
      const { setActionStatement, setProblemStatement, buildState } = useFateCardBuilderStore.getState();
      
      const action = "I seek to heal the wounded to repay my debts";
      const problem = "Because I caused suffering, I must dedicate myself to healing";
      
      setActionStatement(action);
      setProblemStatement(problem);
      
      const { buildState: state } = useFateCardBuilderStore.getState();
      expect(state.foundation.action).toBe(action);
      expect(state.foundation.problem).toBe(problem);
    });

    it("should trim whitespace from foundation statements", () => {
      const { setActionStatement, setProblemStatement } = useFateCardBuilderStore.getState();
      
      setActionStatement("  I protect the innocent  ");
      setProblemStatement("  Because I failed  ");
      
      const { buildState } = useFateCardBuilderStore.getState();
      expect(buildState.foundation.action).toBe("I protect the innocent");
      expect(buildState.foundation.problem).toBe("Because I failed");
    });
  });

  describe("Token Drawing Flow", () => {
    beforeEach(() => {
      const { goToStep, setActionStatement, setProblemStatement } = useFateCardBuilderStore.getState();
      
      goToStep(BuildStep.FOUNDATION_CHAT);
      setActionStatement("I protect the innocent to atone for my past");
      setProblemStatement("Because I failed to save them, I must never hesitate again");
      goToStep(BuildStep.PRIOR_LIFE_DEMISE);
    });

    it("should draw 3 tokens", () => {
      const { setCurrentCategory, drawTokens, drawnTokens } = useFateCardBuilderStore.getState();
      
      setCurrentCategory(CategoryId.PRIOR_LIFE_DEMISE);
      drawTokens();
      
      const { drawnTokens: tokens } = useFateCardBuilderStore.getState();
      expect(tokens).toBeTruthy();
      expect(tokens?.length).toBe(3);
    });

    it("should draw deterministically with same seed", () => {
      const { setSeed, resetBuild, setCurrentCategory, drawTokens } = useFateCardBuilderStore.getState();
      
      // First draw
      resetBuild();
      setSeed("testSeed123");
      setCurrentCategory(CategoryId.PRIOR_LIFE_DEMISE);
      drawTokens();
      const { drawnTokens: tokens1 } = useFateCardBuilderStore.getState();
      
      // Second draw with same seed
      resetBuild();
      setSeed("testSeed123");
      setCurrentCategory(CategoryId.PRIOR_LIFE_DEMISE);
      drawTokens();
      const { drawnTokens: tokens2 } = useFateCardBuilderStore.getState();
      
      expect(tokens1).toEqual(tokens2);
    });

    it("should allow selecting a token", () => {
      const { setCurrentCategory, drawTokens, selectToken, selectedTokenId } = useFateCardBuilderStore.getState();
      
      setCurrentCategory(CategoryId.PRIOR_LIFE_DEMISE);
      drawTokens();
      
      const { drawnTokens } = useFateCardBuilderStore.getState();
      const firstTokenId = drawnTokens![0].id;
      
      selectToken(firstTokenId);
      
      const { selectedTokenId: selected } = useFateCardBuilderStore.getState();
      expect(selected).toBe(firstTokenId);
    });

    it("should allow selecting a side", () => {
      const { setCurrentCategory, drawTokens, selectToken, selectSide } = useFateCardBuilderStore.getState();
      
      setCurrentCategory(CategoryId.PRIOR_LIFE_DEMISE);
      drawTokens();
      
      const { drawnTokens } = useFateCardBuilderStore.getState();
      selectToken(drawnTokens![0].id);
      selectSide(Side.NORTH);
      
      const { selectedSide } = useFateCardBuilderStore.getState();
      expect(selectedSide).toBe(Side.NORTH);
    });

    it("should commit an answer", () => {
      const { setCurrentCategory, drawTokens, selectToken, selectSide, commitAnswer } = useFateCardBuilderStore.getState();
      
      setCurrentCategory(CategoryId.PRIOR_LIFE_DEMISE);
      drawTokens();
      
      const { drawnTokens } = useFateCardBuilderStore.getState();
      const token = drawnTokens![0];
      
      selectToken(token.id);
      selectSide(Side.NORTH);
      commitAnswer();
      
      const { buildState } = useFateCardBuilderStore.getState();
      const category = buildState.categories[CategoryId.PRIOR_LIFE_DEMISE];
      
      expect(category).toBeDefined();
      expect(category!.answers.length).toBe(1);
      expect(category!.answers[0].tokenId).toBe(token.id);
      expect(category!.answers[0].side).toBe(Side.NORTH);
      expect(category!.answers[0].text).toBe(token.sides[Side.NORTH]);
    });

    it("should clear draw state after committing", () => {
      const { setCurrentCategory, drawTokens, selectToken, selectSide, commitAnswer } = useFateCardBuilderStore.getState();
      
      setCurrentCategory(CategoryId.PRIOR_LIFE_DEMISE);
      drawTokens();
      
      const { drawnTokens } = useFateCardBuilderStore.getState();
      selectToken(drawnTokens![0].id);
      selectSide(Side.NORTH);
      commitAnswer();
      
      const { drawnTokens: tokens, selectedTokenId, selectedSide } = useFateCardBuilderStore.getState();
      expect(tokens).toBeNull();
      expect(selectedTokenId).toBeNull();
      expect(selectedSide).toBeNull();
    });

    it("should allow undoing an answer", () => {
      const { setCurrentCategory, drawTokens, selectToken, selectSide, commitAnswer, undoAnswer } = useFateCardBuilderStore.getState();
      
      setCurrentCategory(CategoryId.PRIOR_LIFE_DEMISE);
      drawTokens();
      
      const { drawnTokens } = useFateCardBuilderStore.getState();
      selectToken(drawnTokens![0].id);
      selectSide(Side.NORTH);
      commitAnswer();
      
      undoAnswer(0);
      
      const { buildState } = useFateCardBuilderStore.getState();
      const category = buildState.categories[CategoryId.PRIOR_LIFE_DEMISE];
      expect(category!.answers.length).toBe(0);
    });
  });

  describe("Category Completion", () => {
    it("should mark category as incomplete until all 4 questions answered", () => {
      const { goToStep, setCurrentCategory, drawTokens, selectToken, selectSide, commitAnswer } = useFateCardBuilderStore.getState();
      
      goToStep(BuildStep.PRIOR_LIFE_DEMISE);
      setCurrentCategory(CategoryId.PRIOR_LIFE_DEMISE);
      
      // Answer 3 questions
      for (let i = 0; i < 3; i++) {
        drawTokens();
        const { drawnTokens } = useFateCardBuilderStore.getState();
        selectToken(drawnTokens![0].id);
        selectSide(Side.NORTH);
        commitAnswer();
        
        const { buildState } = useFateCardBuilderStore.getState();
        const category = buildState.categories[CategoryId.PRIOR_LIFE_DEMISE];
        expect(category!.completed).toBe(false);
      }
    });

    it("should mark category as complete after all 4 questions answered", () => {
      const { goToStep, setCurrentCategory, setCurrentQuestion, drawTokens, selectToken, selectSide, commitAnswer } = useFateCardBuilderStore.getState();
      
      goToStep(BuildStep.PRIOR_LIFE_DEMISE);
      setCurrentCategory(CategoryId.PRIOR_LIFE_DEMISE);
      
      // Answer all 4 questions
      for (let i = 0; i < 4; i++) {
        setCurrentQuestion(i);
        drawTokens();
        const { drawnTokens } = useFateCardBuilderStore.getState();
        selectToken(drawnTokens![0].id);
        selectSide(Side.NORTH);
        commitAnswer();
      }
      
      const { buildState } = useFateCardBuilderStore.getState();
      const category = buildState.categories[CategoryId.PRIOR_LIFE_DEMISE];
      expect(category!.completed).toBe(true);
      expect(category!.answers.length).toBe(4);
    });

    it("should block progression until category complete", () => {
      const { goToStep, setCurrentCategory, canProceedToNextStep } = useFateCardBuilderStore.getState();
      
      goToStep(BuildStep.PRIOR_LIFE_DEMISE);
      setCurrentCategory(CategoryId.PRIOR_LIFE_DEMISE);
      
      expect(canProceedToNextStep()).toBe(false);
    });
  });

  describe("Reroll and Burn System", () => {
    beforeEach(() => {
      const { goToStep, setCurrentCategory } = useFateCardBuilderStore.getState();
      goToStep(BuildStep.PRIOR_LIFE_DEMISE);
      setCurrentCategory(CategoryId.PRIOR_LIFE_DEMISE);
    });

    it("should allow one free reroll per category", () => {
      const { canReroll, drawTokens, rerollOneToken } = useFateCardBuilderStore.getState();
      
      expect(canReroll()).toBe(true);
      
      drawTokens();
      const { drawnTokens } = useFateCardBuilderStore.getState();
      rerollOneToken(drawnTokens![0].id);
      
      const { canReroll: canRerollAfter } = useFateCardBuilderStore.getState();
      expect(canRerollAfter()).toBe(false);
    });

    it("should replace token on reroll", () => {
      const { drawTokens, rerollOneToken } = useFateCardBuilderStore.getState();
      
      drawTokens();
      const { drawnTokens: tokens1 } = useFateCardBuilderStore.getState();
      const firstTokenId = tokens1![0].id;
      
      rerollOneToken(firstTokenId);
      
      const { drawnTokens: tokens2 } = useFateCardBuilderStore.getState();
      expect(tokens2![0].id).not.toBe(firstTokenId);
    });

    it("should add complication on burn", () => {
      const { burnAllTokens, buildState } = useFateCardBuilderStore.getState();
      
      const initialComplications = buildState.complicationCount;
      
      burnAllTokens();
      
      const { buildState: state } = useFateCardBuilderStore.getState();
      expect(state.complicationCount).toBe(initialComplications + 1);
    });

    it("should redraw all tokens on burn", () => {
      const { drawTokens, burnAllTokens } = useFateCardBuilderStore.getState();
      
      drawTokens();
      const { drawnTokens: tokens1 } = useFateCardBuilderStore.getState();
      const ids1 = tokens1!.map(t => t.id);
      
      burnAllTokens();
      
      const { drawnTokens: tokens2 } = useFateCardBuilderStore.getState();
      const ids2 = tokens2!.map(t => t.id);
      
      // Should have new tokens
      expect(tokens2).toBeTruthy();
      expect(tokens2!.length).toBe(3);
      // Unlikely to have all same tokens
      expect(ids1).not.toEqual(ids2);
    });
  });

  describe("localStorage Persistence", () => {
    it("should save to localStorage", () => {
      const { setActionStatement, saveToLocalStorage } = useFateCardBuilderStore.getState();
      
      setActionStatement("I protect the innocent to atone");
      saveToLocalStorage();
      
      const saved = localStorage.getItem("fateCardBuilder_state");
      expect(saved).toBeTruthy();
      
      const parsed = JSON.parse(saved!);
      expect(parsed.foundation.action).toBe("I protect the innocent to atone");
    });

    it("should load from localStorage", () => {
      const { setActionStatement, saveToLocalStorage, resetBuild, loadFromLocalStorage } = useFateCardBuilderStore.getState();
      
      setActionStatement("I protect the innocent to atone");
      saveToLocalStorage();
      
      resetBuild();
      
      const { buildState: beforeLoad } = useFateCardBuilderStore.getState();
      expect(beforeLoad.foundation.action).toBe("");
      
      loadFromLocalStorage();
      
      const { buildState: afterLoad } = useFateCardBuilderStore.getState();
      expect(afterLoad.foundation.action).toBe("I protect the innocent to atone");
    });
  });

  describe("Export Functionality", () => {
    it("should export to JSON", () => {
      const { setActionStatement, setProblemStatement, exportToJSON } = useFateCardBuilderStore.getState();
      
      setActionStatement("I protect the innocent");
      setProblemStatement("Because I failed");
      
      const json = exportToJSON();
      const data = JSON.parse(json);
      
      expect(data.version).toBe("1.0.0");
      expect(data.buildState).toBeDefined();
      expect(data.buildState.foundation.action).toBe("I protect the innocent");
    });

    it("should export to summary text", () => {
      const { setActionStatement, setProblemStatement, exportToSummary } = useFateCardBuilderStore.getState();
      
      setActionStatement("I protect the innocent");
      setProblemStatement("Because I failed");
      
      const summary = exportToSummary();
      
      expect(summary).toContain("FOUNDATION");
      expect(summary).toContain("I protect the innocent");
      expect(summary).toContain("Because I failed");
    });
  });
});
