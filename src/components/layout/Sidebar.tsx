import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  Radio,
  BellRing,
  GraduationCap,
  CalendarRange,
  Cpu,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
  roles?: string[];
}

const Sidebar: React.FC = () => {
  const { hasAnyRole } = useAuth();

  const navItems: NavItem[] = [
    { name: 'Live Overview', path: '/admin/overview', icon: LayoutDashboard, roles: ['view-occupancy'] },
    { name: 'Floor Layout', path: '/admin/floor', icon: Building2, roles: ['view-buildings'] },
    { name: 'Timetable', path: '/admin/timetable', icon: CalendarRange, roles: ['view-timetable'] },
    { name: 'Historical Analytics', path: '/admin/analytics', icon: BarChart3, roles: ['view-occupancy'] },
    { name: 'Sensors', path: '/admin/sensors', icon: Radio, roles: ['view-devices'] },
    { name: 'Device Management', path: '/admin/devices', icon: Cpu, roles: ['manage-devices'] },
    { name: 'Notices', path: '/admin/notices', icon: BellRing },
  ];

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-panel)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-6) var(--space-4)',
      flexShrink: 0,
    }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)', padding: '0 var(--space-2)' }}>
        <div style={{
          backgroundColor: 'var(--primary-teal)',
          padding: '6px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: 'var(--shadow-sm)',
        }}>
          <GraduationCap size={20} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)', lineHeight: 1.2 }}>
            Palantir
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 500, marginTop: '1px' }}>
            Campus Systems
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <div className="section-label" style={{ padding: '0 var(--space-3)', marginBottom: 'var(--space-2)' }}>
          Navigation
        </div>

        {navItems
          .filter(item => !item.roles || hasAnyRole(item.roles))
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: '7px var(--space-3)',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--primary-teal)' : 'var(--text-muted)',
                backgroundColor: isActive ? 'var(--primary-teal-transparent)' : 'transparent',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                transition: 'var(--transition-fast)',
                borderLeft: isActive ? '2px solid var(--primary-teal)' : '2px solid transparent',
                position: 'relative',
              })}
              onMouseEnter={e => {
                const el = e.currentTarget;
                if (!el.style.backgroundColor || el.style.backgroundColor === 'transparent') {
                  el.style.backgroundColor = 'var(--bg-panel-hover)';
                  el.style.color = 'var(--text-main)';
                }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                if (el.style.borderLeft !== '2px solid var(--primary-teal)') {
                  el.style.backgroundColor = 'transparent';
                  el.style.color = 'var(--text-muted)';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, flexShrink: 0 }}>
                <item.icon size={17} />
              </span>
              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name}
              </span>
              {item.badge && (
                <span style={{
                  backgroundColor: 'var(--status-red)',
                  color: 'white',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: 'var(--radius-full)',
                  lineHeight: 1.6,
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
      </nav>

      <div style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)', marginTop: 'var(--space-4)' }}>
        <button
          style={{
            width: '100%',
            padding: '8px var(--space-3)',
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--space-2)',
            transition: 'var(--transition-fast)',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--bg-panel-hover)';
            e.currentTarget.style.color = 'var(--text-main)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <HelpCircle size={15} />
          Get Support
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
