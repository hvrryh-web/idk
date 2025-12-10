import { useEffect, useState } from "react";

type Character = {
  id: string;
  name: string;
  type: string;
  level?: number;
  description?: string;
};

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCharacters = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/v1/characters");
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      const data = await res.json();
      setCharacters(data);
    } catch (err: any) {
      setError(err.message ?? "Failed to load characters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  return (
    <main
      style={{ fontFamily: "sans-serif", padding: "1.5rem", maxWidth: 800, margin: "0 auto" }}
    >
      <header style={{ marginBottom: "1rem" }}>
        <h1>WuXuxian TTRPG – Characters</h1>
        <button onClick={loadCharacters} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </header>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {characters.length === 0 && !loading && <div>No characters yet.</div>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {characters.map((c) => (
          <li
            key={c.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: "0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            <div style={{ fontWeight: 600 }}>{c.name}</div>
            <div>Type: {c.type}</div>
            {c.level !== undefined && <div>Level: {c.level}</div>}
            {c.description && <div style={{ color: "#444" }}>{c.description}</div>}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
