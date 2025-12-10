import { useEffect, useState } from 'react';

type Technique = {
  id: string;
  name: string;
  tier: string;
  axis: string;
};

export default function TechniqueBrowser() {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/techniques')
      .then((res) => res.json())
      .then((data) => {
        setTechniques(data.items ?? []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading techniques...</p>;
  if (error) return <p>Failed to load techniques: {error}</p>;

  return (
    <div>
      <h2>Techniques</h2>
      <ul>
        {techniques.map((t) => (
          <li key={t.id}>
            <strong>{t.name}</strong> <em>({t.tier}, {t.axis})</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
