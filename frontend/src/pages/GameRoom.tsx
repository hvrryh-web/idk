import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchCharacters } from "../api";
import type { Character } from "../types";
import { BookOpen, HelpCircle, Users, Rocket, Maximize, Menu, ShieldCheck, Database, ServerCog } from "lucide-react";
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
    <div className="game-room" style={{background: 'var(--parchment)', borderRadius: '18px', boxShadow: '0 4px 24px rgba(124,63,0,0.08)', border: '6px solid #c9b18a', fontFamily: 'Cinzel, serif', color: '#3a2c13', padding: '2rem', margin: '2rem 0'}}>
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
        </div>
        <div className="alpha-proof__grid">
          <div className="alpha-proof__card status-checking">
            <div className="alpha-proof__card-title">
              <ShieldCheck size={20} strokeWidth={2} />
              <span>Backend API</span>
            </div>
            <div className="alpha-proof__value">
              Ready
            </div>
            <p className="alpha-proof__hint">Health endpoint: /health</p>
          </div>
          <div className="alpha-proof__card status-checking">
            <div className="alpha-proof__card-title">
              <Database size={20} strokeWidth={2} />
              <span>Database Link</span>
            </div>
            <div className="alpha-proof__value">
              Ready
            </div>
            <p className="alpha-proof__hint">Heartbeat: /db-status</p>
          </div>
        </div>
        <div className="alpha-proof__footer">
          <span className="alpha-proof__pill">
            <ServerCog size={16} strokeWidth={2} />
            Systems ready for Three Kingdoms alpha
          </span>
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

          <div className="quick-nav">
            <h3>Quick Navigation</h3>
            <nav>
              <Button
                variant="secondary"
                size="medium"
                icon={BookOpen}
                onClick={() => navigate("/wiki")}
              >
                Open Knowledge Wiki
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

        {/* Main Content or additional quick nav */}
        <div className="quick-nav">
          <h3>Quick Navigation</h3>
          <nav>
            <button onClick={() => navigate("/wiki")}>Wiki Home</button>
            <button onClick={() => navigate("/help")}>Help Center</button>
            <button onClick={() => navigate("/characters")}>Manage Characters</button>
            <button onClick={() => navigate("/ascii-art")}>🎨 ASCII Art Generator</button>
          </nav>
        </div>
      </div>
    </div>
  );
}
