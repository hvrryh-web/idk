import { useEffect, useState } from 'react';

type Character = {
  id: string;
  name: string;
  type: string;
};

export default function CharacterBrowser() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/characters')
      .then((res) => res.json())
      .then((data) => {
        setCharacters(data.items ?? []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading characters...</p>;
  if (error) return <p>Failed to load characters: {error}</p>;

  return (
    <div>
      <h2>Characters</h2>
      <ul>
        {characters.map((c) => (
          <li key={c.id}>
            <strong>{c.name}</strong> <em>({c.type})</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
