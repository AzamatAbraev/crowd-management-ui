import React from 'react';
import { LogOut, CalendarRange, Map } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ViewerTopbar: React.FC = () => {
  const { user } = useAuth();

  const handleLogout = () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'http://localhost:8082/logout';
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <header style={{
      height: '70px',
      backgroundColor: 'var(--bg-dark)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem'
    }}>
      {/* Brand Identity / Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: '1.25rem', 
          fontWeight: 800, 
          letterSpacing: '0.5px', 
          color: 'var(--text-main)', 
          whiteSpace: 'nowrap' 
        }}>
          Joy Bo'shmi
        </h2>
        <span style={{ 
          color: 'var(--primary-teal)', 
          fontSize: '0.75rem', 
          fontWeight: 600, 
          letterSpacing: '1px',
          backgroundColor: 'var(--primary-teal-transparent)',
          padding: '2px 8px',
          borderRadius: '12px'
        }}>
          VIEWER MODE
        </span>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <NavLink to="/live" end style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '6px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, color: isActive ? 'var(--primary-teal)' : 'var(--text-muted)', backgroundColor: isActive ? 'var(--primary-teal-transparent)' : 'transparent', transition: 'all 0.2s' })}>
          <Map size={15} /> Campus
        </NavLink>
        <NavLink to="/live/schedule" style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '6px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, color: isActive ? 'var(--primary-teal)' : 'var(--text-muted)', backgroundColor: isActive ? 'var(--primary-teal-transparent)' : 'transparent', transition: 'all 0.2s' })}>
          <CalendarRange size={15} /> Schedule
        </NavLink>
      </nav>

      {/* User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
          {user ? `${user.firstName} ${user.lastName}` : 'Guest Visitor'}
        </div>
        
        <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-color)' }}></div>
        
        <button 
          onClick={handleLogout}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: 'var(--status-red)',
            padding: '0.5rem',
            fontWeight: 600,
            transition: 'opacity 0.2s'
          }}
          title="Logout"
        >
          <LogOut size={18} />
          <span style={{ fontSize: '0.85rem' }}>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default ViewerTopbar;
