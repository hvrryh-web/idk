import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createCharacter, fetchCharacters } from "../api";
import type { Character } from "../types";
import { BookOpen, HelpCircle, Users, Rocket, Maximize, Menu, ShieldCheck, Database, ServerCog, RefreshCcw } from "lucide-react";
import Button from "../components/Button";
import GameScreen from "../components/GameScreen";
import ChatBox from "../components/ChatBox";
import HUD from "../components/HUD";
import FullScreenMenu from "../components/FullScreenMenu";
import { SAMPLE_PCS } from "../data/sampleCharacters";
import CharacterAvatar from "../components/CharacterAvatar";

const calculateScl = (character: Partial<Character>): number => {
  const primaryStats = [
    character.strength ?? 0,
    character.dexterity ?? 0,
    character.constitution ?? 0,
    character.intelligence ?? 0,
    character.wisdom ?? 0,
    character.charisma ?? 0,
    character.perception ?? 0,
    character.resolve ?? 0,
    character.presence ?? 0,
  ];
  const primarySum = primaryStats.reduce((sum, val) => sum + val, 0);
  const aetherSum = (character.aether_fire ?? 0) + (character.aether_ice ?? 0) + (character.aether_void ?? 0);
  return Math.floor(primarySum / 9) + Math.floor((aetherSum / 3) * 0.5);
};

const buildCreatePayload = (template: Partial<Character>) => ({
  name: template.name,
  type: template.type ?? "pc",
  description: template.description,
  strength: template.strength,
  dexterity: template.dexterity,
  constitution: template.constitution,
  intelligence: template.intelligence,
  wisdom: template.wisdom,
  charisma: template.charisma,
  perception: template.perception,
  resolve: template.resolve,
  presence: template.presence,
  aether_fire: template.aether_fire,
  aether_ice: template.aether_ice,
  aether_void: template.aether_void,
  conditions: template.conditions,
  cost_tracks: template.cost_tracks,
});

export default function GameRoom() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [templateStatus, setTemplateStatus] = useState<string | null>(null);
  const [templateError, setTemplateError] = useState<string | null>(null);

  useEffect(() => {
    loadCharacters();
  }, []);

  // Removed previewUrl cleanup effect (was causing ReferenceError)

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

  const handleLaunchAlphaTest = async () => {
    if (characters.length > 0) {
      navigate(`/profile/${characters[0].id}`);
      return;
    }

    try {
      setTemplateStatus(SAMPLE_PCS[0].name || "Yin River Monk");
      const created = await createCharacter(buildCreatePayload(SAMPLE_PCS[0]));
      await loadCharacters();
      navigate(`/profile/${(created as any)?.id ?? ""}`);
    } catch (error) {
      console.error("Failed to create default template", error);
      alert("No characters available. Please create a character first.");
    } finally {
      setTemplateStatus(null);
    }
  };

  const handleUseTemplate = async (template: Partial<Character>) => {
    try {
      setTemplateError(null);
      setTemplateStatus(template.name || "");
      const created = await createCharacter(buildCreatePayload(template));
      await loadCharacters();
      navigate(`/profile/${(created as any)?.id ?? ""}`);
    } catch (error) {
      console.error("Failed to create template character", error);
      setTemplateError("Unable to add template character right now. Please try again.");
    } finally {
      setTemplateStatus(null);
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

          <div className="template-roster">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>Template Characters</h2>
              <button className="btn-create" onClick={() => navigate("/characters/create")}>
                Create Custom Character
              </button>
            </div>
            <p className="subtitle" style={{ marginTop: "-0.5rem" }}>
              Jump into the alpha with a ready-made hero, or craft your own.
            </p>
            {templateError && <p className="warning">{templateError}</p>}
            <div className="template-grid">
              {SAMPLE_PCS.map((template) => (
                <div key={template.name} className="template-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <CharacterAvatar avatar={template.avatar} name={template.name || ""} size="small" />
                    <div>
                      <h4 style={{ margin: 0 }}>{template.name}</h4>
                      <small>SCL: {calculateScl(template)}</small>
                    </div>
                  </div>
                  <p style={{ margin: "0.5rem 0 0.75rem 0" }}>{template.description}</p>
                  <button
                    className="btn-primary"
                    disabled={!!templateStatus}
                    onClick={() => handleUseTemplate(template)}
                  >
                    {templateStatus === template.name ? "Adding..." : "Use Template"}
                  </button>
                </div>
              ))}
            </div>
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
