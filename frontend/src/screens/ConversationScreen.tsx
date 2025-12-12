export default function ConversationScreen() {
  return (
    <div className="conversation-screen" style={{background: 'var(--parchment)', borderRadius: '18px', boxShadow: '0 4px 24px rgba(124,63,0,0.08)', border: '6px solid #c9b18a', fontFamily: 'Cinzel, serif', color: '#3a2c13', padding: '2rem', margin: '2rem 0'}}>
      {/* Background: 2–3 character busts with parallax, animated clothing/flags */}
      <div className="conversation-background">
        <img src="/assets/characters/lu-bu-yuto-sano.jpg" alt="Lu Bu" style={{width: '120px', borderRadius: '50%', margin: '0 12px'}} />
        <img src="/assets/characters/diao-chan-yuto-sano.jpg" alt="Diao Chan" style={{width: '120px', borderRadius: '50%', margin: '0 12px'}} />
      </div>
      {/* Dialogue Boxes: Silk scrolls, painterly rim light */}
      <div className="dialogue-boxes" style={{fontFamily: 'Cinzel, serif', background: 'var(--parchment)', border: '2px solid var(--imperial-gold)', borderRadius: '12px', padding: '1rem', margin: '1rem 0'}}>
        <span style={{color: 'var(--dynasty-red)'}}><strong>Guan Yu:</strong> "The river crossing is perilous, but our honor demands it!"</span>
      </div>
      {/* Reaction FX: Brushstroke slashes, petals, embers */}
      <div className="reaction-fx">
        <img src="/assets/brushstroke-fx.png" alt="Brushstroke FX" style={{width: '80px', opacity: 0.7}} />
      </div>
      {/* Choices UI: Jade plaques, wax-sealed slips */}
      <div className="choices-ui">
        <button style={{background: 'var(--jade-green)', color: '#fff', borderRadius: '6px', padding: '0.5rem 1rem', border: 'none', margin: '0 8px'}}>"Advance!"</button>
        <button style={{background: 'var(--imperial-gold)', color: '#fff', borderRadius: '6px', padding: '0.5rem 1rem', border: 'none', margin: '0 8px'}}>"Hold Position"</button>
      </div>
      {/* Navigation: Choice selection, dialogue progression controls */}
      <div className="navigation-controls">Navigation Controls Placeholder</div>
    </div>
  );
}
