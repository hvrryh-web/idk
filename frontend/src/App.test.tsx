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

  it("renders the app title", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);
    expect(screen.getByText(/WuXuxian TTRPG – Characters/i)).toBeInTheDocument();
    
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
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    
    // Wait for the fetch to complete to avoid act warnings
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
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
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Test Hero",
        type: "pc",
        level: 5,
        description: "A brave warrior",
      },
    ];

    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCharacters,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Test Hero")).toBeInTheDocument();
    });

    expect(screen.getByText(/Type: pc/i)).toBeInTheDocument();
    expect(screen.getByText(/Level: 5/i)).toBeInTheDocument();
    expect(screen.getByText("A brave warrior")).toBeInTheDocument();
  });

  it("displays error message when fetch fails", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });

  it("refreshes characters when refresh button is clicked", async () => {
    const user = userEvent.setup();

    // First load
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/No characters yet/i)).toBeInTheDocument();
    });

    // Mock second load with data
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          name: "New Hero",
          type: "npc",
        },
      ],
    });

    const refreshButton = screen.getByRole("button", { name: /Refresh/i });
    await user.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText("New Hero")).toBeInTheDocument();
    });
  });
});
