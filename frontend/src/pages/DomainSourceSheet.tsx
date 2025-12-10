import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchCharacter } from '../api';
import type { Character } from '../types';

export default function DomainSourceSheet() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCharacter(id);
    }
  }, [id]);

  const loadCharacter = async (characterId: string) => {
    try {
      const data = await fetchCharacter(Number(characterId));
      setCharacter(data);
    } catch (err) {
      console.error('Failed to load character:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!character) return <div className="error">Character not found</div>;

  return (
    <div className="domain-source-sheet">
      <header className="sheet-header">
        <h1>Domain Source: {character.name}</h1>
        <p className="subtitle">Your Unique Essence &amp; Source Sequence Technique</p>
      </header>

      <section className="domain-source">
        <h2>Domain Source</h2>
        <div className="source-card placeholder">
          <h3>Eternal Flame</h3>
          <p className="source-description">
            Your domain source is the concept of eternal, undying flame—a fire that
            burns not with heat alone, but with the essence of life itself. It is the
            spark of creation and the warmth of the sun, representing vitality,
            passion, and transformation.
          </p>
          
          <div className="source-properties">
            <h4>Properties</h4>
            <ul>
              <li><strong>Element:</strong> Fire (Yang-aligned)</li>
              <li><strong>Concept:</strong> Rebirth, Vitality, Transformation</li>
              <li><strong>Manifestation:</strong> Phoenix-like flames that heal and destroy</li>
            </ul>
          </div>

          <div className="source-narrative">
            <h4>Narrative Essence</h4>
            <p>
              When you channel your Domain Source, flames of gold and crimson surround you.
              These are not ordinary flames—they carry the warmth of life itself. Allies
              near you feel invigorated, while enemies feel their will to fight drain away.
            </p>
          </div>
        </div>
      </section>

      <section className="source-sequence">
        <h2>Source Sequence Technique</h2>
        <div className="technique-card placeholder">
          <h3>Phoenix Rebirth Sequence</h3>
          <p className="technique-type">Soul Core Ultimate Technique</p>
          
          <div className="technique-description">
            <p>
              The ultimate expression of your Domain Source—a multi-stage technique that
              mirrors the legendary phoenix's cycle of death and rebirth.
            </p>
          </div>

          <div className="technique-stages">
            <h4>Sequence Stages</h4>
            
            <div className="stage">
              <strong>Stage 1: Ignition</strong>
              <p>Channel qi to create a protective aura of flame</p>
              <p className="mechanics">Cost: 5 AE | Effect: +0.15 DR for 3 rounds</p>
            </div>

            <div className="stage">
              <strong>Stage 2: Immolation</strong>
              <p>Release accumulated flame in a devastating explosion</p>
              <p className="mechanics">Cost: 10 AE | Effect: 40 AoE damage to all enemies</p>
            </div>

            <div className="stage">
              <strong>Stage 3: Rebirth</strong>
              <p>From the ashes, restore vitality to yourself and allies</p>
              <p className="mechanics">Cost: 15 AE | Effect: Restore 50 HP to all party members</p>
            </div>
          </div>

          <div className="technique-rules">
            <h4>Rules Text</h4>
            <p>
              <strong>Activation:</strong> Must be at or below 50% HP to initiate.<br />
              <strong>Duration:</strong> Full sequence takes 3 rounds to complete.<br />
              <strong>Cooldown:</strong> Cannot use again for 10 rounds after completion.<br />
              <strong>Special:</strong> If reduced to 0 HP during sequence, automatically complete
              Stage 3 and restore to 25% HP (once per combat).
            </p>
          </div>
        </div>
      </section>

      <nav className="sheet-navigation">
        <button onClick={() => navigate(`/soul-core/${id}`)}>← Soul Core Sheet</button>
        <button onClick={() => navigate(`/profile/${id}`)}>Back to Profile</button>
      </nav>
    </div>
  );
}
