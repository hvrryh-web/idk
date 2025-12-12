// ...existing code...

export default function MapScreen() {
  return (
    <div className="map-screen" style={{background: 'var(--parchment)', borderRadius: '18px', boxShadow: '0 4px 24px rgba(124,63,0,0.08)', border: '6px solid #c9b18a', fontFamily: 'Cinzel, serif', color: '#3a2c13', padding: '2rem', margin: '2rem 0'}}>
      {/* Background: Ink-wash world map, parchment texture */}
      <div className="map-background">
        <img src="/assets/map-bg.jpg" alt="Ink-wash World Map" style={{width: '100%', borderRadius: '12px'}} />
      </div>
      {/* Province Nodes: Lacquered plaques, banners for faction colors/crests */}
      <div className="province-nodes">
        <img src="/assets/jade-plaque.png" alt="Province Node" style={{width: '80px', margin: '0 8px'}} />
        <img src="/assets/jade-plaque.png" alt="Province Node" style={{width: '80px', margin: '0 8px'}} />
        <img src="/assets/banner.png" alt="Faction Banner" style={{width: '60px', margin: '0 8px'}} />
      </div>
      {/* UI Ribbon: Resource bars, date/season indicator (bamboo slips) */}
      <div className="ui-ribbon">
        <img src="/assets/jade-plaque.png" alt="Resource Bar" style={{width: '120px', margin: '0 8px'}} />
        <span style={{fontFamily: 'Cinzel, serif', color: '#d4af37'}}>Spring, 220 AD</span>
      </div>
      {/* Animated Clouds: Overlay for atmosphere */}
      <div className="cloud-overlay">
        <img src="/assets/brushstroke-fx.png" alt="Cloud FX" style={{width: '100%', opacity: 0.3}} />
      </div>
      {/* Navigation: Clickable province nodes, zoom/pan controls */}
      <div className="navigation-controls">
        <button style={{background: 'var(--jade-green)', color: '#fff', borderRadius: '6px', padding: '0.5rem 1rem', border: 'none'}}>Zoom In</button>
        <button style={{background: 'var(--imperial-gold)', color: '#fff', borderRadius: '6px', padding: '0.5rem 1rem', border: 'none', marginLeft: '8px'}}>Zoom Out</button>
      </div>
    </div>
  );
}
