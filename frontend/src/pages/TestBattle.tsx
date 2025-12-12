/**
 * Test Battle Page
 *
 * Entry point for testing the combat engine.
 * Provides a simple interface to start a test battle.
 *
 * @module pages/TestBattle
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createTestEncounter } from "../combat/integration/battleBridge";

export default function TestBattle() {
  const navigate = useNavigate();
  const [seed, setSeed] = useState<number>(Math.floor(Math.random() * 100000));

  const testEncounter = createTestEncounter();

  const handleStartBattle = useCallback(() => {
    // Navigate to combat view with the test encounter
    navigate(`/combat/${testEncounter.encounterId}?seed=${seed}`);
  }, [navigate, seed, testEncounter.encounterId]);

  const handleRandomSeed = useCallback(() => {
    setSeed(Math.floor(Math.random() * 100000));
  }, []);

  const styles = {
    container: {
      padding: "24px",
      maxWidth: "800px",
      margin: "0 auto",
      fontFamily: "system-ui, sans-serif",
    },
    header: {
      textAlign: "center" as const,
      marginBottom: "32px",
    },
    title: {
      fontSize: "2rem",
      marginBottom: "8px",
    },
    subtitle: {
      color: "#888",
      fontSize: "1rem",
    },
    section: {
      background: "#1a1a2e",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "24px",
      border: "1px solid #0f3460",
    },
    sectionTitle: {
      fontSize: "1.2rem",
      marginBottom: "16px",
      color: "#e94560",
    },
    unitCard: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px",
      background: "#16213e",
      borderRadius: "4px",
      marginBottom: "8px",
    },
    unitName: {
      fontWeight: "bold" as const,
    },
    unitStats: {
      color: "#888",
      fontSize: "0.9rem",
    },
    seedInput: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "16px",
    },
    input: {
      padding: "8px 12px",
      borderRadius: "4px",
      border: "1px solid #0f3460",
      background: "#16213e",
      color: "white",
      fontSize: "1rem",
      width: "120px",
    },
    button: {
      padding: "12px 24px",
      borderRadius: "4px",
      border: "none",
      background: "#e94560",
      color: "white",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "background 0.2s",
    },
    buttonSecondary: {
      padding: "8px 16px",
      borderRadius: "4px",
      border: "1px solid #0f3460",
      background: "transparent",
      color: "#888",
      fontSize: "0.9rem",
      cursor: "pointer",
    },
    startButton: {
      display: "block",
      width: "100%",
      padding: "16px 32px",
      fontSize: "1.2rem",
      background: "#22c55e",
      border: "none",
      borderRadius: "8px",
      color: "white",
      cursor: "pointer",
      transition: "background 0.2s, transform 0.1s",
    },
    featureList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    featureItem: {
      padding: "8px 0",
      borderBottom: "1px solid #0f3460",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    badge: {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "4px",
      fontSize: "0.75rem",
      fontWeight: "bold" as const,
    },
    badgeComplete: {
      background: "#22c55e33",
      color: "#22c55e",
    },
    badgePending: {
      background: "#f9731633",
      color: "#f97316",
    },
    backLink: {
      display: "inline-block",
      marginTop: "24px",
      color: "#888",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>⚔️ Test Battle</h1>
        <p style={styles.subtitle}>
          Combat Engine Integration Test
        </p>
      </header>

      {/* Encounter Overview */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Encounter: {testEncounter.encounterId}</h2>

        <h3 style={{ marginBottom: "12px", color: "#22c55e" }}>Party</h3>
        {testEncounter.partyParams.map((unit) => (
          <div key={unit.id} style={styles.unitCard}>
            <div>
              <div style={styles.unitName}>{unit.name}</div>
              <div style={styles.unitStats}>
                SCL {unit.scl} • {unit.techniqueIds?.length || 0} techniques
              </div>
            </div>
            <span style={{ ...styles.badge, ...styles.badgeComplete }}>Player</span>
          </div>
        ))}

        <h3 style={{ marginBottom: "12px", marginTop: "20px", color: "#ef4444" }}>Enemies</h3>
        {testEncounter.enemyParams?.map((unit) => (
          <div key={unit.id} style={styles.unitCard}>
            <div>
              <div style={styles.unitName}>{unit.name}</div>
              <div style={styles.unitStats}>
                SCL {unit.scl} • {unit.isBoss ? "Boss" : "Standard"}
              </div>
            </div>
            <span style={{ ...styles.badge, background: "#ef444433", color: "#ef4444" }}>
              Enemy
            </span>
          </div>
        ))}
      </div>

      {/* RNG Seed */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Combat Settings</h2>
        <div style={styles.seedInput}>
          <label htmlFor="seed">RNG Seed:</label>
          <input
            id="seed"
            type="number"
            value={seed}
            onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
            style={styles.input}
          />
          <button onClick={handleRandomSeed} style={styles.buttonSecondary}>
            🎲 Random
          </button>
        </div>
        <p style={{ color: "#888", fontSize: "0.85rem" }}>
          Same seed = same combat results. Use for testing determinism.
        </p>
      </div>

      {/* Engine Status */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Engine Status</h2>
        <ul style={styles.featureList}>
          <li style={styles.featureItem}>
            <span style={{ ...styles.badge, ...styles.badgeComplete }}>✓</span>
            Seeded RNG (Mulberry32)
          </li>
          <li style={styles.featureItem}>
            <span style={{ ...styles.badge, ...styles.badgeComplete }}>✓</span>
            Event-sourced state reducer
          </li>
          <li style={styles.featureItem}>
            <span style={{ ...styles.badge, ...styles.badgeComplete }}>✓</span>
            ADR-0003 bonus composition
          </li>
          <li style={styles.featureItem}>
            <span style={{ ...styles.badge, ...styles.badgeComplete }}>✓</span>
            Hit/crit/damage calculation
          </li>
          <li style={styles.featureItem}>
            <span style={{ ...styles.badge, ...styles.badgeComplete }}>✓</span>
            Condition management
          </li>
          <li style={styles.featureItem}>
            <span style={{ ...styles.badge, ...styles.badgePending }}>○</span>
            Combat flow controller (Phase 1)
          </li>
          <li style={styles.featureItem}>
            <span style={{ ...styles.badge, ...styles.badgePending }}>○</span>
            Enemy AI (Phase 1)
          </li>
          <li style={styles.featureItem}>
            <span style={{ ...styles.badge, ...styles.badgePending }}>○</span>
            UI Components (Phase 2)
          </li>
        </ul>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStartBattle}
        style={styles.startButton}
        onMouseOver={(e) => {
          (e.target as HTMLButtonElement).style.background = "#16a34a";
          (e.target as HTMLButtonElement).style.transform = "scale(1.02)";
        }}
        onMouseOut={(e) => {
          (e.target as HTMLButtonElement).style.background = "#22c55e";
          (e.target as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        ⚔️ Start Test Battle
      </button>

      <a href="/" style={styles.backLink}>
        ← Back to Home
      </a>
    </div>
  );
}
