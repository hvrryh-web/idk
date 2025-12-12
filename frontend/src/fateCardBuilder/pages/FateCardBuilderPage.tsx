/**
 * Fate Card Builder - Main Page
 * 
 * Step-based character creator for isekai reincarnation background
 * and JJK/HxH-inspired cursed technique generation.
 */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFateCardBuilderStore } from "../store/useFateCardBuilderStore";
import { BuildStep } from "../types";
import { ComplicationBadge } from "../components/ComplicationBadge";

export function FateCardBuilderPage() {
  const navigate = useNavigate();
  const {
    buildState,
    loadFromLocalStorage,
    saveToLocalStorage,
    nextStep,
    prevStep,
    canProceedToNextStep,
    resetBuild
  } = useFateCardBuilderStore();

  // Load from localStorage on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Auto-save on state changes
  useEffect(() => {
    saveToLocalStorage();
  }, [buildState, saveToLocalStorage]);

  const getStepName = (step: BuildStep): string => {
    const names = {
      [BuildStep.SETUP]: "Setup",
      [BuildStep.FOUNDATION_CHAT]: "Foundation Chat",
      [BuildStep.PRIOR_LIFE_DEMISE]: "Prior Life Demise",
      [BuildStep.RELIFE_VESSEL]: "ReLife Vessel",
      [BuildStep.CURSED_TECHNIQUE_CORE]: "Cursed Technique Core",
      [BuildStep.TECHNIQUE_MECHANISM]: "Technique Mechanism",
      [BuildStep.BINDING_VOWS_COSTS]: "Binding Vows & Costs",
      [BuildStep.GROWTH_AWAKENING]: "Growth & Awakening",
      [BuildStep.REVIEW]: "Review & Export"
    };
    return names[step] || "Unknown";
  };

  const renderStepContent = () => {
    switch (buildState.step) {
      case BuildStep.SETUP:
        return (
          <div style={styles.stepContent}>
            <h2>Welcome to the Fate Card Builder</h2>
            <p>
              Create your isekai reincarnation character through a series of fate card draws.
              Your choices will determine your background story and cursed technique.
            </p>
            <div style={styles.infoBox}>
              <h3>How it works:</h3>
              <ol>
                <li><strong>Foundation Chat:</strong> Define your character's core Action and Problem statements</li>
                <li><strong>Fate Cards:</strong> Answer 4 questions for each of 6 categories</li>
                <li><strong>Token Draws:</strong> Draw 3 tokens, choose 1, select a side (N/E/S/W)</li>
                <li><strong>Complications:</strong> Use rerolls and burns strategically</li>
                <li><strong>Review:</strong> See your complete character background and technique</li>
              </ol>
            </div>
            <div style={styles.seedBox}>
              <label style={styles.label}>
                Seed (for reproducible builds):
                <input
                  type="text"
                  value={buildState.seed}
                  readOnly
                  style={styles.input}
                />
              </label>
              <p style={styles.hint}>This seed ensures the same token draws if you share your build</p>
            </div>
          </div>
        );
      
      case BuildStep.FOUNDATION_CHAT:
        return (
          <div style={styles.stepContent}>
            <h2>Foundation Chat</h2>
            <p style={styles.description}>
              Before we begin with the Fate Cards, you must define two critical statements
              that will shape your entire character.
            </p>
            <div style={styles.placeholder}>
              <h3>⚠️ Component Under Construction</h3>
              <p>Foundation Chat Panel will be implemented here</p>
              <ul style={{ textAlign: "left", maxWidth: "600px", margin: "1rem auto" }}>
                <li>Action Statement input (10-200 chars)</li>
                <li>Problem Statement input (10-200 chars)</li>
                <li>Chat-style UI presentation</li>
                <li>Inline validation and guidance</li>
              </ul>
            </div>
          </div>
        );
      
      case BuildStep.REVIEW:
        return (
          <div style={styles.stepContent}>
            <h2>Review & Export</h2>
            <div style={styles.placeholder}>
              <h3>⚠️ Component Under Construction</h3>
              <p>Build Review component will be implemented here</p>
              <ul style={{ textAlign: "left", maxWidth: "600px", margin: "1rem auto" }}>
                <li>Character sheet summary</li>
                <li>Action → Technique Expression mapping</li>
                <li>Problem → Origin Pressure mapping</li>
                <li>JSON export</li>
                <li>Summary text export</li>
              </ul>
            </div>
          </div>
        );
      
      default:
        // Category steps
        return (
          <div style={styles.stepContent}>
            <h2>{getStepName(buildState.step)}</h2>
            <div style={styles.placeholder}>
              <h3>⚠️ Component Under Construction</h3>
              <p>Fate Card Builder components will be implemented here</p>
              <ul style={{ textAlign: "left", maxWidth: "600px", margin: "1rem auto" }}>
                <li>Fate Card View (4 questions)</li>
                <li>Token Draw Panel (3 tokens × 4 sides)</li>
                <li>Answer commitment UI</li>
                <li>Reroll/Burn actions</li>
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button
            onClick={() => navigate("/")}
            style={styles.backButton}
            aria-label="Back to Game Room"
          >
            ← Back
          </button>
          <h1 style={styles.title}>Fate Card Builder</h1>
        </div>
        <div style={styles.headerRight}>
          <ComplicationBadge
            count={buildState.complicationCount}
            complications={buildState.complications}
          />
          <button
            onClick={resetBuild}
            style={styles.resetButton}
            aria-label="Reset build"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          {Object.values(BuildStep).filter(v => typeof v === "number").map((step) => {
            const stepNum = step as BuildStep;
            const isActive = stepNum === buildState.step;
            const isComplete = stepNum < buildState.step;
            
            return (
              <div
                key={stepNum}
                style={{
                  ...styles.progressStep,
                  ...(isActive ? styles.progressStepActive : {}),
                  ...(isComplete ? styles.progressStepComplete : {})
                }}
              >
                <div style={styles.progressDot}>
                  {isComplete ? "✓" : stepNum + 1}
                </div>
                <div style={styles.progressLabel}>
                  {getStepName(stepNum)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {renderStepContent()}
      </div>

      {/* Navigation Footer */}
      <div style={styles.footer}>
        <button
          onClick={prevStep}
          disabled={buildState.step === BuildStep.SETUP}
          style={{
            ...styles.navButton,
            ...(buildState.step === BuildStep.SETUP ? styles.navButtonDisabled : {})
          }}
        >
          ← Previous
        </button>
        
        <div style={styles.footerCenter}>
          <span style={styles.stepIndicator}>
            Step {buildState.step + 1} of {Object.keys(BuildStep).length / 2}
          </span>
        </div>
        
        <button
          onClick={nextStep}
          disabled={!canProceedToNextStep() || buildState.step === BuildStep.REVIEW}
          style={{
            ...styles.navButton,
            ...styles.navButtonPrimary,
            ...(!canProceedToNextStep() || buildState.step === BuildStep.REVIEW ? styles.navButtonDisabled : {})
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0a0a0a",
    color: "#e5e5e5",
    fontFamily: "system-ui, -apple-system, sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem 2rem",
    backgroundColor: "#1a1a1a",
    borderBottom: "1px solid #333"
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },
  backButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "transparent",
    border: "1px solid #444",
    borderRadius: "4px",
    color: "#e5e5e5",
    cursor: "pointer",
    fontSize: "14px"
  },
  title: {
    margin: 0,
    fontSize: "1.75rem",
    fontWeight: "600"
  },
  resetButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#ef4444",
    border: "none",
    borderRadius: "4px",
    color: "white",
    cursor: "pointer",
    fontSize: "14px"
  },
  progressContainer: {
    padding: "2rem",
    backgroundColor: "#141414",
    borderBottom: "1px solid #333"
  },
  progressBar: {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  progressStep: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "0.5rem",
    opacity: 0.5,
    transition: "opacity 0.3s"
  },
  progressStepActive: {
    opacity: 1
  },
  progressStepComplete: {
    opacity: 0.8,
    color: "#4ade80"
  },
  progressDot: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "600"
  },
  progressLabel: {
    fontSize: "11px",
    textAlign: "center" as const,
    maxWidth: "80px"
  },
  content: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "3rem 2rem",
    minHeight: "60vh"
  },
  stepContent: {
    textAlign: "center" as const
  },
  description: {
    fontSize: "1.1rem",
    color: "#aaa",
    marginBottom: "2rem"
  },
  infoBox: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "2rem",
    textAlign: "left" as const
  },
  seedBox: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "1.5rem",
    textAlign: "left" as const
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "500"
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    marginTop: "0.5rem",
    backgroundColor: "#0a0a0a",
    border: "1px solid #444",
    borderRadius: "4px",
    color: "#e5e5e5",
    fontSize: "14px"
  },
  hint: {
    fontSize: "12px",
    color: "#888",
    marginTop: "0.5rem"
  },
  placeholder: {
    padding: "3rem",
    backgroundColor: "#1a1a1a",
    border: "2px dashed #444",
    borderRadius: "8px",
    textAlign: "center" as const
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem 2rem",
    backgroundColor: "#1a1a1a",
    borderTop: "1px solid #333",
    position: "sticky" as const,
    bottom: 0
  },
  footerCenter: {
    flex: 1,
    textAlign: "center" as const
  },
  stepIndicator: {
    fontSize: "14px",
    color: "#888"
  },
  navButton: {
    padding: "0.75rem 2rem",
    backgroundColor: "#333",
    border: "none",
    borderRadius: "4px",
    color: "#e5e5e5",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s"
  },
  navButtonPrimary: {
    backgroundColor: "#3b82f6"
  },
  navButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed"
  }
};
