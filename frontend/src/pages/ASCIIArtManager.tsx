import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ASCIIArtBrowser from "../components/ASCIIArtBrowser";
import ASCIITVScreen from "../components/ASCIITVScreen";
import type { ASCIIArtifact } from "../types";
import "../styles/ASCIIArtManager.css";

export default function ASCIIArtManager() {
  const navigate = useNavigate();
  const [currentTVArtifact, setCurrentTVArtifact] = useState<ASCIIArtifact | null>(null);
  const [showTV, setShowTV] = useState(true);

  const handleSendToTV = (artifact: ASCIIArtifact) => {
    setCurrentTVArtifact(artifact);
    setShowTV(true);
  };

  return (
    <div className="ascii-art-manager">
      <header className="ascii-manager-header">
        <h1>ASCII Art Generator - GM Console</h1>
        <nav className="ascii-nav">
          <button onClick={() => navigate("/tools-hub")}>← Back to Tools</button>
          <button onClick={() => navigate("/game")}>🎮 Game Screen</button>
          <button onClick={() => navigate("/home")}>🏠 Home</button>
          <button onClick={() => setShowTV(!showTV)}>
            {showTV ? "📺 Hide TV" : "📺 Show TV"}
          </button>
        </nav>
      </header>

      <div className={`ascii-manager-layout ${showTV ? "with-tv" : ""}`}>
        {/* GM Control Panel */}
        <div className="gm-panel">
          <ASCIIArtBrowser onSendToTV={handleSendToTV} />
        </div>

        {/* TV Screen Display */}
        {showTV && (
          <div className="tv-panel">
            <h2>TV Screen Preview</h2>
            <ASCIITVScreen artifact={currentTVArtifact} />
          </div>
        )}
      </div>
    </div>
  );
}
