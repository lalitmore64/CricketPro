import React from 'react';
import { Menu, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CricketLogo from './CricketLogo';

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          className="btn btn-secondary mobile-toggle"
          style={{ padding: '0.5rem', display: 'none' }}
        >
          <Menu size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <CricketLogo size={22} color="#0f172a" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Live Scoring & Analytics</h2>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => navigate('/matches/create')}
          className="btn btn-primary"
          style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }}
        >
          <Plus size={16} /> New Match
        </button>
      </div>
    </header>
  );
};

export default Navbar;
