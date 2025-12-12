import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";
import { Home } from "lucide-react";

describe("Button Component", () => {
  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<Button>Click Me</Button>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it("renders with primary variant", () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole("button", { name: /primary/i });
      expect(button).toHaveClass("btn-primary");
    });

    it("renders with secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button", { name: /secondary/i });
      expect(button).toHaveClass("btn-secondary");
    });

    it("renders with danger variant", () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole("button", { name: /danger/i });
      expect(button).toHaveClass("btn-danger");
    });

    it("renders with small size", () => {
      render(<Button size="small">Small</Button>);
      const button = screen.getByRole("button", { name: /small/i });
      expect(button).toHaveClass("btn-small");
    });

    it("renders with medium size", () => {
      render(<Button size="medium">Medium</Button>);
      const button = screen.getByRole("button", { name: /medium/i });
      expect(button).toHaveClass("btn-medium");
    });

    it("renders with large size", () => {
      render(<Button size="large">Large</Button>);
      const button = screen.getByRole("button", { name: /large/i });
      expect(button).toHaveClass("btn-large");
    });

    it("renders with icon", () => {
      render(
        <Button icon={Home}>
          With Icon
        </Button>
      );
      const button = screen.getByRole("button", { name: /with icon/i });
      expect(button).toBeInTheDocument();
      // Icon should be rendered inside button
      expect(button.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("handles click events", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      
      const button = screen.getByRole("button", { name: /click me/i });
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not trigger onClick when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );
      
      const button = screen.getByRole("button", { name: /disabled/i });
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("applies disabled styling", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button", { name: /disabled/i });
      expect(button).toBeDisabled();
    });
  });

  describe("Styling with Design System", () => {
    it("applies base button class", () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole("button", { name: /test/i });
      expect(button).toHaveClass("btn");
    });

    it("combines variant and size classes", () => {
      render(
        <Button variant="primary" size="large">
          Combined
        </Button>
      );
      const button = screen.getByRole("button", { name: /combined/i });
      expect(button).toHaveClass("btn", "btn-primary", "btn-large");
    });

    it("accepts custom className", () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole("button", { name: /custom/i });
      expect(button).toHaveClass("btn", "custom-class");
    });
  });

  describe("Accessibility", () => {
    it("is keyboard accessible", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Keyboard Test</Button>);
      
      const button = screen.getByRole("button", { name: /keyboard test/i });
      button.focus();
      expect(button).toHaveFocus();
    });

    it("has proper role", () => {
      render(<Button>Role Test</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });
});
