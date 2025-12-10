import { useState } from 'react';
import CharacterDetail from './components/CharacterDetail';
import CharacterList from './components/CharacterList';
import SimulationRunner from './components/SimulationRunner';
import TechniqueList from './components/TechniqueList';

export default function App() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<number>();

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>Martial Roster</h1>
        <p style={{ margin: '0 0 1rem' }}>
          Minimal UI for browsing characters and running simulations.
        </p>
        <nav>
          <a href="#characters">Characters</a>
          <a href="#techniques">Techniques</a>
          <a href="#simulation">Simulation</a>
        </nav>
      </aside>

      <main className="main-content">
        <div className="grid" id="characters">
          <CharacterList selectedId={selectedCharacterId} onSelect={setSelectedCharacterId} />
          <CharacterDetail id={selectedCharacterId} />
        </div>

        <section id="techniques" style={{ marginTop: '1rem' }}>
          <TechniqueList />
        </section>

        <section id="simulation" style={{ marginTop: '1rem' }}>
          <SimulationRunner />
        </section>
      </main>
    </div>
  );
}
