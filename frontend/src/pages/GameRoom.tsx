import { useNavigate } from "react-router-dom";
import { useState, useEffect, type ChangeEvent } from "react";
import { fetchCharacters, type ApiDiagnostics } from "../api";
import { saveAsciiArt, loadAsciiArt } from "../asciiStore";
import type { Character } from "../types";
import { BookOpen, HelpCircle, Users, Rocket, Maximize, Menu, ShieldCheck, Database, ServerCog, RefreshCcw } from "lucide-react";
import Button from "../components/Button";
import GameScreen from "../components/GameScreen";
import ChatBox from "../components/ChatBox";
import HUD from "../components/HUD";
import FullScreenMenu from "../components/FullScreenMenu";

const densityRamp = "@%#*+=-:. ";
const maxAsciiWidth = 80;

const convertImageToAscii = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      const scale = Math.min(maxAsciiWidth / image.width, 1);
      const width = Math.max(1, Math.floor(image.width * scale));
      const height = Math.max(1, Math.floor(image.height * scale * 0.5));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }

      ctx.drawImage(image, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height).data;
      let ascii = "";

      for (let y = 0; y < height; y += 1) {
        let row = "";
        for (let x = 0; x < width; x += 1) {
          const offset = (y * width + x) * 4;
          const r = imageData[offset];
          const g = imageData[offset + 1];
          const b = imageData[offset + 2];
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          const densityIndex = Math.floor((luminance / 255) * (densityRamp.length - 1));
          row += densityRamp[densityRamp.length - 1 - densityIndex];
        }
        ascii += `${row}\n`;
      }

      resolve(ascii.trimEnd());
    };

    image.onerror = () => reject(new Error("Failed to load image for conversion"));
    image.src = src;
  });
};

type GameRoomProps = {
  systemStatus?: ApiDiagnostics;
};

