import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

// Mock fetch globally
globalThis.fetch = vi.fn() as any;

const createResponse = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

function mockApi(characters: any[], options?: { delay?: number; dbStatus?: string; healthStatus?: string }) {
  const delay = options?.delay ?? 0;
  (globalThis.fetch as any).mockImplementation((url: RequestInfo) => {
    const target = typeof url === "string" ? url : (url as Request).url ?? "";

    if (target.includes("/characters")) {
      if (delay > 0) {
        return new Promise((resolve) => setTimeout(() => resolve(createResponse(characters)), delay));
      }
      return Promise.resolve(createResponse(characters));
    }

    if (target.includes("/health")) {
      return Promise.resolve(createResponse({ status: options?.healthStatus ?? "ok" }));
    }

    if (target.includes("/db-status")) {
      return Promise.resolve(createResponse({ db_status: options?.dbStatus ?? "ok" }));
    }

    return Promise.resolve(createResponse({}));
  });
}

describe("App Component", () => {
  beforeEach(() => {
    // Reset the mock before each test
    vi.clearAllMocks();
  });

  it("renders the Game Room page", async () => {
    mockApi([]);

    render(<App />);
    expect(screen.getByText(/WuXuxian TTRPG/i)).toBeInTheDocument();

    // Wait for the fetch to complete to avoid act warnings
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });
  });

  it("displays loading state initially", async () => {
    mockApi([], { delay: 100 });

    render(<App />);
    expect(screen.getByText(/Loading characters.../i)).toBeInTheDocument();

    // Wait for the fetch to complete to avoid act warnings
    await waitFor(() => {
      expect(screen.queryByText(/Loading characters.../i)).not.toBeInTheDocument();
    });
  });

  it("displays no characters message when list is empty", async () => {
    mockApi([]);

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

    mockApi(mockCharacters);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Test Hero/i)).toBeInTheDocument();
    });

    // Check that the character type is shown
    expect(screen.getByText(/\(pc\)/i)).toBeInTheDocument();
  });

  it("shows LAUNCH ALPHA TEST button", async () => {
    mockApi([]);

    render(<App />);

    await waitFor(() => {
      const launchButton = screen.getByRole("button", { name: /LAUNCH ALPHA TEST/i });
      expect(launchButton).toBeInTheDocument();
    });
  });

  it("shows navigation buttons", async () => {
    mockApi([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Knowledge Wiki/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Help & Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Character Manager/i)).toBeInTheDocument();
  });

  it("shows alpha readiness system status", async () => {
    mockApi([]);

    render(<App />);

    expect(await screen.findByText(/Alpha Launch Readiness/i)).toBeInTheDocument();
    expect(screen.getByText(/Backend API/i)).toBeInTheDocument();
    expect(screen.getByText(/Database Link/i)).toBeInTheDocument();
  });
});
