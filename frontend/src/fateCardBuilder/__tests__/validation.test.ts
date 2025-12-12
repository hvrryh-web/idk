/**
 * Tests for Validation Utilities
 * 
 * Validates foundation statement validation and constraint checking.
 */

import { describe, it, expect } from "vitest";
import {
  validateActionStatement,
  validateProblemStatement,
  validateFoundationStatements,
  canProceedFromFoundation,
  checkVesselMechanismConstraints,
  validateBuildState,
  isCategoryComplete,
  MIN_STATEMENT_LENGTH,
  MAX_STATEMENT_LENGTH,
} from "../utils/validation";
import { CategoryId, BuildState, BuildStep, Side } from "../types";

describe("Foundation Statement Validation", () => {
  describe("validateActionStatement", () => {
    it("should accept valid action statements", () => {
      const result = validateActionStatement("I protect the innocent to atone for my past");
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should reject empty statements", () => {
      const result = validateActionStatement("");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("required");
    });

    it("should reject statements that are too short", () => {
      const result = validateActionStatement("I help");
      expect(result.valid).toBe(false);
      expect(result.error).toContain(`at least ${MIN_STATEMENT_LENGTH}`);
    });

    it("should reject statements that are too long", () => {
      const longStatement = "I " + "x".repeat(MAX_STATEMENT_LENGTH);
      const result = validateActionStatement(longStatement);
      expect(result.valid).toBe(false);
      expect(result.error).toContain(`no more than ${MAX_STATEMENT_LENGTH}`);
    });

    it("should reject statements that don't start with 'I'", () => {
      const result = validateActionStatement("They protect the innocent for justice");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("should follow the format");
    });

    it("should trim whitespace", () => {
      const result = validateActionStatement("   I protect the innocent to atone   ");
      expect(result.valid).toBe(true);
    });
  });

  describe("validateProblemStatement", () => {
    it("should accept valid problem statements", () => {
      const result = validateProblemStatement("Because I failed to save them, I must never hesitate again");
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should reject empty statements", () => {
      const result = validateProblemStatement("");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("required");
    });

    it("should reject statements that are too short", () => {
      const result = validateProblemStatement("Because I");
      expect(result.valid).toBe(false);
      expect(result.error).toContain(`at least ${MIN_STATEMENT_LENGTH}`);
    });

    it("should reject statements that are too long", () => {
      const longStatement = "Because " + "x".repeat(MAX_STATEMENT_LENGTH);
      const result = validateProblemStatement(longStatement);
      expect(result.valid).toBe(false);
      expect(result.error).toContain(`no more than ${MAX_STATEMENT_LENGTH}`);
    });

    it("should reject statements that don't start with 'Because'", () => {
      const result = validateProblemStatement("Since I failed, I must try harder now");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("should follow the format");
    });

    it("should trim whitespace", () => {
      const result = validateProblemStatement("   Because I failed to save them, I must never hesitate   ");
      expect(result.valid).toBe(true);
    });
  });

  describe("validateFoundationStatements", () => {
    it("should validate both statements correctly", () => {
      const result = validateFoundationStatements({
        action: "I protect the innocent to atone for my past",
        problem: "Because I failed to save them, I must never hesitate again"
      });

      expect(result.action.valid).toBe(true);
      expect(result.problem.valid).toBe(true);
    });

    it("should return errors for invalid statements", () => {
      const result = validateFoundationStatements({
        action: "short",
        problem: "also short"
      });

      expect(result.action.valid).toBe(false);
      expect(result.problem.valid).toBe(false);
      expect(result.action.error).toBeDefined();
      expect(result.problem.error).toBeDefined();
    });
  });

  describe("canProceedFromFoundation", () => {
    it("should allow progression when both statements are valid", () => {
      const canProceed = canProceedFromFoundation({
        action: "I protect the innocent to atone for my past",
        problem: "Because I failed to save them, I must never hesitate again"
      });

      expect(canProceed).toBe(true);
    });

    it("should block progression when action is invalid", () => {
      const canProceed = canProceedFromFoundation({
        action: "short",
        problem: "Because I failed to save them, I must never hesitate again"
      });

      expect(canProceed).toBe(false);
    });

    it("should block progression when problem is invalid", () => {
      const canProceed = canProceedFromFoundation({
        action: "I protect the innocent to atone for my past",
        problem: "short"
      });

      expect(canProceed).toBe(false);
    });

    it("should block progression when both are invalid", () => {
      const canProceed = canProceedFromFoundation({
        action: "",
        problem: ""
      });

      expect(canProceed).toBe(false);
    });
  });
});

