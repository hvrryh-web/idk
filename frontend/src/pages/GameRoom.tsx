import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchCharacters } from "../api";
import type { Character } from "../types";
import { Home, Sword, BookOpen, HelpCircle, Users, Rocket } from "lucide-react";

export default function GameRoom() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="game-room">
      <div className="hero-section">
        <h1>WuXuxian TTRPG</h1>
        <p className="subtitle">A Fire Emblem–inspired, Xianxia-themed Visual Novel TTRPG</p>
      </div>

      <div className="action-section">
        <button className="launch-button" onClick={handleLaunchAlphaTest} disabled={loading}>
          <Rocket size={24} strokeWidth={2} />
          LAUNCH ALPHA TEST
        </button>
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
                <button onClick={() => navigate(`/profile/${char.id}`)}>
                  <Users size={20} strokeWidth={2} />
                  <span>{char.name} ({char.type})</span>
                </button>
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
          <button onClick={() => navigate("/wiki")} className="nav-button">
            <BookOpen size={20} strokeWidth={2} />
            <span>Knowledge Wiki</span>
          </button>
          <button onClick={() => navigate("/help")} className="nav-button">
            <HelpCircle size={20} strokeWidth={2} />
            <span>Help & Search</span>
          </button>
          <button onClick={() => navigate("/characters")} className="nav-button">
            <Users size={20} strokeWidth={2} />
            <span>Character Manager</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
