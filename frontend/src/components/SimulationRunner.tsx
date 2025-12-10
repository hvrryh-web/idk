import { ChangeEvent, FormEvent, useMemo, useState } from 'react';

interface SimulationRunnerProps {
  availableScenarios?: string[];
}

interface SimulationRunnerState {
  selectedScenario: string;
  iterationCount: number;
  isRunning: boolean;
  lastResult?: SimulationResultPreview;
}

interface SimulationResultPreview {
  runId: string;
  status: 'pending' | 'completed' | 'failed';
  summary: string;
}

export default function SimulationRunner({ availableScenarios = [] }: SimulationRunnerProps) {
  const [state, setState] = useState<SimulationRunnerState>({
    selectedScenario: '',
    iterationCount: 100,
    isRunning: false
  });

  const scenarioOptions = useMemo(() => {
    if (availableScenarios.length > 0) {
      return availableScenarios;
    }

    return ['Default Scenario', 'Boss Rush', 'Speedrun', 'Endless'];
  }, [availableScenarios]);

  const handleScenarioChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    console.log('TODO: handle scenario selection', value);
    setState((prev) => ({ ...prev, selectedScenario: value }));
  };

  const handleIterationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    console.log('TODO: validate iteration count', value);
    setState((prev) => ({ ...prev, iterationCount: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('TODO: start simulation with backend wiring', state);
    setState((prev) => ({ ...prev, isRunning: true }));

    // TODO: replace with real simulation call once backend is connected
    const placeholderResult: SimulationResultPreview = {
      runId: `local-${Date.now()}`,
      status: 'pending',
      summary: 'Simulation result preview will appear here.'
    };

    setState((prev) => ({ ...prev, isRunning: false, lastResult: placeholderResult }));
  };

  return (
    <div className="simulation-runner">
      <h2>Simulation Runner</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Scenario
          <select
            value={state.selectedScenario}
            onChange={handleScenarioChange}
            required
          >
            <option value="" disabled>
              Select a scenario
            </option>
            {scenarioOptions.map((scenario) => (
              <option key={scenario} value={scenario}>
                {scenario}
              </option>
            ))}
          </select>
        </label>

        <label>
          Iterations
          <input
            type="number"
            min={1}
            value={state.iterationCount}
            onChange={handleIterationChange}
            required
          />
        </label>

        <button type="submit" disabled={state.isRunning}>
          {state.isRunning ? 'Starting…' : 'Start Simulation'}
        </button>
      </form>

      <section className="simulation-results">
        <h3>Results</h3>
        {state.lastResult ? (
          <div className="simulation-results__placeholder">
            <p>
              Run ID: <strong>{state.lastResult.runId}</strong>
            </p>
            <p>Status: {state.lastResult.status}</p>
            <p>{state.lastResult.summary}</p>
          </div>
        ) : (
          <p>No simulations run yet. Results will appear here.</p>
        )}
      </section>
    </div>
  );
}
