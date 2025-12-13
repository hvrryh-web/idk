import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HelpPage.css";

// Sample wiki data for searching
const wikiArticles = [
  {
    id: "cultivation-basics",
    title: "Cultivation Basics",
    category: "Mechanics",
    excerpt: "Learn the fundamentals of cultivation in the xianxia world.",
    icon: "🌱",
  },
  {
    id: "soul-core",
    title: "Soul Core System",
    category: "Mechanics",
    excerpt: "Understanding your Soul Core and its abilities.",
    icon: "💫",
  },
  {
    id: "combat-system",
    title: "Combat System",
    category: "Mechanics",
    excerpt: "Turn-based combat, techniques, and action economy.",
    icon: "⚔️",
  },
  {
    id: "domain-source",
    title: "Domain Sources",
    category: "Setting",
    excerpt: "The unique essence each cultivator manipulates.",
    icon: "🔮",
  },
  {
    id: "cultivation-stages",
    title: "Cultivation Stages",
    category: "Setting",
    excerpt: "From Foundation to Transcendence.",
    icon: "📈",
  },
  {
    id: "techniques",
    title: "Techniques Guide",
    category: "Mechanics",
    excerpt: "Types of techniques and how to use them.",
    icon: "🥋",
  },
  {
    id: "character-creation",
    title: "Character Creation",
    category: "Rules",
    excerpt: "Step-by-step guide to creating your character.",
    icon: "✨",
  },
  {
    id: "quick-actions",
    title: "Quick Actions",
    category: "Mechanics",
    excerpt: "Fast actions in 3-stage combat: Guard, Dodge, Brace, and more.",
    icon: "⚡",
  },
  {
    id: "pillars",
    title: "The Three Pillars",
    category: "Mechanics",
    excerpt: "Violence, Influence, and Revelation - the core of your path.",
    icon: "🏛️",
  },
  {
    id: "fate-cards",
    title: "Fate Cards",
    category: "Mechanics",
    excerpt: "Death, Body, and Seed cards that shape your destiny.",
    icon: "🎴",
  },
];

// Tutorial sections for guided help
const tutorialSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "New to the world of cultivation? Begin your journey here.",
    articles: ["character-creation", "cultivation-basics", "cultivation-stages"],
  },
  {
    id: "combat-mastery",
    title: "Combat Mastery",
    description: "Learn to fight, survive, and triumph in battle.",
    articles: ["combat-system", "techniques", "quick-actions"],
  },
  {
    id: "power-paths",
    title: "Paths to Power",
    description: "Understand the systems that define your character's growth.",
    articles: ["pillars", "soul-core", "fate-cards", "domain-source"],
  },
];

