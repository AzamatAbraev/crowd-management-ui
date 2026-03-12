import React from 'react';
import { Cpu, Settings, LogOut, ShieldCheck, Users, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

// ── Role-to-section access matrix ────────────────────────────────────────────
// theking       → devices, system, statistics, users
// system_admin  → devices, system, statistics
// facility_manager → devices, statistics

interface SectionDef {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
  badge?: string;
  /** Which roles can see this card (undefined = all admin roles) */
  allowedFor?: string[];
}

const ALL_SECTIONS: SectionDef[] = [
  {
    id: 'devices',
    label: 'Device Management',
    description: 'Register sensors, monitor health, and configure IoT endpoints.',
    icon: <Cpu size={40} />,
    color: 'var(--primary-teal)',
    route: '/admin/devices',
  },
  {
    id: 'system',
    label: 'System Management',
    description: 'Global configurations, alert thresholds, and security rules.',
    icon: <Settings size={40} />,
    color: '#8a9eff',
    route: '/admin/system',
    allowedFor: ['theking', 'system_admin'],
  },
  {
    id: 'statistics',
    label: 'Statistics & Analytics',
    description: 'Historical occupancy trends, building footfall, and risk analysis.',
    icon: <BarChart2 size={40} />,
    color: '#a855f7',
    route: '/admin/statistics',
  },
  {
    id: 'users',
    label: 'User Management',
    description: 'Create, edit, delete users and manage their Keycloak roles.',
    icon: <Users size={40} />,
    color: '#f59e0b',
    route: '/admin/users',
    badge: 'Super Admin',
    allowedFor: ['theking'],
  },
];

const AdminLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isTheKing, isSystemAdmin, isFacilityManager } = useAuth();

  const handleLogout = () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'http://localhost:8082/logout';
    document.body.appendChild(form);
    form.submit();
  };

  // Determine which sections this user can see
  const activeRole = isTheKing ? 'theking' : isSystemAdmin ? 'system_admin' : isFacilityManager ? 'facility_manager' : 'admin';
  const visibleSections = ALL_SECTIONS.filter(s =>
    !s.allowedFor || s.allowedFor.includes(activeRole)
  );

  const roleLabel = isTheKing ? 'Super Admin (The King)' : isSystemAdmin ? 'System Administrator' : isFacilityManager ? 'Facility Manager' : 'Administrator';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <nav style={{ padding: '1.5rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: 'var(--primary-teal)', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={28} color="#000" />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.5px' }}>Joy Bo'shmi Admin</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {user ? `${user.firstName} ${user.lastName}` : 'Administrator'}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--primary-teal)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
              {roleLabel}
            </div>
          </div>
          <button onClick={handleLogout}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--status-red)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '8px', transition: 'background-color 0.2s' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,71,87,0.1)'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            Logout <LogOut size={16} />
          </button>
        </div>
      </nav>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>Welcome to the Control Center</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto' }}>
            Select an operational domain to continue. You have access to <strong>{visibleSections.length}</strong> section{visibleSections.length !== 1 ? 's' : ''} based on your role.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', maxWidth: '1100px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
          {visibleSections.map(section => (
            <button
              key={section.id}
              onClick={() => navigate(section.route)}
              className="glass-panel"
              style={{ flex: '1 1 300px', minHeight: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', padding: '2rem', cursor: 'pointer', border: '1px solid var(--border-color)', transition: 'all 0.3s ease', background: 'var(--bg-panel)', maxWidth: 350 }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = section.color; e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.15)`; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: section.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', color: section.color }}>
                {section.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', margin: '0 0 0.4rem 0', fontWeight: 700 }}>{section.label}</h3>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>{section.description}</p>
                {section.badge && (
                  <span style={{ display: 'inline-block', marginTop: '0.6rem', fontSize: '0.65rem', fontWeight: 800, backgroundColor: section.color + '22', color: section.color, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {section.badge}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminLandingPage;