describe("Constraint Validation", () => {
  const createMockBuildState = (): BuildState => ({
    seed: "test",
    mode: "standard",
    step: BuildStep.REVIEW,
    foundation: {
      action: "I protect the innocent to atone for my past",
      problem: "Because I failed to save them, I must never hesitate again"
    },
    categories: {},
    complications: [],
    complicationCount: 0,
    drawHistory: [],
    createdAt: Date.now(),
    lastModified: Date.now()
  });

  describe("checkVesselMechanismConstraints", () => {
    it("should detect voice trigger with whisper limitation", () => {
      const buildState = createMockBuildState();
      buildState.categories[CategoryId.RELIFE_VESSEL] = {
        fateCardId: "fc-relife-vessel",
        answers: [{
          questionIndex: 0,
          tokenId: "rlv-08",
          side: Side.EAST,
          text: "Cannot speak above a whisper",
          tags: ["whisper", "quiet"]
        }],
        completed: false,
        rerollUsed: false,
        burnCount: 0
      };
      buildState.categories[CategoryId.TECHNIQUE_MECHANISM] = {
        fateCardId: "fc-technique-mechanism",
        answers: [{
          questionIndex: 0,
          tokenId: "tm-01",
          side: Side.NORTH,
          text: "Speak the technique's true name",
          tags: ["voice", "true-name"]
        }],
        completed: false,
        rerollUsed: false,
        burnCount: 0
      };

      const violations = checkVesselMechanismConstraints(buildState);

      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0].type).toBe("incompatibility");
      expect(violations[0].canTranslateTrigger).toBe(true);
    });

    it("should detect gesture trigger with fragile bones", () => {
      const buildState = createMockBuildState();
      buildState.categories[CategoryId.RELIFE_VESSEL] = {
        fateCardId: "fc-relife-vessel",
        answers: [{
          questionIndex: 1,
          tokenId: "rlv-04",
          side: Side.EAST,
          text: "Fragile bones that break easily",
          tags: ["fragile", "bones"]
        }],
        completed: false,
        rerollUsed: false,
        burnCount: 0
      };
      buildState.categories[CategoryId.TECHNIQUE_MECHANISM] = {
        fateCardId: "fc-technique-mechanism",
        answers: [{
          questionIndex: 0,
          tokenId: "tm-02",
          side: Side.NORTH,
          text: "Form complex mudra sequence",
          tags: ["mudra", "complex"]
        }],
        completed: false,
        rerollUsed: false,
        burnCount: 0
      };

      const violations = checkVesselMechanismConstraints(buildState);

      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0].type).toBe("incompatibility");
      expect(violations[0].canTranslateTrigger).toBe(true);
    });

    it("should detect eye contact trigger with blindness", () => {
      const buildState = createMockBuildState();
      buildState.categories[CategoryId.RELIFE_VESSEL] = {
        fateCardId: "fc-relife-vessel",
        answers: [{
          questionIndex: 0,
          tokenId: "test-blind",
          side: Side.NORTH,
          text: "Blind from birth",
          tags: ["blind"]
        }],
        completed: false,
        rerollUsed: false,
        burnCount: 0
      };
      buildState.categories[CategoryId.TECHNIQUE_MECHANISM] = {
        fateCardId: "fc-technique-mechanism",
        answers: [{
          questionIndex: 0,
          tokenId: "tm-07",
          side: Side.NORTH,
          text: "Lock eyes with target",
          tags: ["gaze", "lock"]
        }],
        completed: false,
        rerollUsed: false,
        burnCount: 0
      };

      const violations = checkVesselMechanismConstraints(buildState);

      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0].type).toBe("contradiction");
      expect(violations[0].canTranslateTrigger).toBe(true);
    });

    it("should return no violations when constraints are compatible", () => {
      const buildState = createMockBuildState();
      buildState.categories[CategoryId.RELIFE_VESSEL] = {
        fateCardId: "fc-relife-vessel",
        answers: [{
          questionIndex: 0,
          tokenId: "rlv-01",
          side: Side.NORTH,
          text: "Eyes that shift color with emotions",
          tags: ["emotion", "change"]
        }],
        completed: false,
        rerollUsed: false,
        burnCount: 0
      };
      buildState.categories[CategoryId.TECHNIQUE_MECHANISM] = {
        fateCardId: "fc-technique-mechanism",
        answers: [{
          questionIndex: 0,
          tokenId: "tm-04",
          side: Side.NORTH,
          text: "Visualize detailed mental image",
          tags: ["visualize", "image"]
        }],
        completed: false,
        rerollUsed: false,
        burnCount: 0
      };

      const violations = checkVesselMechanismConstraints(buildState);

      expect(violations.length).toBe(0);
    });

    it("should return empty array when categories don't exist", () => {
      const buildState = createMockBuildState();

      const violations = checkVesselMechanismConstraints(buildState);

      expect(violations).toEqual([]);
    });
  });

  describe("validateBuildState", () => {
    it("should pass validation for valid build state", () => {
      const buildState = createMockBuildState();
      buildState.categories[CategoryId.RELIFE_VESSEL] = {
        fateCardId: "fc-relife-vessel",
        answers: [{
          questionIndex: 0,
          tokenId: "test",
          side: Side.NORTH,
          text: "Test answer",
          tags: ["test"]
        }],
        completed: false,
        rerollUsed: false,
        burnCount: 0
      };

      const result = validateBuildState(buildState);

      expect(result.valid).toBe(true);
      expect(result.violations.filter(v => v.type === "contradiction").length).toBe(0);
    });

    it("should warn about high complication count", () => {
      const buildState = createMockBuildState();
      buildState.complicationCount = 6;

      const result = validateBuildState(buildState);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain("complications");
    });

    it("should fail when foundation statements are missing", () => {
      const buildState = createMockBuildState();
      buildState.foundation = { action: "", problem: "" };

      const result = validateBuildState(buildState);

      expect(result.valid).toBe(false);
      expect(result.violations.some(v => v.description.includes("Foundation"))).toBe(true);
    });
  });

  describe("isCategoryComplete", () => {
    it("should return true when all 4 questions are answered", () => {
      const progress = {
        fateCardId: "test",
        answers: [
          { questionIndex: 0, tokenId: "t1", side: Side.NORTH, text: "A1" },
          { questionIndex: 1, tokenId: "t2", side: Side.EAST, text: "A2" },
          { questionIndex: 2, tokenId: "t3", side: Side.SOUTH, text: "A3" },
          { questionIndex: 3, tokenId: "t4", side: Side.WEST, text: "A4" }
        ],
        completed: true,
        rerollUsed: false,
        burnCount: 0
      };

      expect(isCategoryComplete(progress)).toBe(true);
    });

    it("should return false when fewer than 4 questions are answered", () => {
      const progress = {
        fateCardId: "test",
        answers: [
          { questionIndex: 0, tokenId: "t1", side: Side.NORTH, text: "A1" },
          { questionIndex: 1, tokenId: "t2", side: Side.EAST, text: "A2" }
        ],
        completed: false,
        rerollUsed: false,
        burnCount: 0
      };

      expect(isCategoryComplete(progress)).toBe(false);
    });

    it("should return false when category progress is undefined", () => {
      expect(isCategoryComplete(undefined)).toBe(false);
    });

    it("should return false when category progress is null", () => {
      expect(isCategoryComplete(null)).toBe(false);
    });
  });
});
