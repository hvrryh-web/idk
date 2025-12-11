import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchCharacters } from "../api";
import type { Character } from "../types";
import { BookOpen, HelpCircle, Users, Rocket, Maximize, Menu } from "lucide-react";
import Button from "../components/Button";
import GameScreen from "../components/GameScreen";
import ChatBox from "../components/ChatBox";
import HUD from "../components/HUD";
import FullScreenMenu from "../components/FullScreenMenu";

export default function GameRoom() {
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
    // Navigate to the first character's profile, or show character selection
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
      <div className="game-room-fullscreen">
        <HUD />
        <GameScreen />
        <ChatBox />
        
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
        </aside>

        {/* Center Content - Game Screen and Chat */}
        <main className="game-main-content">
          <GameScreen />
          <ChatBox />
        </main>
      </div>
    </div>
  );
}
