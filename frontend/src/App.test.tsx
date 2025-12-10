import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// Mock fetch globally
globalThis.fetch = vi.fn() as any;

describe("App Component", () => {
  beforeEach(() => {
    // Reset the mock before each test
    vi.clearAllMocks();
  });

  it("renders the Game Room page", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);
    expect(screen.getByText(/WuXuxian TTRPG/i)).toBeInTheDocument();
    
    // Wait for the fetch to complete to avoid act warnings
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });
  });

  it("displays loading state initially", async () => {
    (globalThis.fetch as any).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => [],
              }),
            100
          )
        )
    );

    render(<App />);
    expect(screen.getByText(/Loading characters.../i)).toBeInTheDocument();
    
    // Wait for the fetch to complete to avoid act warnings
    await waitFor(() => {
      expect(screen.queryByText(/Loading characters.../i)).not.toBeInTheDocument();
    });
  });

  it("displays no characters message when list is empty", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/No characters yet/i)).toBeInTheDocument();
    });
  });

  it("displays characters when data is loaded", async () => {
    const mockCharacters = [
      {
        id: 1,
        name: "Test Hero",
        type: "pc",
        description: "A brave warrior",
      },
    ];

    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCharacters,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Test Hero/i)).toBeInTheDocument();
    });

    // Check that the character type is shown
    expect(screen.getByText(/\(pc\)/i)).toBeInTheDocument();
  });

  it("shows LAUNCH ALPHA TEST button", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);

    await waitFor(() => {
      const launchButton = screen.getByRole("button", { name: /LAUNCH ALPHA TEST/i });
      expect(launchButton).toBeInTheDocument();
    });
  });

  it("shows navigation buttons", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Knowledge Wiki/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Help & Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Character Manager/i)).toBeInTheDocument();
  });
});