export default function GameRoom({ systemStatus }: GameRoomProps) {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const data = await fetchCharacters();
      setCharacters(data);
    } catch (error) {
      console.error("Failed to load characters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchAlphaTest = () => {
    if (characters.length > 0) {
      navigate(`/profile/${characters[0].id}`);
    } else {
      alert("No characters available. Please create a character first.");
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleMenuSelect = (optionId: string) => {
    console.log('Menu option selected:', optionId);
    // Handle menu navigation here
    if (optionId === 'character' && characters.length > 0) {
      navigate(`/profile/${characters[0].id}`);
    } else if (optionId === 'codex') {
      navigate('/wiki');
    }
  };

  const backendStatus = systemStatus?.health?.status === "ok" ? "online" : systemStatus?.apiError ? "error" : "checking";
  const dbStatus = systemStatus?.dbStatus?.db_status === "ok" ? "online" : systemStatus?.apiError ? "error" : "checking";

  const handleRecheckSystems = () => {
    if (systemStatus?.refresh) {
      systemStatus.refresh().catch(() => {
        /* handled in hook */
      });
    }
  };

  if (isFullScreen) {
    return (
      <div className="game-room-fullscreen-persona">
        {/* HUD Top Bar */}
        <HUD />
        {/* Main Game Content */}
        <div className="fullscreen-game-content">
          <GameScreen />
        </div>
        {/* Chat Box - Fixed Height Bottom */}
        <div className="fullscreen-chat-wrapper">
          <ChatBox />
        </div>
        {/* Full Screen Controls */}
        <div className="fullscreen-controls">
          <button className="fs-control-btn" onClick={() => setShowMenu(true)}>
            <Menu size={24} strokeWidth={2} />
          </button>
          <button className="fs-control-btn" onClick={toggleFullScreen}>
            <Maximize size={24} strokeWidth={2} />
          </button>
        </div>
        <FullScreenMenu 
          isOpen={showMenu} 
          onClose={() => setShowMenu(false)}
          onSelectOption={handleMenuSelect}
        />
      </div>
    );
  }

  return (
    <div className="game-room">
      <div className="hero-section">
        <h1>WuXuxian TTRPG</h1>
        <p className="subtitle">A Fire Emblem–inspired, Xianxia-themed Visual Novel TTRPG</p>
        <button className="fullscreen-toggle" onClick={toggleFullScreen}>
          <Maximize size={20} strokeWidth={2} />
          <span>Enter Full Screen Mode</span>
        </button>
      </div>
      <section className="alpha-proof">
        <div className="alpha-proof__header">
          <div>
            <p className="eyebrow">Romance of the Three Kingdoms Alpha</p>
            <h2 className="alpha-proof__title">Alpha Launch Readiness</h2>
            <p className="alpha-proof__subtitle">
              Backend + database heartbeat checks to keep the professional alpha UI stable.
            </p>
          </div>
          <div className="alpha-proof__actions">
            <Button
              variant="secondary"
              size="small"
              icon={RefreshCcw}
              onClick={handleRecheckSystems}
              disabled={!systemStatus}
            >
              Re-run checks
            </Button>
          </div>
        </div>
        <div className="alpha-proof__grid">
          <div className={`alpha-proof__card status-${backendStatus}`}>
            <div className="alpha-proof__card-title">
              <ShieldCheck size={20} strokeWidth={2} />
              <span>Backend API</span>
            </div>
            <div className="alpha-proof__value">
              {backendStatus === "online" ? "Operational" : backendStatus === "checking" ? "Checking..." : "Unavailable"}
            </div>
            <p className="alpha-proof__hint">Health endpoint: /health</p>
          </div>
          <div className={`alpha-proof__card status-${dbStatus}`}>
            <div className="alpha-proof__card-title">
              <Database size={20} strokeWidth={2} />
              <span>Database Link</span>
            </div>
            <div className="alpha-proof__value">
              {dbStatus === "online" ? "Connected" : dbStatus === "checking" ? "Checking..." : "Needs attention"}
            </div>
            <p className="alpha-proof__hint">Heartbeat: /db-status</p>
          </div>
        </div>
        <div className="alpha-proof__footer">
          <span className="alpha-proof__pill">
            <ServerCog size={16} strokeWidth={2} />
            {backendStatus === "online" && dbStatus === "online"
              ? "Systems proofed for alpha handoff"
              : "Verifying Three Kingdoms stack"}
          </span>
          {systemStatus?.apiError ? (
            <span className="alpha-proof__alert">{systemStatus.apiError}</span>
          ) : (
            <span className="alpha-proof__muted">
              Last status: {systemStatus?.lastStatus ? `HTTP ${systemStatus.lastStatus}` : "pending"}
            </span>
          )}
        </div>
      </section>
      <div className="game-room-layout">
        {/* Left Sidebar */}
        <aside className="game-sidebar">
          <div className="action-section">
            <Button
              variant="primary"
              size="large"
              icon={Rocket}
              onClick={handleLaunchAlphaTest}
              disabled={loading}
              className="launch-button-new"
            >
              LAUNCH ALPHA TEST
            </Button>
            {loading && <p className="loading-text">Loading characters...</p>}
            {!loading && characters.length === 0 && (
              <p className="warning">No characters found. Create a character to begin.</p>
            )}
          </div>
          <div className="character-roster">
            <h2>Available Characters</h2>
            {characters.length > 0 ? (
              <ul className="character-list">
                {characters.map((char) => (
                  <li key={char.id}>
                    <Button
                      variant="secondary"
                      size="medium"
                      icon={Users}
                      onClick={() => navigate(`/profile/${char.id}`)}
                    >
                      {char.name} ({char.type})
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              !loading && <p className="empty-state">No characters yet.</p>
            )}
          </div>
        </aside>
        <div className="quick-nav">
          <h3>Quick Navigation</h3>
          <nav>
            <Button
              variant="secondary"
              size="medium"
              icon={BookOpen}
              onClick={() => navigate("/wiki")}
            >
              Knowledge Wiki
            </Button>
            <Button
              variant="secondary"
              size="medium"
              icon={HelpCircle}
              onClick={() => navigate("/help")}
            >
              Help & Search
            </Button>
            <Button
              variant="secondary"
              size="medium"
              icon={Users}
              onClick={() => navigate("/characters")}
            >
              Character Manager
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
