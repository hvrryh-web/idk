import { useNavigate } from "react-router-dom";
import { useState, useEffect, type ChangeEvent } from "react";
import { fetchCharacters } from "../api";
import { saveAsciiArt, loadAsciiArt } from "../asciiStore";
import type { Character } from "../types";
import { BookOpen, HelpCircle, Users, Rocket, Maximize, Menu } from "lucide-react";
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

export default function GameRoom() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    loadCharacters();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
