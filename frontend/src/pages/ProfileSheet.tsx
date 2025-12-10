import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchCharacter } from '../api';
import type { Character } from '../types';

export default function ProfileSheet() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCharacter(id);
    }
  }, [id]);

  const loadCharacter = async (characterId: string) => {
    try {
      setLoading(true);
      const data = await fetchCharacter(Number(characterId));
      setCharacter(data);
      setError(null);
    } catch (err) {
      setError('Failed to load character');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading character...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!character) return <div className="error">Character not found</div>;

  return (
    <div className="profile-sheet">
      <header className="sheet-header">
        <h1>{character.name}</h1>
        <p className="character-type">{character.type}</p>
      </header>

      <section className="need-to-know">
        <h2>Need-to-Know to Play Now</h2>
        <div className="info-grid">
          <div className="info-item">
            <strong>Type:</strong> {character.type}
          </div>
          <div className="info-item">
            <strong>Cultivation Stage:</strong> <span className="placeholder">Foundation</span>
          </div>
          <div className="info-item">
            <strong>Primary Element:</strong> <span className="placeholder">Fire</span>
          </div>
          <div className="info-item">
            <strong>Combat Style:</strong> <span className="placeholder">Offensive</span>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <h2>Core Statistics</h2>
        <div className="stats-grid">
          <div className="stat">
            <span className="stat-label">Total HP</span>
            <span className="stat-value placeholder">100</span>
          </div>
          <div className="stat">
            <span className="stat-label">Action Energy</span>
            <span className="stat-value placeholder">20</span>
          </div>
          <div className="stat">
            <span className="stat-label">Defense Rating</span>
            <span className="stat-value placeholder">0.3</span>
          </div>
          <div className="stat">
            <span className="stat-label">Speed Band</span>
            <span className="stat-value placeholder">Fast</span>
          </div>
        </div>
      </section>

      <nav className="sheet-navigation">
        <button onClick={() => navigate(`/cultivation/${id}`)}>
          → Cultivation Sheet
        </button>
        <button onClick={() => navigate(`/soul-core/${id}`)}>
          → Soul Core Sheet
        </button>
        <button onClick={() => navigate(`/domain-source/${id}`)}>
          → Domain Source Sheet
        </button>
        <button onClick={() => navigate('/')}>← Back to Game Room</button>
      </nav>
    </div>
  );
}
