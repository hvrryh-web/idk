import { useEffect, useState } from 'react';
import SimulationRunner from './components/SimulationRunner';

import './styles.css';

type AppConfig = {
  title: string;
  instructions: string;
};

type ConfigCarrier = {
  __APP_CONFIG__?: Partial<AppConfig>;
};

const DEFAULT_CONFIG: AppConfig = {
  title: 'WuXuxian Control Panel',
  instructions: 'Browse the available data below, then launch a simulation run when you are ready.'
};

function loadRuntimeConfig(): AppConfig | null {
  const runtime = (window as unknown as ConfigCarrier).__APP_CONFIG__;

  if (!runtime?.title || !runtime.instructions) {
    return null;
  }

  return {
    title: runtime.title,
    instructions: runtime.instructions
  };
}

export default function App() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    const runtimeConfig = loadRuntimeConfig();

    if (runtimeConfig) {
      setConfig(runtimeConfig);
      return;
    }

    setConfig(DEFAULT_CONFIG);
    setConfigError('Runtime configuration missing; using built-in defaults.');
  }, []);

  if (!config) {
    return (
      <main>
        <p>Loading configuration...</p>
      </main>
    );
  }

  return (
    <main>
      <header>
        <h1>{config.title}</h1>
        <p>{config.instructions}</p>
        {configError && <p className="warning">{configError}</p>}
      </header>
      <section>
        <p>
          Enter the configuration ID and iteration count, then launch a run to see the simulation status and
          results.
        </p>
      </section>
      <section className="runner-card">
        <SimulationRunner />
      </section>
    </main>
  );
}
