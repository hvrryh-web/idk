import { useState } from "react";
import type { ASCIIArtifact } from "../types";
import "../styles/ASCIITVScreen.css";

interface ASCIITVScreenProps {
  artifact?: ASCIIArtifact | null;
  monochrome?: boolean;
}

export default function ASCIITVScreen({ artifact, monochrome = false }: ASCIITVScreenProps) {
  const [fontSize, setFontSize] = useState(12);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className={`ascii-tv-screen ${highContrast ? "high-contrast" : ""}`}>
      <div className="tv-controls">
        <div className="control-group">
          <label htmlFor="font-size">Font Size:</label>
          <input
            id="font-size"
            type="range"
            min="8"
            max="20"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
          <span>{fontSize}px</span>
        </div>
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
            />
            High Contrast
          </label>
        </div>
      </div>

      <div className="tv-display">
        {artifact ? (
          <div className="tv-content">
            <div className="tv-header">
              <span className="tv-title">{artifact.preset_name}</span>
              <span className="tv-dimensions">
                {artifact.width}x{artifact.height}
              </span>
            </div>
            <pre
              className={`ascii-content ${monochrome ? "monochrome" : ""}`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {artifact.ascii_art}
            </pre>
          </div>
        ) : (
          <div className="tv-placeholder">
            <p>No ASCII art loaded</p>
            <p className="tv-hint">Upload and convert an image in the ASCII Art Generator</p>
          </div>
        )}
      </div>
    </div>
  );
}
