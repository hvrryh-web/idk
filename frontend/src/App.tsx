import CharacterBrowser from './components/CharacterBrowser';
import TechniqueBrowser from './components/TechniqueBrowser';
import SimulationRunner from './components/SimulationRunner';

import './styles.css';

export default function App() {
  return (
    <main>
      <header>
        <h1>WuXuxian Control Panel</h1>
        <p>Browse characters and techniques, then kick off a simulation run.</p>
      </header>
      <section className="grid">
        <CharacterBrowser />
        <TechniqueBrowser />
      </section>
      <section className="runner-card">
        <SimulationRunner />
      </section>
    </main>
  );
}
