import { useEffect, useState } from "react";
import { fetchTechniques } from "../api";
import type { Technique } from "../types";

export default function TechniqueList() {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTechniques()
      .then(setTechniques)
      .catch((err: Error) => setError(err.message));
  }, []);

    return (
      <div className="technique-list" style={{background: 'var(--parchment)', borderRadius: '14px', boxShadow: '0 2px 12px rgba(124,63,0,0.08)', border: '4px solid #c9b18a', fontFamily: 'Cinzel, serif', color: '#3a2c13', padding: '1rem', margin: '1rem 0'}}>
      <h2>Techniques</h2>
      {error && <p className="highlight">{error}</p>}
      <ul className="list">
        {techniques.map((technique) => (
          <li key={technique.id}>
            <div style={{ fontWeight: 600 }}>{technique.name}</div>
            {technique.description && <div>{technique.description}</div>}
            <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.9rem" }}>
              {technique.damage !== undefined && <span>Damage: {technique.damage}</span>}
              {technique.cost !== undefined && <span>Cost: {technique.cost}</span>}
            </div>
          </li>
        ))}
        {techniques.length === 0 && !error && <li>Loading techniques…</li>}
      </ul>
    </div>
  );
}
