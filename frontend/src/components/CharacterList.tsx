import { useEffect, useState } from "react";
import { fetchCharacters } from "../api";
import type { Character } from "../types";

type Props = {
  selectedId?: number;
  onSelect: (id: number) => void;
};

export default function CharacterList({ selectedId, onSelect }: Props) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCharacters()
      .then(setCharacters)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="panel">
      <h2>Characters</h2>
      {error && <p className="highlight">{error}</p>}
      <ul className="list">
        {characters.map((character) => (
          <li key={character.id}>
            <button
              style={{
                width: "100%",
                textAlign: "left",
                background: selectedId === character.id ? "#1d4ed8" : "#2563eb",
              }}
              onClick={() => onSelect(character.id)}
            >
              <div style={{ fontWeight: 600 }}>{character.name}</div>
              {character.rank && <span className="badge">{character.rank}</span>}
            </button>
          </li>
        ))}
        {characters.length === 0 && !error && <li>Loading characters…</li>}
      </ul>
    </div>
  );
}
