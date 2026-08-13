import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, PlusCircle } from 'lucide-react';
import CricketLogo from './CricketLogo';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/teams', label: 'Teams', icon: Users },
    { path: '/players', label: 'Players', icon: UserCheck },
    { path: '/matches/create', label: 'Create Match', icon: PlusCircle },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="brand-logo">
        <div className="brand-icon">
          <CricketLogo size={20} color="#ffffff" />
        </div>
        <span>CricketPro</span>
      </div>

      <ul className="nav-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>

      <div style={{ marginTop: 'auto', padding: '1rem', backgroundColor: 'rgba(248, 250, 252, 0.8)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>SYSTEM STATUS</div>
        <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          Scoring Engine Ready
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
