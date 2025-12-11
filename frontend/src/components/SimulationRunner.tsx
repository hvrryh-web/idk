import { useEffect, useMemo, useState } from "react";
import { fetchCharacters, fetchTechniques, runSimulation } from "../api";
import type { Character, SimulationResult, Technique } from "../types";

export default function SimulationRunner() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const [form, setForm] = useState({
    attacker_id: "",
    defender_id: "",
    technique_id: "",
  });

  useEffect(() => {
    fetchCharacters()
      .then(setCharacters)
      .catch((err: Error) => setError(err.message));
    fetchTechniques()
      .then(setTechniques)
      .catch((err: Error) => setError(err.message));
  }, []);

  const optionsReady = useMemo(
    () => characters.length > 0 && techniques.length > 0,
    [characters.length, techniques.length]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const payload = {
        attacker_id: Number(form.attacker_id),
        defender_id: Number(form.defender_id),
        technique_id: Number(form.technique_id),
      };
      const data = await runSimulation(payload);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Simulation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Simulation</h2>
        <span className="badge">POST /simulations</span>
      </div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="labelled">
          Attacker
          <select
            required
            value={form.attacker_id}
            onChange={(e) => setForm((prev) => ({ ...prev, attacker_id: e.target.value }))}
          >
            <option value="">Select attacker</option>
            {characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name}
              </option>
            ))}
          </select>
        </label>

        <label className="labelled">
          Defender
          <select
            required
            value={form.defender_id}
            onChange={(e) => setForm((prev) => ({ ...prev, defender_id: e.target.value }))}
          >
            <option value="">Select defender</option>
            {characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name}
              </option>
            ))}
          </select>
        </label>

        <label className="labelled">
          Technique
          <select
            required
            value={form.technique_id}
            onChange={(e) => setForm((prev) => ({ ...prev, technique_id: e.target.value }))}
          >
            <option value="">Choose a technique</option>
            {techniques.map((technique) => (
              <option key={technique.id} value={technique.id}>
                {technique.name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={!optionsReady || loading}>
          {loading ? "Running…" : "Run simulation"}
        </button>
      </form>

      {error && <p className="highlight">{error}</p>}

      {result && (
        <div className="highlight" style={{ marginTop: "1rem" }}>
          <h3>Result</h3>
          <p>{result.outcome}</p>
          <p>
            <strong>Attacker:</strong> {result.attacker.name}
          </p>
          <p>
            <strong>Defender:</strong> {result.defender.name}
          </p>
          <p>
            <strong>Technique:</strong> {result.technique.name}
          </p>
          {result.log && result.log.length > 0 && (
            <div>
              <h4>Log</h4>
              <ul className="list">
                {result.log.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
