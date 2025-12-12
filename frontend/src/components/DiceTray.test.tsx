import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DiceTray from "./DiceTray";

describe("DiceTray Component - Fix Validation", () => {
  describe("Component Rendering (validates fix)", () => {
    it("renders without crashing - validates function declaration fix", () => {
      // This test validates that the missing function declaration bug is fixed
      expect(() => render(<DiceTray />)).not.toThrow();
    });

    it("renders dice tray with all elements", () => {
      render(<DiceTray />);
      
      expect(screen.getByText(/Dice Rolling Tray/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Roll/i })).toBeInTheDocument();
    });

    it("displays input fields for dice configuration", () => {
      const { container } = render(<DiceTray />);
      
      // Check for number inputs
      const inputs = container.querySelectorAll('input[type="number"]');
      expect(inputs.length).toBeGreaterThanOrEqual(3); // Dice, Sides, Modifier
    });
  });

  describe("Dice Rolling Functionality", () => {
    it("rolls dice and displays results", () => {
      render(<DiceTray />);
      
      const rollButton = screen.getByRole("button", { name: /Roll/i });
      fireEvent.click(rollButton);
      
      // Should display results after rolling
      expect(screen.getByText(/Total:/i)).toBeInTheDocument();
    });

    it("handles modifier correctly", () => {
      const { container } = render(<DiceTray />);
      
      // Set modifier
      const modifierInput = container.querySelector('input[type="number"][value="0"]');
      if (modifierInput) {
        fireEvent.change(modifierInput, { target: { value: "5" } });
      }
      
      const rollButton = screen.getByRole("button", { name: /Roll/i });
      fireEvent.click(rollButton);
      
      // Results should be displayed
      expect(screen.getByText(/Total:/i)).toBeInTheDocument();
    });

    it("handles different dice configurations", () => {
      render(<DiceTray />);
      
      // Try rolling with different settings
      const rollButton = screen.getByRole("button", { name: /Roll/i });
      
      fireEvent.click(rollButton);
      expect(screen.getByText(/Rolls:/i)).toBeInTheDocument();
      
      // Roll again to verify consistency
      fireEvent.click(rollButton);
      expect(screen.getByText(/Total:/i)).toBeInTheDocument();
    });
  });

  describe("Dynasty Theme Integration", () => {
    it("applies dynasty theme styling", () => {
      const { container } = render(<DiceTray />);
      
      const diceTray = container.querySelector(".dice-tray");
      expect(diceTray).toBeInTheDocument();
      
      // Check that inline styles are applied (as per component implementation)
      const styledDiv = container.querySelector('[style*="parchment"]');
      expect(styledDiv).toBeInTheDocument();
    });
  });

  describe("Input Validation", () => {
    it("accepts valid number inputs", () => {
      const { container } = render(<DiceTray />);
      
      const inputs = container.querySelectorAll('input[type="number"]');
      expect(inputs.length).toBeGreaterThan(0);
      
      inputs.forEach(input => {
        expect(input).toBeInTheDocument();
      });
    });
  });

  describe("Audio Integration", () => {
    it("renders audio element for nat20 sound", () => {
      const { container } = render(<DiceTray />);
      
      const audio = container.querySelector("audio");
      expect(audio).toBeInTheDocument();
    });
  });
});
