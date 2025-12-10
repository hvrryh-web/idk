import { useEffect, useState } from 'react';
import { fetchCharacter } from '../api';
import type { Character } from '../types';

type Props = {
  id?: number;
};

export default function CharacterDetail({ id }: Props) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setCharacter(null);
    fetchCharacter(id)
      .then(setCharacter)
      .catch((err: Error) => setError(err.message));
  }, [id]);

  if (!id) {
    return (
      <div className="panel">
        <p>Select a character to see details.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      {error && <p className="highlight">{error}</p>}
      {character ? (
        <>
          <h2>{character.name}</h2>
          {character.rank && <p className="badge">{character.rank}</p>}
          {character.description && <p>{character.description}</p>}
          {character.techniques && character.techniques.length > 0 ? (
            <div>
              <h3>Techniques</h3>
              <ul className="list">
                {character.techniques.map((technique) => (
                  <li key={technique.id}>
                    <div style={{ fontWeight: 600 }}>{technique.name}</div>
                    {technique.description && <div>{technique.description}</div>}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No techniques listed.</p>
          )}
        </>
      ) : (
        <p>Loading details…</p>
      )}
    </div>
  );
}
