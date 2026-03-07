import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from './ThemeContext';

const Topbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header style={{
      height: '70px',
      backgroundColor: 'var(--bg-dark)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem'
    }}>
      
      {/* Left section (Breadcrumb / Title placeholder if needed for specific routes) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
         {/* Live Indicator */}
         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary-teal-transparent)', padding: '4px 10px', borderRadius: '20px' }}>
           <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-teal)' }}></div>
           <span style={{ color: 'var(--primary-teal)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px' }}>LIVE</span>
         </div>

         {/* Time */}
         <div style={{ color: 'var(--text-main)', fontWeight: 500, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-panel)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
           <span>{time.toLocaleTimeString('en-GB')}</span>
         </div>
      </div>

      {/* Center Search */}
      <div style={{ flex: 1, maxWidth: '400px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: 'var(--bg-panel)', 
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '0.5rem 1rem',
          width: '100%',
          gap: '0.5rem'
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search facilities..." 
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              width: '100%',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </div>

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={toggleTheme}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={20} color="var(--text-muted)" />
            <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', backgroundColor: 'var(--status-red)', borderRadius: '50%' }}></span>
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={20} color="var(--text-muted)" />
          </button>
        </div>

        {/* User Profile & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Admin User</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Super Administrator</div>
          </div>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            backgroundColor: '#ffb084',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '2px solid var(--border-color)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-color)', margin: '0 0.5rem' }}></div>
          
          <button 
            onClick={() => {
              const form = document.createElement('form');
              form.method = 'POST';
              form.action = 'http://localhost:8082/logout';
              document.body.appendChild(form);
              form.submit();
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--status-red)',
              padding: '0.25rem'
            }}
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
