/**
 * Character Creator Page
 * 
 * Main page for character customization
 */

import React, { useEffect, useState } from "react";
import { useCharacterCreatorStore } from "../state/useCharacterCreatorStore";
import { PreviewPane } from "../components/PreviewPane";
import { CategoryTabs } from "../components/CategoryTabs";
import { OptionGrid } from "../components/OptionGrid";
import { SwatchPicker } from "../components/SwatchPicker";
import { BaseModel } from "../data/types";
import { exportCompositePNG, downloadPNG } from "../rendering/compositor";

export function CharacterCreatorPage() {
  const {
    manifest,
    manifestLoading,
    manifestError,
    loadManifest,
    appearance,
    setBaseModel,
    randomize,
    undo,
    redo,
    reset,
    saveToLocalStorage,
    loadFromLocalStorage,
    exportAppearance,
    importAppearance,
    history,
    historyIndex,
  } = useCharacterCreatorStore();

  const [exporting, setExporting] = useState(false);

  // Load manifest on mount
  useEffect(() => {
    loadManifest();
    loadFromLocalStorage();
  }, []);

  // Auto-save to localStorage on changes
  useEffect(() => {
    if (manifest) {
      saveToLocalStorage();
    }
  }, [appearance]);

  const handleExportPNG = async (format: "full-body" | "portrait") => {
    if (!manifest) return;
    
    setExporting(true);
    try {
      const blob = await exportCompositePNG(manifest, appearance, { format });
      downloadPNG(blob, `character-${format}.png`);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export PNG");
    } finally {
      setExporting(false);
    }
  };

  const handleExportJSON = () => {
    const json = exportAppearance();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "character-appearance.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = e.target?.result as string;
          importAppearance(json);
        } catch (error) {
          console.error("Import failed:", error);
          alert("Failed to import JSON");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  if (manifestLoading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}>Loading Character Creator...</div>
      </div>
    );
  }

  if (manifestError) {
    return (
      <div style={styles.error}>
        <h2>Error Loading Character Creator</h2>
        <p>{manifestError}</p>
        <button style={styles.retryButton} onClick={loadManifest}>
          Retry
        </button>
      </div>
    );
  }

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.pageTitle}>Character Customization</h1>
        <p style={styles.subtitle}>Create your unique character for the WuXuxian TTRPG</p>
      </header>

      <div style={styles.layout}>
        {/* Left side: Preview */}
        <div style={styles.leftPanel}>
          <PreviewPane format="full-body" />
          
          {/* Base model selector */}
          <div style={styles.baseModelSelector}>
            <h3 style={styles.sectionTitle}>Base Model</h3>
            <div style={styles.baseModelButtons}>
              <button
                style={{
                  ...styles.baseModelButton,
                  ...(appearance.baseModel === BaseModel.FEMALE ? styles.baseModelButtonActive : {}),
                }}
                onClick={() => setBaseModel(BaseModel.FEMALE)}
              >
                Female
              </button>
              <button
                style={{
                  ...styles.baseModelButton,
                  ...(appearance.baseModel === BaseModel.MALE ? styles.baseModelButtonActive : {}),
                }}
                onClick={() => setBaseModel(BaseModel.MALE)}
              >
                Male
              </button>
            </div>
          </div>
        </div>

        {/* Right side: Customization options */}
        <div style={styles.rightPanel}>
          <CategoryTabs />
          <div style={styles.optionsContainer}>
            <OptionGrid />
          </div>
          <SwatchPicker />
        </div>
      </div>

      {/* Bottom controls */}
      <footer style={styles.footer}>
        <div style={styles.controlGroup}>
          <button
            style={styles.controlButton}
            onClick={() => randomize()}
            aria-label="Randomize appearance"
          >
            🎲 Randomize
          </button>
          <button
            style={{
              ...styles.controlButton,
              ...(canUndo ? {} : styles.controlButtonDisabled),
            }}
            onClick={undo}
            disabled={!canUndo}
            aria-label="Undo"
          >
            ↶ Undo
          </button>
          <button
            style={{
              ...styles.controlButton,
              ...(canRedo ? {} : styles.controlButtonDisabled),
            }}
            onClick={redo}
            disabled={!canRedo}
            aria-label="Redo"
          >
            ↷ Redo
          </button>
          <button
            style={styles.controlButton}
            onClick={reset}
            aria-label="Reset to default"
          >
            ⟲ Reset
          </button>
        </div>

        <div style={styles.controlGroup}>
          <button
            style={styles.exportButton}
            onClick={() => handleExportPNG("full-body")}
            disabled={exporting}
            aria-label="Export full-body PNG"
          >
            💾 Export Full Body
          </button>
          <button
            style={styles.exportButton}
            onClick={() => handleExportPNG("portrait")}
            disabled={exporting}
            aria-label="Export portrait PNG"
          >
            💾 Export Portrait
          </button>
          <button
            style={styles.exportButton}
            onClick={handleExportJSON}
            aria-label="Export as JSON"
          >
            📄 Export JSON
          </button>
          <button
            style={styles.exportButton}
            onClick={handleImportJSON}
            aria-label="Import from JSON"
          >
            📂 Import JSON
          </button>
        </div>

        <div style={styles.controlGroup}>
          <button
            style={styles.continueButton}
            onClick={() => {
              saveToLocalStorage();
              alert("Character saved! (In a full implementation, this would navigate to the next step)");
            }}
            aria-label="Continue"
          >
            ✓ Save & Continue
          </button>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    padding: "2rem",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#1a1a1a",
  },
  spinner: {
    fontSize: "1.5rem",
    color: "#4a7aaa",
  },
  error: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#1a1a1a",
    color: "#ef4444",
    padding: "2rem",
    textAlign: "center" as const,
  },
  retryButton: {
    marginTop: "1rem",
    padding: "0.75rem 2rem",
    backgroundColor: "#4a7aaa",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "2rem",
  },
  pageTitle: {
    margin: 0,
    fontSize: "2.5rem",
    fontWeight: "700" as const,
    background: "linear-gradient(135deg, #4a7aaa, #6a9aca)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    margin: "0.5rem 0 0 0",
    fontSize: "1.1rem",
    color: "#b0b0b0",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "2rem",
    marginBottom: "2rem",
  },
  leftPanel: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  rightPanel: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
    backgroundColor: "#2a2a2a",
    padding: "1.5rem",
    borderRadius: "8px",
    maxHeight: "800px",
    overflow: "auto",
  },
  baseModelSelector: {
    backgroundColor: "#2a2a2a",
    padding: "1rem",
    borderRadius: "8px",
  },
  sectionTitle: {
    margin: "0 0 1rem 0",
    fontSize: "1.2rem",
    color: "#ffffff",
    fontWeight: "600" as const,
  },
  baseModelButtons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.5rem",
  },
  baseModelButton: {
    padding: "1rem",
    backgroundColor: "#3a3a3a",
    color: "#b0b0b0",
    border: "2px solid transparent",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
  },
  baseModelButtonActive: {
    backgroundColor: "#4a7aaa",
    color: "#ffffff",
    borderColor: "#6a9aca",
    fontWeight: "600" as const,
  },
  optionsContainer: {
    flex: 1,
    overflow: "auto",
  },
  footer: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "1rem",
    justifyContent: "space-between",
    padding: "1.5rem",
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
  },
  controlGroup: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap" as const,
  },
  controlButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#3a3a3a",
    color: "#e0e0e0",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
  },
  controlButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  exportButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#4a7aaa",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
  },
  continueButton: {
    padding: "0.75rem 2rem",
    backgroundColor: "#22c55e",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1.1rem",
    fontWeight: "600" as const,
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
  },
};
