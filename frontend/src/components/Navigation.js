import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <span className="navbar-brand fw-bold">🧠 Kalimot App</span>
        <div className="navbar-nav ms-auto">
          <Link
            className={`nav-link ${location.pathname === '/' ? 'active fw-bold' : 'text-white'}`}
            to="/">
            Home
          </Link>
          <Link
            className={`nav-link ${location.pathname === '/add' ? 'active fw-bold' : 'text-white'}`}
            to="/add">
            Add Item
          </Link>
          <Link
            className={`nav-link ${location.pathname === '/search' ? 'active fw-bold' : 'text-white'}`}
            to="/search">
            Search
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;