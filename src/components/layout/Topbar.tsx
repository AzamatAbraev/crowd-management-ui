import React, { useState, useEffect } from 'react';
import { Search, Bell, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const Topbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getRoleDisplayName = (roles: string[] | undefined) => {
    if (!roles || roles.length === 0) return 'Guest';
    if (roles.includes('admin')) return 'Administrator';
    if (roles.includes('manage-devices')) return 'Manager';
    if (roles.includes('view-occupancy')) return 'Viewer';
    return roles[0].replace('-', ' ');
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'G';

  return (
    <header style={{
      height: 'var(--topbar-height)',
      backgroundColor: 'var(--bg-panel)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-6)',
      gap: 'var(--space-4)',
      flexShrink: 0,
      boxShadow: 'var(--shadow-xs)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>

      {/* ── Left: LIVE indicator + time ───────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexShrink: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          backgroundColor: 'var(--primary-teal-transparent)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
        }}>
          <div className="live-dot" />
          <span style={{ color: 'var(--primary-teal)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em' }}>
            LIVE
          </span>
        </div>

        <div style={{
          color: 'var(--text-secondary)',
          fontWeight: 500,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          backgroundColor: 'var(--bg-base)',
          padding: '5px 10px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {time.toLocaleTimeString('en-GB')}
        </div>
      </div>

      {/* ── Center: Search ────────────────────────────────── */}
      <div style={{ flex: 1, maxWidth: '380px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-base)',
          border: `1px solid ${searchFocused ? 'var(--primary-teal)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '6px 12px',
          gap: 'var(--space-2)',
          transition: 'var(--transition-fast)',
          boxShadow: searchFocused ? '0 0 0 3px var(--primary-teal-transparent)' : 'none',
        }}>
          <Search size={15} color="var(--text-placeholder)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search facilities…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              width: '100%',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      {/* ── Right: Icon actions + user ────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', flexShrink: 0 }}>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          style={{ color: 'var(--text-muted)' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="btn-icon" style={{ position: 'relative', color: 'var(--text-muted)' }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '7px',
            height: '7px',
            backgroundColor: 'var(--status-red)',
            borderRadius: '50%',
            border: '1.5px solid var(--bg-panel)',
          }} />
        </button>

        {/* Vertical separator */}
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 var(--space-2)' }} />

        {/* User profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 500, marginTop: '1px' }}>
              {getRoleDisplayName(user?.roles)}
            </div>
          </div>

          {/* Avatar */}
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-teal) 0%, var(--primary-teal-dark) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.05em',
            border: '2px solid var(--border-color)',
          }}>
            {initials}
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              const form = document.createElement('form');
              form.method = 'POST';
              form.action = 'http://localhost:8082/logout';
              document.body.appendChild(form);
              form.submit();
            }}
            className="btn-icon"
            title="Sign out"
            style={{ color: 'var(--status-red)' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--status-red-tint)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
