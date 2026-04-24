import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldOff size={32} color="var(--text-muted)" />
        </div>
        <div>
          <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1, letterSpacing: '-0.04em' }}>404</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.5rem' }}>Page Not Found</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.4rem', maxWidth: 320 }}>
            You don't have access to this page or it doesn't exist.
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{ padding: '0.6rem 1.5rem', borderRadius: 8, border: 'none', backgroundColor: 'var(--primary-teal)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
