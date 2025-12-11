import { useState, useRef } from "react";

interface DiceTrayProps {
  // Optionally pass props for integration
}

  const [numDice, setNumDice] = useState(1);
  const [diceSides, setDiceSides] = useState(6);
  const [modifier, setModifier] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const nat20AudioRef = useRef<HTMLAudioElement>(null);

  function rollDice() {
    const rolls = Array.from({ length: numDice }, () => Math.floor(Math.random() * diceSides) + 1);
    const sum = rolls.reduce((acc, val) => acc + val, 0) + modifier;
    setResults(rolls);
    setTotal(sum);
    // Play SFX if any die is a natural 20
    if (diceSides === 20 && rolls.includes(20) && nat20AudioRef.current) {
      nat20AudioRef.current.currentTime = 0;
      nat20AudioRef.current.play();
    }
  }

  return (
    <div className="dice-tray" style={{background: 'var(--parchment)', borderRadius: '14px', boxShadow: '0 2px 12px rgba(124,63,0,0.08)', border: '4px solid #c9b18a', fontFamily: 'Cinzel, serif', color: '#3a2c13', padding: '1rem', margin: '1rem 0', minWidth: '260px', maxWidth: '320px'}}>
      <audio ref={nat20AudioRef} src="/assets/sfx/nat20.mp3" preload="auto" />
      <div style={{marginBottom: '0.5rem', fontWeight: 600, fontSize: '1.1rem', textAlign: 'center'}}>Dice Rolling Tray</div>
      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem'}}>
        <label style={{flex: 1}}>
          Dice:
          <input type="number" min={1} max={20} value={numDice} onChange={e => setNumDice(Number(e.target.value))} style={{width: '48px', marginLeft: '0.5rem', borderRadius: '6px', border: '2px solid #c9b18a', padding: '0.25rem'}} />
        </label>
        <label style={{flex: 1}}>
          Sides:
          <input type="number" min={2} max={100} value={diceSides} onChange={e => setDiceSides(Number(e.target.value))} style={{width: '48px', marginLeft: '0.5rem', borderRadius: '6px', border: '2px solid #c9b18a', padding: '0.25rem'}} />
        </label>
      </div>
      <div style={{marginBottom: '0.5rem'}}>
        <label>
          Modifier:
          <input type="number" value={modifier} onChange={e => setModifier(Number(e.target.value))} style={{width: '60px', marginLeft: '0.5rem', borderRadius: '6px', border: '2px solid #c9b18a', padding: '0.25rem'}} />
        </label>
      </div>
      <button onClick={rollDice} style={{background: '#7c3f00', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', fontWeight: 600, cursor: 'pointer', width: '100%'}}>Roll</button>
      <div style={{marginTop: '0.75rem', textAlign: 'center'}}>
        {results.length > 0 && (
          <div>
            <div style={{marginBottom: '0.25rem'}}>Rolls: {results.join(", ")}</div>
            <div style={{fontWeight: 700, fontSize: '1.2rem'}}>Total: {total}</div>
          </div>
        )}
      </div>
    </div>
  );
}
