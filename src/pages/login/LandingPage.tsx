import React, { useEffect } from 'react';
import { ShieldCheck, BarChart3, Users, Building2, LayoutDashboard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../server';
import '../../styles/dashboard.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already authenticated
    api.get('/people/count')
      .then(() => {
        // If the request succeeds, the user is logged in
        navigate('/dashboard/overview');
      })
      .catch(() => {
        // Not logged in (401), stay on the landing page
      });
  }, [navigate]);

  const login = () => {
    window.location.href = "http://localhost:8082/oauth2/authorization/keycloak";
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-dark)',
      color: 'var(--text-main)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Navbar */}
      <nav style={{
        padding: '1.5rem 4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-panel)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            backgroundColor: 'var(--primary-teal)', 
            padding: '0.5rem', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={28} color="#000" />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.5px' }}>Joy Bo'shmi</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button onClick={login} style={{
            background: 'transparent',
            color: 'var(--text-main)',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.5rem 1rem'
          }}>Sign In</button>
          
          <button onClick={login} style={{
            background: 'var(--primary-teal)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'background 0.2s'
          }}>
            Get Started <ArrowRight size={18} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', textAlign: 'center' }}>
        
        <div style={{
          backgroundColor: 'var(--primary-teal-transparent)',
          color: 'var(--primary-teal)',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontWeight: 700,
          fontSize: '0.85rem',
          letterSpacing: '1px',
          marginBottom: '2rem',
          display: 'inline-block'
        }}>
          UNIVERSITY CAMPUS MANAGEMENT
        </div>

        <h2 style={{ 
          fontSize: '4.5rem', 
          fontWeight: 800, 
          lineHeight: 1.1, 
          maxWidth: '900px', 
          margin: '0 0 1.5rem 0',
          letterSpacing: '-1px' 
        }}>
          Smarter Spaces.<br />
          <span style={{ color: 'var(--primary-teal)' }}>Better Decisions.</span>
        </h2>

        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-muted)',
          maxWidth: '650px',
          lineHeight: 1.6,
          marginBottom: '3rem'
        }}>
          Real-time occupancy tracking, historical space analytics, and live timetabling tailored for modern universities. Securely powered by Keycloak SSO.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button onClick={login} style={{
            background: 'var(--primary-teal)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 4px 14px 0 rgba(28, 181, 136, 0.39)',
            transition: 'transform 0.2s'
          }}>
            Access Dashboard <LayoutDashboard size={20} />
          </button>
        </div>

        {/* Feature Highlights Row */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          gap: '2rem', 
          marginTop: '6rem',
          maxWidth: '1000px',
          width: '100%'
        }}>
          {/* Feature 1 */}
          <div className="glass-panel" style={{ flex: 1, padding: '2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-panel-hover)', borderRadius: '12px', width: 'fit-content' }}>
              <Users size={32} color="var(--primary-teal)" />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Live Footfall</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.5, fontSize: '0.95rem' }}>Track real-time capacity limits and zone overflow across your campus.</p>
          </div>
          
          {/* Feature 2 */}
          <div className="glass-panel" style={{ flex: 1, padding: '2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-panel-hover)', borderRadius: '12px', width: 'fit-content' }}>
              <Building2 size={32} color="var(--primary-teal)" />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Floor Layouts</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.5, fontSize: '0.95rem' }}>Interactive room and facility status mapped directly to architectural blueprints.</p>
          </div>
          
          {/* Feature 3 */}
          <div className="glass-panel" style={{ flex: 1, padding: '2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-panel-hover)', borderRadius: '12px', width: 'fit-content' }}>
              <BarChart3 size={32} color="var(--primary-teal)" />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Deep Analytics</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.5, fontSize: '0.95rem' }}>Analyze 90-day footprint trends and identify building efficiency rates.</p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-muted)',
        fontSize: '0.9rem'
      }}>
        © 2026 Joy Bo'shmi Campus Systems. Authorized access only.
      </footer>
    </div>
  );
};

export default LandingPage;
