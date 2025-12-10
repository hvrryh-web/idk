import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchCharacter } from '../api';
import type { Character } from '../types';

export default function SoulCoreSheet() {
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
    <div className="soul-core-sheet">
      <header className="sheet-header">
        <h1>Soul Core: {character.name}</h1>
        <p className="subtitle">Detailed Abilities Breakdown</p>
      </header>

      <section className="core-essence">
        <h2>Core Essence</h2>
        <div className="essence-description placeholder">
          <p>
            Your Soul Core is the manifestation of your cultivation path and inner dao.
            It defines your unique abilities and how you interact with the world's qi.
          </p>
          <p>
            <strong>Core Type:</strong> Elemental Manifestation
          </p>
          <p>
            <strong>Primary Affinity:</strong> Fire / Yang
          </p>
        </div>
      </section>

      <section className="core-abilities">
        <h2>Core Abilities</h2>
        <div className="ability-list">
          <div className="ability-card placeholder">
            <h3>Flame Step</h3>
            <p className="ability-type">Movement Ability</p>
            <p className="ability-description">
              Channel qi through your legs to create explosive bursts of speed,
              leaving trails of flame in your wake.
            </p>
            <div className="ability-mechanics">
              <strong>Effect:</strong> +2 SPD band for one round, deal 5 fire damage to adjacent enemies
            </div>
          </div>

          <div className="ability-card placeholder">
            <h3>Phoenix Heart</h3>
            <p className="ability-type">Passive Ability</p>
            <p className="ability-description">
              Your core burns with eternal flame. When reduced below 30% HP, gain temporary DR boost.
            </p>
            <div className="ability-mechanics">
              <strong>Effect:</strong> +0.2 DR when HP &lt; 30%
            </div>
          </div>

          <div className="ability-card placeholder">
            <h3>Inferno Strike</h3>
            <p className="ability-type">Active Technique</p>
            <p className="ability-description">
              Concentrate your soul core's power into a devastating fire attack.
            </p>
            <div className="ability-mechanics">
              <strong>Cost:</strong> 8 AE<br />
              <strong>Effect:</strong> Deal 30 fire damage, apply burning (5 damage/round for 3 rounds)
            </div>
          </div>
        </div>
      </section>

      <section className="activation-conditions">
        <h2>Activation Conditions</h2>
        <ul className="conditions-list placeholder">
          <li>Core abilities unlock at Foundation Establishment stage</li>
          <li>Advanced techniques require 50+ AE maximum</li>
          <li>Ultimate ability unlocks at Core Formation stage</li>
        </ul>
      </section>

      <nav className="sheet-navigation">
        <button onClick={() => navigate(`/cultivation/${id}`)}>← Cultivation Sheet</button>
        <button onClick={() => navigate(`/domain-source/${id}`)}>Domain Source →</button>
      </nav>
    </div>
  );
}
