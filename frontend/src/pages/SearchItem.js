import React, { useState } from 'react';
import axios from 'axios';

const SearchItem = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestion, setSuggestion] = useState(null);

  const handleSearch = () => {
    axios.get(`http://localhost:8000/api/items/search?q=${query}`)
      .then(res => setResults(res.data));
    axios.get(`http://localhost:8000/api/items/suggest?name=${query}`)
      .then(res => setSuggestion(res.data));
  };

  return (
    <div>
      <h2>Search for an Item</h2>
      <div className="input-group mb-3">
        <input className="form-control" value={query} onChange={e => setQuery(e.target.value)} placeholder="Type item name..." />
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
      </div>

      {suggestion && suggestion.location_note && (
        <div className="alert alert-warning">
          🤖 <strong>AI Suggestion:</strong> You usually place <em>{query}</em> at <strong>{suggestion.location_note}</strong> (based on {suggestion.count} past record{suggestion.count > 1 ? 's' : ''}).
        </div>
      )}

      {results.length === 0 && query && <p>No results found.</p>}
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