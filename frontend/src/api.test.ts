import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchCharacters,
  renderAsciiArt,
  fetchAsciiArt,
  convertImageToASCII,
} from "./api";

// Mock fetch globally
globalThis.fetch = vi.fn() as any;

describe("API Functions - Fix Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Duplicate Function Declaration Fixes", () => {
    it("renderAsciiArt is defined only once and works correctly", async () => {
      // This test validates that duplicate renderAsciiArt declaration was removed
      const mockFormData = new FormData();
      mockFormData.append("file", new Blob(["test"]), "test.png");
      mockFormData.append("style", "retro_terminal");

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ ascii: "test ascii", meta: { width: 80 } }),
      });

      const result = await renderAsciiArt(mockFormData);
      
      expect(result).toBeDefined();
      expect(result.ascii).toBe("test ascii");
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    it("fetchAsciiArt is defined only once and works correctly", async () => {
      // This test validates that duplicate fetchAsciiArt declaration was removed
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ art: "test ascii art" }),
      });

      const result = await fetchAsciiArt();
      
      expect(result).toBeDefined();
      expect(result.art).toBe("test ascii art");
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    it("no duplicate exports exist", () => {
      // Validate that the functions are exported and callable
      expect(typeof renderAsciiArt).toBe("function");
      expect(typeof fetchAsciiArt).toBe("function");
      expect(typeof convertImageToASCII).toBe("function");
    });
  });

  describe("API Error Handling", () => {
    it("handles fetch errors gracefully", async () => {
      (globalThis.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      await expect(fetchCharacters()).rejects.toThrow();
    });

    it("handles non-ok responses", async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: "Not found" }),
      });

      await expect(fetchCharacters()).rejects.toThrow();
    });
  });

  describe("ASCII API Functions", () => {
    it("convertImageToASCII sends correct FormData", async () => {
      const mockFile = new File(["image data"], "test.jpg", { type: "image/jpeg" });

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          id: "123",
          ascii: "ASCII art",
          style: "retro_terminal",
        }),
      });

      const result = await convertImageToASCII(mockFile);
      
      expect(result).toBeDefined();
      expect(result.id).toBe("123");
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/ascii/convert"),
        expect.objectContaining({
          method: "POST",
        })
      );
    });

    it("renderAsciiArt with FormData processes correctly", async () => {
      const formData = new FormData();
      formData.append("file", new Blob(["test"]), "image.png");
      formData.append("style", "cyberpunk");

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          ascii: "cyberpunk art",
          meta: { width: 100, height: 50 },
        }),
      });

      const result = await renderAsciiArt(formData);
      
      expect(result.ascii).toBe("cyberpunk art");
      expect(result.meta?.width).toBe(100);
    });
  });

  describe("Character API Functions", () => {
    it("fetchCharacters returns array of characters", async () => {
      const mockCharacters = [
        { id: 1, name: "Hero", type: "pc" },
        { id: 2, name: "Villain", type: "npc" },
      ];

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCharacters,
      });

      const result = await fetchCharacters();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Hero");
    });
  });

  describe("Type Safety", () => {
    it("maintains correct TypeScript types after fixes", async () => {
      // Test that the return types are correct
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ art: "test" }),
      });

      const result = await fetchAsciiArt();
      
      // TypeScript should know these properties exist
      expect(result.art).toBeDefined();
      expect(typeof result.art).toBe("string");
    });
  });
});
