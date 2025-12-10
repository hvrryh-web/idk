import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Sample wiki data for searching
const wikiArticles = [
  { id: 'cultivation-basics', title: 'Cultivation Basics', category: 'Mechanics', excerpt: 'Learn the fundamentals of cultivation in the xianxia world.' },
  { id: 'soul-core', title: 'Soul Core System', category: 'Mechanics', excerpt: 'Understanding your Soul Core and its abilities.' },
  { id: 'combat-system', title: 'Combat System', category: 'Mechanics', excerpt: 'Turn-based combat, techniques, and action economy.' },
  { id: 'domain-source', title: 'Domain Sources', category: 'Setting', excerpt: 'The unique essence each cultivator manipulates.' },
  { id: 'cultivation-stages', title: 'Cultivation Stages', category: 'Setting', excerpt: 'From Foundation to Transcendence.' },
  { id: 'techniques', title: 'Techniques Guide', category: 'Mechanics', excerpt: 'Types of techniques and how to use them.' },
  { id: 'character-creation', title: 'Character Creation', category: 'Rules', excerpt: 'Step-by-step guide to creating your character.' },
  { id: 'quick-actions', title: 'Quick Actions', category: 'Mechanics', excerpt: 'Fast actions in 3-stage combat: Guard, Dodge, Brace, and more.' },
];

export default function HelpPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(wikiArticles);

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

  return (
    <div className="help-page">
      <header className="page-header">
        <h1>Help & Search</h1>
        <p>Search the knowledge base to find rules, mechanics, and setting information.</p>
      </header>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search for rules, mechanics, or setting information..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="search-results">
        <h2>
          {searchQuery ? `Results for "${searchQuery}"` : 'All Articles'} 
          ({searchResults.length})
        </h2>
        
        {searchResults.length > 0 ? (
          <ul className="article-list">
            {searchResults.map((article) => (
              <li key={article.id} className="article-item">
                <div className="article-category">{article.category}</div>
                <h3>
                  <button onClick={() => navigate(`/wiki/${article.id}`)}>
                    {article.title}
                  </button>
                </h3>
                <p>{article.excerpt}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-results">
            No articles found matching "{searchQuery}". Try a different search term.
          </p>
        )}
      </div>

      <div className="quick-links">
        <h3>Quick Links</h3>
        <nav>
          <button onClick={() => navigate('/wiki')}>📚 Browse All Topics</button>
          <button onClick={() => navigate('/')}>🏠 Back to Game Room</button>
        </nav>
      </div>
    </div>
  );
}
