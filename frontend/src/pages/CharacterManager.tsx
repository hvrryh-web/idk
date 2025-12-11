import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CharacterDetail from "../components/CharacterDetail";
import CharacterList from "../components/CharacterList";
import SimulationRunner from "../components/SimulationRunner";
import TechniqueList from "../components/TechniqueList";

export default function CharacterManager() {
  const navigate = useNavigate();
  const [selectedCharacterId, setSelectedCharacterId] = useState<number>();

  return (
    <div className="character-manager" style={{background: 'var(--parchment)', borderRadius: '18px', boxShadow: '0 4px 24px rgba(124,63,0,0.08)', border: '6px solid #c9b18a', fontFamily: 'Cinzel, serif', color: '#3a2c13', padding: '2rem', margin: '2rem 0'}}>
      <header className="page-header">
        <h1>Character & Simulation Manager</h1>
        <div className="header-actions">
          <button onClick={() => navigate("/characters/create")} className="btn-create">
            + Create Character
          </button>
          <button onClick={() => navigate("/")}>← Back to Game Room</button>
        </div>
      </header>

      <div className="grid" id="characters">
        <CharacterList selectedId={selectedCharacterId} onSelect={setSelectedCharacterId} />
        <CharacterDetail id={selectedCharacterId} />
      </div>

      <section id="techniques" style={{ marginTop: "1rem" }}>
        <TechniqueList />
      </section>

      <section id="simulation" style={{ marginTop: "1rem" }}>
        <SimulationRunner />
      </section>
    </div>
  );
}
