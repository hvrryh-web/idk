import { useNavigate } from "react-router-dom";

// Table of contents for the wiki
const wikiToc = [
  {
    section: "SRD Alpha (NEW)",
    articles: [
      { id: "srd-history", title: "📖 SRD History - Game Dev Evolution" },
      { id: "srd-structure", title: "🏗️ SRD Alpha Structure" },
      { id: "srd-patch-01", title: "📄 Patch 0.1 - Introduction, Stats & SCL" },
      { id: "srd-patch-02", title: "📄 Patch 0.2 - Combat & Conflict Types" },
    ],
  },
  {
    section: "Getting Started",
    articles: [
      { id: "character-creation", title: "Character Creation" },
      { id: "cultivation-basics", title: "Cultivation Basics" },
      { id: "first-session", title: "Your First Session" },
    ],
  },
  {
    section: "Core Mechanics",
    articles: [
      { id: "soul-core", title: "Soul Core System" },
      { id: "combat-system", title: "Combat System" },
      { id: "techniques", title: "Techniques Guide" },
      { id: "quick-actions", title: "Quick Actions" },
      { id: "action-economy", title: "Action Economy (AE)" },
    ],
  },
  {
    section: "Setting & Lore",
    articles: [
      { id: "domain-source", title: "Domain Sources" },
      { id: "cultivation-stages", title: "Cultivation Stages" },
      { id: "world-overview", title: "World Overview" },
      { id: "factions", title: "Factions & Organizations" },
    ],
  },
  {
    section: "Advanced Rules",
    articles: [
      { id: "fate-cards", title: "Fate Cards System" },
      { id: "boss-battles", title: "Boss Battle Mechanics" },
      { id: "effect-modules", title: "Effect Modules" },
      { id: "simulation", title: "Combat Simulation" },
    ],
  },
];

export default function WikiIndex() {
  const navigate = useNavigate();

  return (
    <div className="wiki-index" style={{background: 'var(--parchment)', borderRadius: '18px', boxShadow: '0 4px 24px rgba(124,63,0,0.08)', border: '6px solid #c9b18a', fontFamily: 'Cinzel, serif', color: '#3a2c13', padding: '2rem', margin: '2rem 0'}}>
      <header className="page-header">
        <h1>Knowledge Wiki</h1>
        <p className="subtitle">System Reference Document (SRD)</p>
      </header>

      <div className="wiki-intro">
        <p>
          Welcome to the WuXuxian TTRPG knowledge base. This wiki contains all the rules, mechanics,
          and setting information you need to play the game.
        </p>
        <button onClick={() => navigate("/help")}>🔍 Search the Wiki</button>
      </div>

      <div className="toc">
        {wikiToc.map((section) => (
          <section key={section.section} className="toc-section">
            <h2>{section.section}</h2>
            <ul>
              {section.articles.map((article) => (
                <li key={article.id}>
                  <button onClick={() => navigate(`/wiki/${article.id}`)}>{article.title}</button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="wiki-footer">
        <button onClick={() => navigate("/")}>← Back to Game Room</button>
        <button onClick={() => navigate("/srd")}>View as SRD Book</button>
      </div>
    </div>
  );
}
