import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import AddItem from './pages/AddItem';
import SearchItem from './pages/SearchItem';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddItem />} />
          <Route path="/search" element={<SearchItem />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;