import { FormEvent, useState } from 'react';

type SimulationResult = {
  id: string;
  status: string;
  result?: Record<string, unknown>;
};

export default function SimulationRunner() {
  const [configId, setConfigId] = useState('');
  const [iterations, setIterations] = useState(1000);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    fetch('/api/v1/simulations/runs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config_id: configId, iterations })
    })
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div>
      <h2>Simulation Runner</h2>
      <form onSubmit={run}>
        <label>
          Config ID
          <input value={configId} onChange={(e) => setConfigId(e.target.value)} required />
        </label>
        <label>
          Iterations
          <input
            type="number"
            value={iterations}
            min={1}
            onChange={(e) => setIterations(Number(e.target.value))}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Running...' : 'Run simulation'}
        </button>
      </form>
      {error && <p>Failed to run: {error}</p>}
      {result && (
        <div>
          <p>
            Run {result.id} – status: <strong>{result.status}</strong>
          </p>
          {result.result && <pre>{JSON.stringify(result.result, null, 2)}</pre>}
        </div>
      )}
    </div>
  );
}
