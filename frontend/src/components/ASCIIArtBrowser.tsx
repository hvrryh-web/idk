import { useState, useEffect } from "react";
import { convertImageToASCII, getASCIIPresets, listASCIIArtifacts } from "../api";
import type { ASCIIArtifact, ASCIIPreset, ASCIIListItem } from "../types";
import "../styles/ASCIIArtBrowser.css";

interface ASCIIArtBrowserProps {
  onSendToTV?: (artifact: ASCIIArtifact) => void;
}

export default function ASCIIArtBrowser({ onSendToTV }: ASCIIArtBrowserProps) {
  const [presets, setPresets] = useState<Record<string, ASCIIPreset>>({});
  const [selectedStyle, setSelectedStyle] = useState("retro_terminal");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [currentArtifact, setCurrentArtifact] = useState<ASCIIArtifact | null>(null);
  const [recentArtifacts, setRecentArtifacts] = useState<ASCIIListItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPresets();
    loadRecentArtifacts();
  }, []);

  const loadPresets = async () => {
    try {
      const presetsData = await getASCIIPresets();
      setPresets(presetsData);
    } catch (err) {
      console.error("Failed to load presets:", err);
      setError("Failed to load style presets");
    }
  };

  const loadRecentArtifacts = async () => {
    try {
      const artifacts = await listASCIIArtifacts(0, 10);
      setRecentArtifacts(artifacts);
    } catch (err) {
      console.error("Failed to load recent artifacts:", err);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      setSelectedFile(file);
      setError(null);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setConverting(true);
    setError(null);

    try {
      const artifact = await convertImageToASCII(selectedFile, selectedStyle);
      setCurrentArtifact(artifact);
      loadRecentArtifacts(); // Refresh recent list
    } catch (err) {
      console.error("Conversion failed:", err);
      setError(err instanceof Error ? err.message : "Conversion failed");
    } finally {
      setConverting(false);
    }
  };

  const handleSendToTV = () => {
    if (currentArtifact && onSendToTV) {
      onSendToTV(currentArtifact);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCurrentArtifact(null);
    setError(null);
  };

  return (
    <div className="ascii-art-browser">
      <h2>ASCII Art Generator</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="browser-layout">
        {/* Upload and Settings */}
        <div className="upload-section">
          <div className="file-upload">
            <label htmlFor="image-upload" className="upload-label">
              Select Image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="file-input"
            />
            {selectedFile && <span className="file-name">{selectedFile.name}</span>}
          </div>

          <div className="style-selector">
            <label htmlFor="style-select">Style Preset:</label>
            <select
              id="style-select"
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="style-select"
            >
              {Object.entries(presets).map(([key, preset]) => (
                <option key={key} value={key}>
                  {preset.name}
                </option>
              ))}
            </select>
            {presets[selectedStyle] && (
              <p className="preset-description">{presets[selectedStyle].description}</p>
            )}
          </div>

          <div className="action-buttons">
            <button onClick={handleConvert} disabled={!selectedFile || converting}>
              {converting ? "Converting..." : "Convert to ASCII"}
            </button>
            <button onClick={handleClear} disabled={!selectedFile && !currentArtifact}>
              Clear
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="preview-section">
          <div className="preview-container">
            {previewUrl && (
              <div className="image-preview">
                <h3>Original Image</h3>
                <img src={previewUrl} alt="Preview" />
              </div>
            )}

            {currentArtifact && (
              <div className="ascii-preview">
                <h3>
                  ASCII Art ({currentArtifact.width}x{currentArtifact.height})
                </h3>
                <pre className="ascii-display">{currentArtifact.ascii_art}</pre>
                {onSendToTV && (
                  <button onClick={handleSendToTV} className="send-to-tv-button">
                    📺 Send to TV Screen
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Artifacts */}
        <div className="recent-section">
          <h3>Recent Conversions</h3>
          <div className="recent-list">
            {recentArtifacts.length === 0 ? (
              <p className="empty-message">No recent conversions</p>
            ) : (
              <ul>
                {recentArtifacts.map((artifact) => (
                  <li key={artifact.id} className="recent-item">
                    <div className="recent-info">
                      <span className="recent-style">{artifact.preset_name}</span>
                      <span className="recent-dimensions">
                        {artifact.width}x{artifact.height}
                      </span>
                    </div>
                    <span className="recent-date">
                      {new Date(artifact.created_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
