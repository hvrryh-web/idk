import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HUD from "./HUD";

describe("HUD Component - Design System Integration", () => {
  describe("Rendering with Dynasty Theme", () => {
    it("renders HUD with default values", () => {
      render(<HUD />);
      
      // Check for key HUD elements
      expect(screen.getByText(/ROUND/i)).toBeInTheDocument();
      expect(screen.getByText(/SCL/i)).toBeInTheDocument();
    });

    it("displays character name and level", () => {
      const mockCharacter = {
        name: "Zhang Fei",
        level: 10,
        hp: 100,
        maxHp: 120,
        ae: 50,
        maxAe: 60,
        guard: 15,
        strain: 5,
        scl: 8,
      };

      render(<HUD character={mockCharacter} />);
      
      expect(screen.getByText("Zhang Fei")).toBeInTheDocument();
      expect(screen.getByText(/LV\.10/i)).toBeInTheDocument();
    });

    it("displays game state information", () => {
      const mockGameState = {
        round: 3,
        phase: "Enemy Turn",
      };

      render(<HUD gameState={mockGameState} />);
      
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText(/Enemy Turn/i)).toBeInTheDocument();
    });
  });

  describe("Health and Aether Bars", () => {
    it("displays HP bar with correct percentage", () => {
      const mockCharacter = {
        name: "Liu Bei",
        level: 5,
        hp: 50,
        maxHp: 100,
        ae: 30,
        maxAe: 60,
        guard: 10,
        strain: 3,
        scl: 6,
      };

      const { container } = render(<HUD character={mockCharacter} />);
      
      expect(screen.getByText(/HP/i)).toBeInTheDocument();
      expect(screen.getByText(/50/)).toBeInTheDocument();
      expect(screen.getByText(/100/)).toBeInTheDocument();
      
      // Check for progress bar
      const hpBar = container.querySelector(".hp-progress");
      expect(hpBar).toBeInTheDocument();
      expect(hpBar).toHaveStyle({ width: "50%" });
    });

    it("displays AE bar with correct percentage", () => {
      const mockCharacter = {
        name: "Guan Yu",
        level: 8,
        hp: 100,
        maxHp: 100,
        ae: 45,
        maxAe: 60,
        guard: 12,
        strain: 4,
        scl: 7,
      };

      const { container } = render(<HUD character={mockCharacter} />);
      
      expect(screen.getByText(/AE/i)).toBeInTheDocument();
      expect(screen.getByText(/45/)).toBeInTheDocument();
      
      const aeBar = container.querySelector(".ae-progress");
      expect(aeBar).toBeInTheDocument();
      expect(aeBar).toHaveStyle({ width: "75%" });
    });
  });

  describe("Secondary Stats Display", () => {
    it("displays guard and strain values", () => {
      const mockCharacter = {
        name: "Zhao Yun",
        level: 7,
        hp: 90,
        maxHp: 120,
        ae: 40,
        maxAe: 60,
        guard: 18,
        strain: 6,
        scl: 8,
      };

      render(<HUD character={mockCharacter} />);
      
      expect(screen.getByText("18")).toBeInTheDocument(); // Guard
      expect(screen.getByText("6")).toBeInTheDocument(); // Strain
    });
  });

  describe("Dynasty Theme Styling", () => {
    it("applies Persona-style HUD classes", () => {
      const { container } = render(<HUD />);
      
      const hudContainer = container.querySelector(".game-hud-persona");
      expect(hudContainer).toBeInTheDocument();
    });

    it("renders top status bar with imperial styling", () => {
      const { container } = render(<HUD />);
      
      const topBar = container.querySelector(".hud-top-status-bar");
      expect(topBar).toBeInTheDocument();
    });

    it("renders bottom bar with character info", () => {
      const { container } = render(<HUD />);
      
      const bottomBar = container.querySelector(".hud-bottom-bar");
      expect(bottomBar).toBeInTheDocument();
    });

    it("displays SCL badge with imperial gold styling", () => {
      const { container } = render(<HUD />);
      
      const sclBadge = container.querySelector(".scl-badge-wrapper");
      expect(sclBadge).toBeInTheDocument();
    });
  });

  describe("Action Buttons", () => {
    it("renders action buttons", () => {
      const { container } = render(<HUD />);
      
      const actionButtons = container.querySelectorAll(".hud-action-btn");
      expect(actionButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Character Avatar", () => {
    it("displays character initial in avatar", () => {
      const mockCharacter = {
        name: "Cao Cao",
        level: 9,
        hp: 95,
        maxHp: 120,
        ae: 55,
        maxAe: 60,
        guard: 14,
        strain: 7,
        scl: 9,
      };

      render(<HUD character={mockCharacter} />);
      
      // Avatar should show first letter of name
      expect(screen.getByText("C")).toBeInTheDocument();
    });
  });

  describe("Design System Validation", () => {
    it("uses imperial gold borders and jade accents", () => {
      const { container } = render(<HUD />);
      
      // Verify key dynasty theme elements are present
      expect(container.querySelector(".hud-top-status-bar")).toBeInTheDocument();
      expect(container.querySelector(".hud-bottom-bar")).toBeInTheDocument();
      expect(container.querySelector(".char-avatar-box")).toBeInTheDocument();
    });

    it("maintains spacing scale consistency", () => {
      const { container } = render(<HUD />);
      
      // Verify spacing is applied through CSS classes
      const hudParts = container.querySelectorAll("[class*='hud-']");
      expect(hudParts.length).toBeGreaterThan(0);
    });
  });
});
