/**
 * Preview Pane Component
 * 
 * Displays the live character preview
 */

import React, { useRef, useEffect, useState } from "react";
import { renderCharacter } from "../rendering/compositor";
import { useCharacterCreatorStore } from "../state/useCharacterCreatorStore";

interface PreviewPaneProps {
  format?: "full-body" | "portrait";
}

export function PreviewPane({ format = "full-body" }: PreviewPaneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { manifest, appearance } = useCharacterCreatorStore();

  // Render character whenever appearance changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !manifest) return;

    const render = async () => {
      setRendering(true);
      setError(null);
      try {
        const startTime = performance.now();
        await renderCharacter(manifest, appearance, canvas);
        const endTime = performance.now();
        console.log(`Render time: ${endTime - startTime}ms`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Rendering failed");
        console.error("Rendering error:", err);
      } finally {
        setRendering(false);
      }
    };

    render();
  }, [manifest, appearance, format]);

  return (
    <div style={styles.container}>
      <div style={styles.canvasWrapper}>
        <canvas
          ref={canvasRef}
          style={styles.canvas}
          aria-label="Character preview"
        />
        {rendering && (
          <div style={styles.overlay}>
            <div style={styles.spinner}>Rendering...</div>
          </div>
        )}
        {error && (
          <div style={styles.error}>
            Error: {error}
          </div>
        )}
      </div>
      <div style={styles.formatToggle}>
        <span style={styles.formatLabel}>
          {format === "full-body" ? "Full Body" : "Portrait"}
        </span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
    minHeight: "600px",
  },
  canvasWrapper: {
    position: "relative" as const,
    backgroundColor: "#1a1a1a",
    borderRadius: "4px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
  },
  canvas: {
    display: "block",
    maxWidth: "100%",
    height: "auto",
  },
  overlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    color: "#ffffff",
    fontSize: "1.2rem",
    fontWeight: "bold" as const,
  },
  error: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(220, 38, 38, 0.9)",
    color: "#ffffff",
    padding: "1rem",
    borderRadius: "4px",
    maxWidth: "80%",
    textAlign: "center" as const,
  },
  formatToggle: {
    padding: "0.5rem 1rem",
    backgroundColor: "#3a3a3a",
    borderRadius: "4px",
  },
  formatLabel: {
    color: "#e0e0e0",
    fontSize: "0.9rem",
    fontWeight: "500" as const,
  },
};
