import React from 'react';
import { LogOut, CalendarRange, Map } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const ViewerTopbar: React.FC = () => {
  const { user } = useAuth();

  const handleLogout = () => {
    fetch('http://localhost:3000/logout', { mode: 'no-cors', credentials: 'include' }).catch(() => {});
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'http://localhost:8082/logout';
    document.body.appendChild(form);
    form.submit();
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'G';

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: 'var(--radius-md)',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 600 as const,
    color: isActive ? 'var(--primary-teal)' : 'var(--text-muted)',
    backgroundColor: isActive ? 'var(--primary-teal-transparent)' : 'transparent',
    transition: 'var(--transition-fast)',
    border: `1px solid ${isActive ? 'transparent' : 'transparent'}`,
  });

  return (
    <header style={{
      height: 'var(--topbar-height)',
      backgroundColor: 'var(--bg-panel)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-8)',
      boxShadow: 'var(--shadow-xs)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      flexShrink: 0,
    }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <span style={{
          fontSize: '0.9375rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--text-main)',
        }}>
          Joy Bo'shmi
        </span>
        <span className="badge badge-teal" style={{ letterSpacing: '0.06em' }}>
          VIEWER
        </span>
      </div>

      {/* ── Nav Links ─────────────────────────────────────── */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
        <NavLink to="/live" end style={navLinkStyle}>
          <Map size={14} /> Campus
        </NavLink>
        <NavLink to="/live/schedule" style={navLinkStyle}>
          <CalendarRange size={14} /> Schedule
        </NavLink>
      </nav>

      {/* ── User + Logout ──────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* Avatar */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary-teal) 0%, var(--primary-teal-dark) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '0.05em',
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {user ? `${user.firstName} ${user.lastName}` : 'Guest Visitor'}
        </span>

        <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-color)' }} />

        <button
          onClick={handleLogout}
          className="btn-icon"
          title="Sign out"
          style={{ color: 'var(--status-red)' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--status-red-tint)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};

export default ViewerTopbar;
