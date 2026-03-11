import React from 'react';
import { Cpu, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const AdminLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'http://localhost:8082/logout';
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-dark)',
      color: 'var(--text-main)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Safe Minimal Topbar */}
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
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.5px' }}>Joy Bo'shmi Admin</h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {user ? `${user.firstName} ${user.lastName}` : 'System Admin'}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Administrator
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--status-red)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600,
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 71, 87, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Logout <LogOut size={16} />
          </button>
        </div>
      </nav>

      {/* Main Action Area */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem',
        textAlign: 'center'
      }}>

        <div style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Welcome to the Control Center</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                Select an operational domain to continue. Device Management handles all IoT interactions, while System Management configures users and general app settings.
            </p>
        </div>

        <div style={{ 
            display: 'flex', 
            gap: '3rem', 
            maxWidth: '900px', 
            width: '100%',
            justifyContent: 'center',
            flexWrap: 'wrap'
        }}>
            
            {/* Action Card 1 */}
            <button 
               onClick={() => navigate('/dashboard/devices')}
               className="glass-panel"
               style={{
                   flex: '1 1 350px',
                   minHeight: '280px',
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '1.5rem',
                   padding: '2rem',
                   cursor: 'pointer',
                   border: '1px solid var(--border-color)',
                   transition: 'all 0.3s ease',
                   background: 'var(--bg-panel)'
               }}
               onMouseOver={(e) => {
                   e.currentTarget.style.transform = 'translateY(-5px)';
                   e.currentTarget.style.borderColor = 'var(--primary-teal)';
                   e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
               }}
               onMouseOut={(e) => {
                   e.currentTarget.style.transform = 'none';
                   e.currentTarget.style.borderColor = 'var(--border-color)';
                   e.currentTarget.style.boxShadow = 'none';
               }}
            >
                <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(28, 181, 136, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-teal)'
                }}>
                    <Cpu size={40} />
                </div>
                <div>
                    <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Device Management</h3>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Register sensors, monitor health, and configure endpoints.</p>
                </div>
            </button>

            {/* Action Card 2 */}
            <button 
               onClick={() => navigate('/dashboard/settings')}
               className="glass-panel"
               style={{
                   flex: '1 1 350px',
                   minHeight: '280px',
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '1.5rem',
                   padding: '2rem',
                   cursor: 'pointer',
                   border: '1px solid var(--border-color)',
                   transition: 'all 0.3s ease',
                   background: 'var(--bg-panel)'
               }}
               onMouseOver={(e) => {
                   e.currentTarget.style.transform = 'translateY(-5px)';
                   e.currentTarget.style.borderColor = '#8a9eff';
                   e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
               }}
               onMouseOut={(e) => {
                   e.currentTarget.style.transform = 'none';
                   e.currentTarget.style.borderColor = 'var(--border-color)';
                   e.currentTarget.style.boxShadow = 'none';
               }}
            >
                <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(138, 158, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8a9eff'
                }}>
                    <Settings size={40} />
                </div>
                <div>
                    <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', fontWeight: 600 }}>System Management</h3>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Global configurations, rule engines, and API keys.</p>
                </div>
            </button>

        </div>
      </main>
    </div>
  );
};

export default AdminLandingPage;
