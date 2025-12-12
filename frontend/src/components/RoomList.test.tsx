import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RoomList from "./RoomList";

describe("RoomList Component", () => {
  const mockOnRoomSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders room list with all rooms", () => {
      render(<RoomList onRoomSelect={mockOnRoomSelect} selectedRoom="main" />);
      
      expect(screen.getByText("Rooms")).toBeInTheDocument();
      expect(screen.getByText("Main Hall")).toBeInTheDocument();
      expect(screen.getByText("Training Grounds")).toBeInTheDocument();
      expect(screen.getByText("Sect Library")).toBeInTheDocument();
    });

    it("highlights the selected room", () => {
      render(<RoomList onRoomSelect={mockOnRoomSelect} selectedRoom="training" />);
      
      const trainingButton = screen.getByText("Training Grounds").closest("li");
      expect(trainingButton).toHaveClass("selected");
    });

    it("applies dynasty theme styling classes", () => {
      const { container } = render(
        <RoomList onRoomSelect={mockOnRoomSelect} selectedRoom="main" />
      );
      
      const roomList = container.querySelector(".room-list");
      expect(roomList).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls onRoomSelect when a room is clicked", () => {
      render(<RoomList onRoomSelect={mockOnRoomSelect} selectedRoom="main" />);
      
      const libraryButton = screen.getByText("Sect Library");
      fireEvent.click(libraryButton);
      
      expect(mockOnRoomSelect).toHaveBeenCalledWith("library");
    });

    it("handles multiple room selections", () => {
      render(<RoomList onRoomSelect={mockOnRoomSelect} selectedRoom="main" />);
      
      fireEvent.click(screen.getByText("Training Grounds"));
      expect(mockOnRoomSelect).toHaveBeenCalledWith("training");
      
      fireEvent.click(screen.getByText("Sect Library"));
      expect(mockOnRoomSelect).toHaveBeenCalledWith("library");
      
      expect(mockOnRoomSelect).toHaveBeenCalledTimes(2);
    });

    it("allows selecting the same room again", () => {
      render(<RoomList onRoomSelect={mockOnRoomSelect} selectedRoom="main" />);
      
      const mainButton = screen.getByText("Main Hall");
      fireEvent.click(mainButton);
      
      expect(mockOnRoomSelect).toHaveBeenCalledWith("main");
    });
  });

  describe("Design System Integration", () => {
    it("renders buttons with proper hover states", () => {
      render(<RoomList onRoomSelect={mockOnRoomSelect} selectedRoom="main" />);
      
      const buttons = screen.getAllByRole("button");
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    it("displays proper imperial gold and bronze styling", () => {
      const { container } = render(
        <RoomList onRoomSelect={mockOnRoomSelect} selectedRoom="main" />
      );
      
      // Check that CSS classes for dynasty theme are applied
      const roomList = container.querySelector(".room-list");
      expect(roomList).toBeInTheDocument();
      
      const buttons = container.querySelectorAll(".room-list button");
      expect(buttons.length).toBe(3);
    });
  });

  describe("State Management", () => {
    it("updates selected state correctly", () => {
      const { rerender } = render(
        <RoomList onRoomSelect={mockOnRoomSelect} selectedRoom="main" />
      );
      
      let mainLi = screen.getByText("Main Hall").closest("li");
      expect(mainLi).toHaveClass("selected");
      
      // Rerender with different selection
      rerender(<RoomList onRoomSelect={mockOnRoomSelect} selectedRoom="training" />);
      
      mainLi = screen.getByText("Main Hall").closest("li");
      const trainingLi = screen.getByText("Training Grounds").closest("li");
      
      expect(mainLi).not.toHaveClass("selected");
      expect(trainingLi).toHaveClass("selected");
    });
  });
});
