import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  BarChart3, 
  Radio, 
  BellRing, 
  Settings,
  GraduationCap,
  CalendarRange,
  Cpu
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Live Overview', path: '/dashboard/overview', icon: LayoutDashboard },
    { name: 'Floor Layout', path: '/dashboard/floor', icon: Building2 },
    { name: 'University Timetable', path: '/dashboard/timetable', icon: CalendarRange },
    { name: 'Historical Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Sensors', path: '/dashboard/sensors', icon: Radio },
    { name: 'Device Management', path: '/dashboard/devices', icon: Cpu },
    { name: 'Alerts', path: '/dashboard/alerts', icon: BellRing, badge: 3 },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--bg-panel)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem'
    }}>
      {/* Logo Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
        <div style={{ 
          backgroundColor: 'var(--primary-teal)', 
          padding: '0.5rem', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <GraduationCap size={24} color="#000" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.5px', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>Joy Bo'shmi</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Campus Systems</span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', padding: '0 0.75rem' }}>
          Main Menu
        </div>
        
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.6rem 0.75rem',
              borderRadius: '8px',
              color: isActive ? '#fff' : 'var(--text-muted)',
              backgroundColor: isActive ? 'var(--primary-teal)' : 'transparent',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: isActive ? 600 : 500,
              transition: 'all 0.2s ease'
            })}
          >
            <item.icon size={18} />
            <span style={{ flex: 1 }}>{item.name}</span>
            {item.badge && (
              <span style={{
                backgroundColor: 'var(--status-red)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '10px'
              }}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Support Button */}
      <div style={{ marginTop: 'auto' }}>
        <button style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: 'var(--primary-teal-transparent)',
          color: 'var(--primary-teal)',
          border: '1px solid var(--primary-teal)',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s ease'
        }}>
          Support
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
