import React, { useState, useEffect } from 'react';
import api from '../api';

const Home = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/api/items')
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    api.delete(`/api/items/${id}`)
      .then(() => setItems(items.filter(item => item.id !== id)));
  };

  return (
    <div>
      <h2>Recent Items</h2>
      {items.length === 0 && <p>No items recorded yet.</p>}
      <div className="row">
        {items.map(item => (
          <div className="col-md-4 mb-3" key={item.id}>
            <div className="card">
              {item.image_path && (
                <img
                src={item.image_path}
                  className="card-img-top"
                  alt={item.name}
                  style={{ height: '180px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text text-muted">{item.location_note}</p>
                <p className="card-text"><small>{item.description}</small></p>
                <p className="card-text"><small className="text-muted">{item.created_at?.slice(0, 10)}</small></p>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;