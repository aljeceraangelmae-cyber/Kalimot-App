import React, { useState } from 'react';
import axios from 'axios';

const SearchItem = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestion, setSuggestion] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const res = await axios.get(`http://localhost:8000/api/items/search?q=${query}`);
      console.log('Search results:', res.data);
      setResults(res.data);
      setSearched(true);
    } catch (err) {
      console.error('Search error:', err);
    }

    try {
      const sugRes = await axios.get(`http://localhost:8000/api/items/suggest?name=${query}`);
      console.log('AI suggestion:', sugRes.data);
      setSuggestion(sugRes.data);
    } catch (err) {
      console.error('Suggestion error:', err);
    }
  };

  return (
    <div>
      <h2>Search for an Item</h2>
      <div className="input-group mb-3">
        <input
          className="form-control"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Type item name..."
        />
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
      </div>

      {suggestion && suggestion.location_note && (
        <div className="alert alert-warning">
          🤖 <strong>AI Suggestion:</strong> You usually place <em>{query}</em> at{' '}
          <strong>{suggestion.location_note}</strong> (based on {suggestion.count} past record
          {suggestion.count > 1 ? 's' : ''}).
        </div>
      )}

      {searched && results.length === 0 && (
        <p className="text-muted">No results found for "{query}".</p>
      )}

      <div className="list-group">
        {results.map(item => (
          <div className="list-group-item" key={item.id}>
            <h5>{item.name}</h5>
            <p className="mb-1 text-muted">📍 {item.location_note}</p>
            <small>{item.created_at?.slice(0, 10)}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchItem;