import React, { useEffect } from 'react';
import { ShieldCheck, BarChart3, Users, Building2, LayoutDashboard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../server';
import '../../styles/dashboard.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/people/count')
      .then(() => navigate('/home'))
      .catch(() => {});
  }, [navigate]);

  const login = () => {
    window.location.href = "http://localhost:8082/oauth2/authorization/keycloak";
  };

  const features = [
    {
      icon: <Users size={24} color="var(--primary-teal)" />,
      title: 'Live Footfall',
      desc: 'Real-time capacity tracking across every campus zone.',
    },
    {
      icon: <Building2 size={24} color="var(--primary-teal)" />,
      title: 'Floor Layouts',
      desc: 'Room status mapped to architectural floor blueprints.',
    },
    {
      icon: <BarChart3 size={24} color="var(--primary-teal)" />,
      title: 'Deep Analytics',
      desc: '90-day trends, building efficiency, and space utilisation.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>

      <nav style={{
        height: 'var(--topbar-height)',
        padding: '0 var(--space-16)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-panel)',
        boxShadow: 'var(--shadow-xs)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
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
            Joy Bo'shmi
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <button
            onClick={login}
            className="btn btn-primary"
            style={{ gap: 'var(--space-2)' }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Sign In <ArrowRight size={15} />
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-16) var(--space-8)', textAlign: 'center' }}>

        <div className="badge badge-teal animate-in stagger-1" style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-xs)', letterSpacing: '0.1em' }}>
          UNIVERSITY CAMPUS INTELLIGENCE
        </div>

        <h1 className="animate-in stagger-2" style={{
          fontSize: 'clamp(2.8rem, 6vw, 3.052rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          maxWidth: '820px',
          margin: '0 0 var(--space-6) 0',
          letterSpacing: '-0.04em',
          color: 'var(--text-main)',
        }}>
          Smarter Spaces.<br />
          <span style={{ color: 'var(--primary-teal)' }}>Better Decisions.</span>
        </h1>

        <p className="animate-in stagger-3" style={{
          fontSize: '1.0625rem',
          color: 'var(--text-muted)',
          maxWidth: '480px',
          lineHeight: 'var(--leading-relaxed)',
          marginBottom: 'var(--space-10)',
        }}>
          Real-time occupancy tracking, space analytics, and live timetabling for modern universities. Secured by Keycloak SSO.
        </p>

        <div className="animate-in stagger-4" style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <button
            onClick={login}
            className="btn btn-primary"
            style={{
              padding: 'var(--space-3) var(--space-8)',
              fontSize: '1rem',
              gap: 'var(--space-3)',
              boxShadow: 'var(--shadow-teal)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px var(--primary-teal-glow)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-teal)'; }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
            onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          >
            <LayoutDashboard size={18} /> Access Dashboard
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-6)',
          marginTop: 'var(--space-16)',
          maxWidth: '960px',
          width: '100%',
        }}>
          {features.map((f, i) => (
            <div
              key={i}
              className={`glass-panel animate-in stagger-${i + 4}`}
              style={{
                padding: 'var(--space-8)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
                transition: 'var(--transition-base)',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--primary-teal)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'var(--primary-teal-transparent)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 'var(--space-2)', letterSpacing: '-0.01em' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{
        padding: 'var(--space-6) var(--space-16)',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>© 2026 Joy Bo'shmi Campus Systems</span>
        <span style={{ color: 'var(--text-placeholder)' }}>Authorized access only</span>
      </footer>
    </div>
  );
};

export default LandingPage;
