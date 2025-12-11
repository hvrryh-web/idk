import React from "react";
import { characters } from "../data/characters";
import { techniques } from "../data/techniques";

export default function CharacterPreview() {
  return (
    <div className="character-preview-ui" style={{display: 'flex', gap: '2rem', margin: '2rem 0'}}>
      {characters.map(char => (
        <div key={char.id} style={{background: '#f8f5ef', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', padding: '1rem', width: '260px'}}>
          <img src={char.portrait} alt={char.name} style={{width: '120px', borderRadius: '50%', marginBottom: '1rem'}} />
          <h3 style={{margin: '0 0 0.5rem 0'}}>{char.name}</h3>
          <div style={{fontStyle: 'italic', color: '#7c3f00', marginBottom: '0.5rem'}}>{char.faction}</div>
          <div style={{marginBottom: '0.5rem'}}>{char.description}</div>
          <div>
            <strong>Techniques:</strong>
            <ul style={{paddingLeft: '1rem'}}>
              {char.techniques.map(tid => {
                const tech = techniques.find(t => t.name === tid);
                return tech ? (
                  <li key={tech.id}><span style={{color: '#3a2c13'}}>{tech.name}</span>: <span style={{color: '#7c3f00'}}>{tech.description}</span></li>
                ) : null;
              })}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
