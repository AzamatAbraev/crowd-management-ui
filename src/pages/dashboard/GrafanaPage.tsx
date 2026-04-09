import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ChevronLeft, ExternalLink } from 'lucide-react';

const GRAFANA_DASHBOARD_URL =
  'http://localhost:3000/d/wiut-campus-occ/wiut-campus-occupancy?kiosk=1&refresh=10s&theme=dark';

const GrafanaPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <nav style={{ padding: '1.25rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <ChevronLeft size={18} /> Back
          </button>
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--border-color)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ backgroundColor: '#f46800', padding: '0.4rem', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={22} color="#fff" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Grafana Dashboards</h1>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live &amp; Historical Occupancy</div>
            </div>
          </div>
        </div>
        <a
          href="http://localhost:3000/d/wiut-campus-occ/wiut-campus-occupancy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 14px', borderRadius: 7, border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none', cursor: 'pointer' }}
        >
          <ExternalLink size={13} /> Open in Grafana
        </a>
      </nav>

      {/* Iframe */}
      <div style={{ flex: 1, margin: '1.5rem 2.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', minHeight: 0 }}>
        <iframe
          src={GRAFANA_DASHBOARD_URL}
          title="WIUT Campus Occupancy Dashboard"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block', minHeight: 'calc(100vh - 140px)' }}
          allow="fullscreen"
        />
      </div>
    </div>
  );
};

export default GrafanaPage;
