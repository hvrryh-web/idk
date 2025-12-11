import React, { useState } from "react";
import { characters } from "../data/characters";

const designIterations = [
  { label: "Yuto Sano", suffix: "-yuto-sano.jpg" },
  { label: "Classic", suffix: "-classic.jpg" },
  { label: "Alt", suffix: "-alt.jpg" },
  { label: "Variant", suffix: "-variant.jpg" }
];

const loreNotes: Record<string, string[]> = {
  "lu-bu": [
    "Lu Bu was famed for his martial prowess and his legendary steed, Red Hare.",
    "His loyalty was often questioned, and he changed allegiances multiple times.",
    "Known for his duel with Dong Zhuo and tragic downfall."
  ],
  "diao-chan": [
    "Diao Chan is one of the Four Beauties of ancient China.",
    "Her intrigue played a pivotal role in the downfall of Dong Zhuo.",
    "Her story is a blend of history and legend, symbolizing beauty and cunning."
  ]
};

export default function CharacterCodex() {
  const [selectedChar, setSelectedChar] = useState(characters[0]);
  const [selectedTab, setSelectedTab] = useState(designIterations[0]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string|null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const reloadImages = () => setRefreshKey(k => k + 1);

  return (
    <div className="character-codex" style={{margin: '2rem 0', background: 'var(--parchment)', borderRadius: '18px', boxShadow: '0 4px 24px rgba(124,63,0,0.08)', border: '6px solid #c9b18a', fontFamily: 'Cinzel, serif', color: '#3a2c13', padding: '2rem'}}>
      <h2 style={{fontFamily: 'Cinzel, serif', color: '#7c3f00', borderBottom: '2px solid #c9b18a', paddingBottom: '0.5rem'}}>Character Codex</h2>
      <div style={{display: 'flex', gap: '2rem'}}>
        <div style={{minWidth: '180px'}}>
          <h3 style={{color: '#3a2c13'}}>Characters</h3>
          <ul style={{listStyle: 'none', padding: 0}}>
            {characters.map(char => (
              <li key={char.id}>
                <button
                  onClick={() => { setSelectedChar(char); setSelectedTab(designIterations[0]); }}
                  style={{
                    background: selectedChar.id === char.id ? '#c9b18a' : '#eae2d6',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    margin: '0.25rem 0',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = '#e6d3b3')}
                  onMouseOut={e => (e.currentTarget.style.background = selectedChar.id === char.id ? '#c9b18a' : '#eae2d6')}
                >{char.name}</button>
              </li>
            ))}
          </ul>
        </div>
        <div style={{flex: 1}}>
          <h3 style={{color: '#7c3f00'}}>{selectedChar.name}</h3>
          <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem'}}>
            {designIterations.map(iter => (
              <button key={iter.label} onClick={() => setSelectedTab(iter)} style={{background: selectedTab.label === iter.label ? '#7c3f00' : '#c9b18a', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', marginRight: '0.5rem', cursor: 'pointer', fontWeight: 600}}>{iter.label}</button>
            ))}
            <button
              style={{background: '#3a2c13', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', fontWeight: 600, boxShadow: loading ? '0 0 8px #d4af37' : undefined}}
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setFeedback(null);
                const variants = designIterations.map(iter => iter.suffix.replace('.jpg','').replace('-',''));
                try {
                  const res = await fetch('/api/assets/generate-character-variants', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      character_name: selectedChar.name,
                      variants: variants
                    })
                  });
                  if (res.ok) {
                    setFeedback('ComfyUI inspiration triggered for ' + selectedChar.name);
                    reloadImages();
                  } else {
                    setFeedback('Failed to trigger ComfyUI inspiration.');
                  }
                } catch (e) {
                  setFeedback('Error: ' + (e as Error).message);
                }
                setLoading(false);
              }}
            >{loading ? 'Generating...' : 'Inspiration (ComfyUI)'}</button>
          </div>
          <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap'}}>
            {designIterations.map(iter => (
              <div key={iter.label} style={{textAlign: 'center', position: 'relative', width: '120px'}}>
                <img
                  src={`/assets/characters/${selectedChar.id}${iter.suffix}?refresh=${refreshKey}`}
                  alt={selectedChar.name + ' ' + iter.label}
                  style={{width: '120px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.14)', marginBottom: '0.5rem', background: '#eae2d6', cursor: 'pointer', transition: 'box-shadow 0.2s'}}
                  onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120x180?text=No+Image'; }}
                  onMouseOver={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,63,0,0.18)')}
                  onMouseOut={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.14)')}
                />
                <div style={{fontSize: '0.95rem', color: '#7c3f00', fontWeight: 600}}>{iter.label}</div>
              </div>
            ))}
          </div>
          {feedback && <div style={{marginBottom: '1rem', color: feedback.includes('Failed') ? 'red' : '#3a2c13', fontWeight: 500, fontSize: '1.05rem', background: '#eae2d6', borderRadius: '8px', padding: '0.5rem 1rem'}}>{feedback}</div>}
          <div style={{marginBottom: '1rem'}}><strong>Faction:</strong> {selectedChar.faction}</div>
          <div style={{marginBottom: '1rem'}}><strong>Description:</strong> {selectedChar.description}</div>
          <div style={{marginBottom: '1rem'}}>
            <strong>Techniques:</strong>
            <ul style={{paddingLeft: '1rem', margin: 0}}>
              {selectedChar.techniques.map(tname => (
                <li key={tname} style={{marginBottom: '0.25rem'}}>
                  <span
                    style={{color: '#3a2c13', fontWeight: 500, cursor: 'help', borderBottom: '1px dotted #7c3f00'}}
                    title={tname + ' technique'}
                  >{tname}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{color: '#7c3f00'}}>Expanded Lore & History</h4>
            <ul style={{paddingLeft: '1rem'}}>
              {(loreNotes[selectedChar.id] || []).map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
