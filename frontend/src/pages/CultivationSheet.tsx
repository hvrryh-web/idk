import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchCharacter } from '../api';
import type { Character } from '../types';

export default function CultivationSheet() {
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
    <div className="cultivation-sheet">
      <header className="sheet-header">
        <h1>Cultivation Path: {character.name}</h1>
      </header>

      <section className="orientation">
        <h2>Cultivation Orientation</h2>
        <div className="orientation-grid">
          <div className="orientation-axis">
            <h3>Offensive vs Defensive</h3>
            <div className="axis-bar">
              <span className="marker placeholder" style={{ left: '65%' }}>●</span>
            </div>
            <div className="axis-labels">
              <span>Defensive</span>
              <span>Balanced</span>
              <span>Offensive</span>
            </div>
          </div>

          <div className="orientation-axis">
            <h3>Mind vs Body</h3>
            <div className="axis-bar">
              <span className="marker placeholder" style={{ left: '40%' }}>●</span>
            </div>
            <div className="axis-labels">
              <span>Mind</span>
              <span>Balanced</span>
              <span>Body</span>
            </div>
          </div>

          <div className="orientation-axis">
            <h3>Yin vs Yang</h3>
            <div className="axis-bar">
              <span className="marker placeholder" style={{ left: '50%' }}>●</span>
            </div>
            <div className="axis-labels">
              <span>Yin</span>
              <span>Balanced</span>
              <span>Yang</span>
            </div>
          </div>
        </div>
      </section>

      <section className="soul-core-progress">
        <h2>Soul Core Development</h2>
        <p className="description">
          Track your character's breakthroughs, insights, and cultivation milestones.
        </p>
        <div className="progress-stage placeholder">
          <strong>Current Stage:</strong> Foundation Establishment
        </div>
      </section>

      <section className="milestone-logbook">
        <h2>Milestone Logbook</h2>
        <ul className="milestone-list">
          <li className="milestone placeholder">
            <span className="milestone-date">Session 1</span>
            <span className="milestone-event">Awakened Soul Core</span>
          </li>
          <li className="milestone placeholder">
            <span className="milestone-date">Session 3</span>
            <span className="milestone-event">Mastered First Technique</span>
          </li>
          <li className="milestone placeholder">
            <span className="milestone-date">Session 5</span>
            <span className="milestone-event">Reached Foundation Stage</span>
          </li>
          <li className="milestone-add">
            <button>+ Add New Milestone</button>
          </li>
        </ul>
      </section>

      <nav className="sheet-navigation">
        <button onClick={() => navigate(`/profile/${id}`)}>← Profile Sheet</button>
        <button onClick={() => navigate(`/soul-core/${id}`)}>Soul Core Sheet →</button>
      </nav>
    </div>
  );
}
