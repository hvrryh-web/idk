/**
 * CostTrackDisplay Component
 *
 * Displays the Blood/Fate/Stain cost tracks from the Wuxiaxian TTRPG
 * "Power Draws Blood" design pillar.
 *
 * - Blood: Physical strain from glass cannon builds
 * - Fate: Destiny debt from luck manipulation
 * - Stain: Corruption from dark power usage
 */

import React from "react";

interface CostTrack {
  current: number;
  maximum: number;
}

interface CostTracks {
  blood?: CostTrack;
  fate?: CostTrack;
  stain?: CostTrack;
}

interface CostTrackDisplayProps {
  costTracks?: CostTracks;
  compact?: boolean;
}

interface TrackConfig {
  name: string;
  icon: string;
  color: string;
  warningThreshold: number;
  criticalThreshold: number;
  tooltip: string;
}

const TRACK_CONFIGS: Record<string, TrackConfig> = {
  blood: {
    name: "Blood",
    icon: "💉",
    color: "#dc3545",
    warningThreshold: 3,
    criticalThreshold: 7,
    tooltip: "Physical strain. At 3+ marks, auto-applies Wounded.",
  },
  fate: {
    name: "Fate",
    icon: "🌀",
    color: "#6f42c1",
    warningThreshold: 4,
    criticalThreshold: 8,
    tooltip: "Destiny debt. High marks attract misfortune.",
  },
  stain: {
    name: "Stain",
    icon: "🖤",
    color: "#1a1a2e",
    warningThreshold: 5,
    criticalThreshold: 9,
    tooltip: "Corruption. High marks cause moral degradation.",
  },
};

function getTrackColor(
  current: number,
  config: TrackConfig
): string {
  if (current >= config.criticalThreshold) {
    return "#8b0000"; // Dark red for critical
  }
  if (current >= config.warningThreshold) {
    return config.color;
  }
  return "#444"; // Dim for low values
}

function SingleTrack({
  trackKey,
  track,
  compact,
}: {
  trackKey: string;
  track: CostTrack;
  compact?: boolean;
}): React.ReactElement {
  const config = TRACK_CONFIGS[trackKey];
  if (!config) return <></>;

  const percentage = (track.current / track.maximum) * 100;
  const trackColor = getTrackColor(track.current, config);
  const isWarning = track.current >= config.warningThreshold;
  const isCritical = track.current >= config.criticalThreshold;

  if (compact) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "2px",
          padding: "2px 6px",
          marginRight: "4px",
          backgroundColor: isWarning ? trackColor : "#333",
          borderRadius: "4px",
          fontSize: "0.75em",
          color: isWarning ? "#fff" : "#888",
          cursor: "help",
        }}
        title={`${config.name}: ${track.current}/${track.maximum} - ${config.tooltip}`}
      >
        <span>{config.icon}</span>
        <span>{track.current}</span>
      </span>
    );
  }

  return (
    <div
      style={{
        marginBottom: "6px",
        cursor: "help",
      }}
      title={`${config.name}: ${config.tooltip}`}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.8em",
          marginBottom: "2px",
          color: isWarning ? trackColor : "#aaa",
        }}
      >
        <span>
          {config.icon} {config.name}
        </span>
        <span
          style={{
            fontWeight: isCritical ? "bold" : "normal",
          }}
        >
          {track.current}/{track.maximum}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "6px",
          backgroundColor: "#222",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: trackColor,
            transition: "width 0.3s ease, background-color 0.3s ease",
            boxShadow: isCritical ? `0 0 6px ${trackColor}` : "none",
          }}
        />
      </div>
    </div>
  );
}

export default function CostTrackDisplay({
  costTracks,
  compact = false,
}: CostTrackDisplayProps): React.ReactElement | null {
  if (!costTracks) return null;

  const defaultTrack: CostTrack = { current: 0, maximum: 10 };
  const blood = costTracks.blood || defaultTrack;
  const fate = costTracks.fate || defaultTrack;
  const stain = costTracks.stain || defaultTrack;

  // Don't render if all tracks are at 0
  if (blood.current === 0 && fate.current === 0 && stain.current === 0) {
    return null;
  }

  if (compact) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "4px" }}>
        {blood.current > 0 && <SingleTrack trackKey="blood" track={blood} compact />}
        {fate.current > 0 && <SingleTrack trackKey="fate" track={fate} compact />}
        {stain.current > 0 && <SingleTrack trackKey="stain" track={stain} compact />}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "8px",
        backgroundColor: "#1a1a1a",
        borderRadius: "6px",
        marginTop: "8px",
      }}
    >
      <div
        style={{
          fontSize: "0.85em",
          fontWeight: 600,
          marginBottom: "8px",
          color: "#888",
        }}
      >
        Cost Tracks
      </div>
      <SingleTrack trackKey="blood" track={blood} />
      <SingleTrack trackKey="fate" track={fate} />
      <SingleTrack trackKey="stain" track={stain} />
    </div>
  );
}

export type { CostTrack, CostTracks, CostTrackDisplayProps };
