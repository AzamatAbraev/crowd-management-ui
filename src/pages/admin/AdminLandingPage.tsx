import React from 'react';
import { Cpu, Settings, LogOut, ShieldCheck, Users, BarChart2, Radio, Activity, Building2, CalendarRange, BellRing, Map } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

interface SectionDef {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  route: string;
  badge?: string;
  allowedFor?: string[];
}

const ALL_SECTIONS: SectionDef[] = [
  {
    id: 'monitor',
    label: 'Live Monitor',
    description: 'Real-time device feed and occupancy log.',
    icon: <Radio size={32} />,
    accentColor: 'var(--status-blue)',
    route: '/admin/monitor',
  },
  {
    id: 'floor',
    label: 'Floor Layout',
    description: 'Visual floor plans with per-room occupancy percentages.',
    icon: <Building2 size={32} />,
    accentColor: 'var(--primary-teal)',
    route: '/admin/floor',
  },
  {
    id: 'timetable',
    label: 'Timetable',
    description: 'Class schedules and room booking overview.',
    icon: <CalendarRange size={32} />,
    accentColor: 'var(--status-purple)',
    route: '/admin/timetable',
  },
  {
    id: 'notices',
    label: 'Room Notices',
    description: 'Post and manage room closure and maintenance alerts.',
    icon: <BellRing size={32} />,
    accentColor: 'var(--status-red)',
    route: '/admin/notices',
  },
  {
    id: 'devices',
    label: 'Device Management',
    description: 'Register, monitor, and configure IoT sensors.',
    icon: <Cpu size={32} />,
    accentColor: 'var(--status-blue)',
    route: '/admin/devices',
  },
  {
    id: 'statistics',
    label: 'Statistics & Analytics',
    description: 'Historical occupancy trends and risk analysis.',
    icon: <BarChart2 size={32} />,
    accentColor: 'var(--status-purple)',
    route: '/admin/statistics',
  },
  {
    id: 'grafana',
    label: 'Grafana Dashboards',
    description: 'Live and historical occupancy charts powered by Grafana.',
    icon: <Activity size={32} />,
    accentColor: '#f46800',
    route: '/admin/grafana',
  },
  {
    id: 'system',
    label: 'System Management',
    description: 'Alert thresholds, configurations, and access rules.',
    icon: <Settings size={32} />,
    accentColor: 'var(--status-blue)',
    route: '/admin/system',
    allowedFor: ['theking', 'system_admin'],
  },
  {
    id: 'users',
    label: 'User Management',
    description: 'Manage users and Keycloak role assignments.',
    icon: <Users size={32} />,
    accentColor: 'var(--status-amber)',
    route: '/admin/users',
    badge: 'Super Admin',
    allowedFor: ['theking'],
  },
];

const AdminLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isTheKing, isSystemAdmin, isFacilityManager } = useAuth();

  const handleLogout = () => {
    fetch('http://localhost:3000/logout', { mode: 'no-cors', credentials: 'include' }).catch(() => { });
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'http://localhost:8082/logout';
    document.body.appendChild(form);
    form.submit();
  };

  const activeRole = isTheKing ? 'theking' : isSystemAdmin ? 'system_admin' : isFacilityManager ? 'facility_manager' : 'admin';
  const visibleSections = ALL_SECTIONS.filter(s => !s.allowedFor || s.allowedFor.includes(activeRole));
  const roleLabel = isTheKing ? 'Super Admin' : isSystemAdmin ? 'System Administrator' : isFacilityManager ? 'Facility Manager' : 'Administrator';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Topbar ──────────────────────────────────────────────── */}
      <nav style={{
        height: 'var(--topbar-height)',
        padding: '0 var(--space-10)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-panel)',
        boxShadow: 'var(--shadow-xs)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            backgroundColor: 'var(--primary-teal)',
            padding: '7px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <ShieldCheck size={20} color="#fff" />
          </div>
          <span style={{ fontSize: '0.9375rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            Palantir
          </span>
          <span className="badge badge-teal" style={{ letterSpacing: '0.06em' }}>ADMIN</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <Link
            to="/live"
            className="btn-icon"
            title="Viewer — Campus Map"
            style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
          >
            <Map size={18} />
          </Link>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {user ? `${user.firstName} ${user.lastName}` : 'Administrator'}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--primary-teal)', fontWeight: 600, marginTop: '1px', letterSpacing: '0.02em' }}>
              {roleLabel}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-danger"
            style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </nav>

      {/* ── Main ────────────────────────────────────────────────── */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-16) var(--space-8)',
        textAlign: 'center',
      }}>
        <div className="animate-in stagger-1" style={{ marginBottom: 'var(--space-12)' }}>
          <h1 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: 'var(--space-3)',
            color: 'var(--text-main)',
          }}>
            Control Center
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', maxWidth: '400px', margin: '0 auto', lineHeight: 'var(--leading-relaxed)' }}>
            {visibleSections.length} section{visibleSections.length !== 1 ? 's' : ''} available for your role.
          </p>
        </div>

        {/* Section Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--space-5)',
          maxWidth: '1100px',
          width: '100%',
        }}>
          {visibleSections.map((section, i) => (
            <button
              key={section.id}
              onClick={() => navigate(section.route)}
              className={`animate-in stagger-${Math.min(i + 2, 6)}`}
              style={{
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 'var(--space-4)',
                padding: 'var(--space-8)',
                cursor: 'pointer',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xl)',
                backgroundColor: 'var(--bg-panel)',
                boxShadow: 'var(--shadow-sm)',
                textAlign: 'left',
                transition: 'var(--transition-base)',
                fontFamily: 'inherit',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.borderColor = section.accentColor;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
            >

              {/* Icon */}
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: `color-mix(in srgb, ${section.accentColor} 12%, transparent)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: section.accentColor,
                flexShrink: 0,
              }}>
                {section.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                    {section.label}
                  </h3>
                  {section.badge && (
                    <span className="badge" style={{
                      backgroundColor: `color-mix(in srgb, ${section.accentColor} 12%, transparent)`,
                      color: section.accentColor,
                      fontSize: '0.5625rem',
                      letterSpacing: '0.06em',
                      fontWeight: 700,
                    }}>
                      {section.badge.toUpperCase()}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, lineHeight: 'var(--leading-relaxed)' }}>
                  {section.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminLandingPage;