export default function HelpPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(wikiArticles);
  const [activeTab, setActiveTab] = useState<"search" | "tutorial">("tutorial");

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults(wikiArticles);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = wikiArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.excerpt.toLowerCase().includes(lowercaseQuery) ||
        article.category.toLowerCase().includes(lowercaseQuery)
    );

    setSearchResults(filtered);
  };

  const getArticleById = (id: string) => wikiArticles.find((a) => a.id === id);

  return (
    <div className="help-page-redesign">
      {/* Background with Zhou Xu character */}
      <div className="help-background">
        <div className="zhou-xu-background-art">
          {/* Placeholder for Zhou Xu full-body art */}
          <div className="zhou-xu-silhouette">
            <div className="zhou-xu-placeholder">
              <span className="zhou-xu-chinese">周旭</span>
              <span className="zhou-xu-title">Divine Advisor</span>
            </div>
          </div>
        </div>
        <div className="background-patterns">
          <div className="wave-pattern"></div>
          <div className="phoenix-pattern"></div>
        </div>
      </div>

      {/* Main content area */}
      <div className="help-content-wrapper">
        {/* Header with Zhou Xu introduction */}
        <header className="help-header">
          <div className="header-accent-line"></div>
          <div className="header-content">
            <div className="advisor-introduction">
              <div className="advisor-portrait-frame">
                <div className="advisor-portrait">
                  <span className="portrait-char">周</span>
                </div>
                <div className="portrait-ornament top-left"></div>
                <div className="portrait-ornament top-right"></div>
                <div className="portrait-ornament bottom-left"></div>
                <div className="portrait-ornament bottom-right"></div>
              </div>
              <div className="advisor-greeting">
                <h1 className="help-title">Divine Advisor: Zhou Xu</h1>
                <p className="help-subtitle">
                  "Greetings, cultivator. I am here to guide you through the intricacies of this world. 
                  Whether you seek knowledge of combat, cultivation, or the mysteries of the soul — ask, and I shall enlighten."
                </p>
              </div>
            </div>
          </div>
          <div className="header-accent-line bottom"></div>
        </header>

        {/* Tab navigation */}
        <nav className="help-tabs">
          <button
            className={`help-tab ${activeTab === "tutorial" ? "active" : ""}`}
            onClick={() => setActiveTab("tutorial")}
          >
            <span className="tab-icon">📜</span>
            <span className="tab-text">Guided Tutorial</span>
          </button>
          <button
            className={`help-tab ${activeTab === "search" ? "active" : ""}`}
            onClick={() => setActiveTab("search")}
          >
            <span className="tab-icon">🔍</span>
            <span className="tab-text">Search Knowledge</span>
          </button>
        </nav>

        {/* Content panels */}
        <div className="help-panels">
          {activeTab === "tutorial" && (
            <div className="tutorial-panel">
              <div className="tutorial-intro">
                <h2>Begin Your Journey</h2>
                <p>
                  The path of cultivation is vast. Allow me to guide you through its foundations 
                  before you face its challenges.
                </p>
              </div>

              <div className="tutorial-sections">
                {tutorialSections.map((section) => (
                  <div key={section.id} className="tutorial-section">
                    <div className="section-header">
                      <h3>{section.title}</h3>
                      <p>{section.description}</p>
                    </div>
                    <div className="section-articles">
                      {section.articles.map((articleId) => {
                        const article = getArticleById(articleId);
                        if (!article) return null;
                        return (
                          <button
                            key={article.id}
                            className="tutorial-article-card"
                            onClick={() => navigate(`/wiki/${article.id}`)}
                          >
                            <span className="article-icon">{article.icon}</span>
                            <div className="article-info">
                              <span className="article-title">{article.title}</span>
                              <span className="article-excerpt">{article.excerpt}</span>
                            </div>
                            <span className="article-arrow">→</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "search" && (
            <div className="search-panel">
              <div className="search-section-redesign">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    className="search-input-redesign"
                    placeholder="Ask Zhou Xu about any topic..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      className="clear-search"
                      onClick={() => handleSearch("")}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="search-results-redesign">
                <h2 className="results-header">
                  {searchQuery 
                    ? `"${searchQuery}" — ${searchResults.length} scroll${searchResults.length !== 1 ? "s" : ""} found`
                    : `All Knowledge (${searchResults.length} scrolls)`
                  }
                </h2>

                {searchResults.length > 0 ? (
                  <div className="articles-grid">
                    {searchResults.map((article) => (
                      <button
                        key={article.id}
                        className="article-card-redesign"
                        onClick={() => navigate(`/wiki/${article.id}`)}
                      >
                        <div className="card-header">
                          <span className="card-icon">{article.icon}</span>
                          <span className="card-category">{article.category}</span>
                        </div>
                        <h3 className="card-title">{article.title}</h3>
                        <p className="card-excerpt">{article.excerpt}</p>
                        <div className="card-footer">
                          <span className="read-more">Read scroll →</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="no-results-redesign">
                    <span className="no-results-icon">📭</span>
                    <p>No scrolls found matching "{searchQuery}".</p>
                    <p className="no-results-hint">
                      Zhou Xu suggests trying different terms or browsing the tutorial sections.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick navigation footer */}
        <footer className="help-footer">
          <div className="footer-quote">
            <span className="quote-mark">"</span>
            <p>The journey of a thousand li begins with a single step. May your path be illuminated.</p>
            <span className="quote-attribution">— Zhou Xu</span>
          </div>
          <nav className="footer-nav">
            <button 
              className="footer-btn primary"
              onClick={() => navigate("/wiki")}
            >
              📚 Complete Wiki
            </button>
            <button 
              className="footer-btn"
              onClick={() => navigate("/srd")}
            >
              📖 Rules Reference
            </button>
            <button 
              className="footer-btn"
              onClick={() => navigate("/home")}
            >
              🏠 Return Home
            </button>
          </nav>
        </footer>
      </div>
    </div>
  );
}
