import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ChevronLeft, Save, ToggleLeft, ToggleRight, Globe, Bell, Shield, Database } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void }> = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: value ? 'var(--primary-teal)' : 'var(--text-muted)' }}>
    {value ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
  </button>
);

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; description: string; children: React.ReactNode }> = ({ icon, title, description, children }) => (
  <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ backgroundColor: 'var(--bg-panel-hover)', padding: '0.6rem', borderRadius: 8, color: 'var(--primary-teal)', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>{title}</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{description}</div>
      </div>
    </div>
    {children}
  </div>
);

const SettingRow: React.FC<{ label: string; description?: string; children: React.ReactNode }> = ({ label, description, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
    <div>
      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>{label}</div>
      {description && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{description}</div>}
    </div>
    {children}
  </div>
);

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string; mono?: boolean }> = ({ label, value, onChange, type = 'text', mono }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      style={{ padding: '0.6rem 0.85rem', borderRadius: 7, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', fontSize: mono ? '0.82rem' : '0.9rem', fontFamily: mono ? 'monospace' : undefined, outline: 'none' }} />
  </div>
);

const Toast: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', backgroundColor: 'var(--primary-teal)', color: '#fff', padding: '0.85rem 1.5rem', borderRadius: 10, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeIn 0.2s ease' }}>
    <Save size={16} /> Settings saved successfully!
    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 4 }}>✕</button>
  </div>
);

const AdminSystemManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [appName, setAppName] = useState('Joy Bo\'shmi Crowd System');
  const [timezone, setTimezone] = useState('Asia/Tashkent');
  const [maxCapacity, setMaxCapacity] = useState('500');

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState('80');
  const [alertEmail, setAlertEmail] = useState('admin@university.uz');

  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [forceHttps, setForceHttps] = useState(true);
  const [auditLogging, setAuditLogging] = useState(true);

  const [retentionDays, setRetentionDays] = useState('90');
  const [autoArchive, setAutoArchive] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '1.25rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <ChevronLeft size={18} /> Back
          </button>
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--border-color)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ backgroundColor: '#8a9eff', padding: '0.4rem', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={22} color="#fff" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>System Management</h1>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Configuration · {user?.username}</div>
            </div>
          </div>
        </div>
        <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0.6rem 1.2rem', borderRadius: 9, border: 'none', backgroundColor: 'var(--primary-teal)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>
          <Save size={15} /> Save Changes
        </button>
      </nav>

      <main style={{ flex: 1, padding: '2rem 2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignContent: 'start' }}>

        <SectionCard icon={<Globe size={20} />} title="General" description="Core application settings and campus configuration.">
          <Field label="Application Name" value={appName} onChange={setAppName} />
          <Field label="Timezone" value={timezone} onChange={setTimezone} />
          <Field label="Default Max Capacity" value={maxCapacity} onChange={setMaxCapacity} type="number" />
        </SectionCard>

        <SectionCard icon={<Bell size={20} />} title="Notifications" description="Alert thresholds and notification channels for crowd events.">
          <SettingRow label="Email Alerts" description="Send email when threshold is exceeded"><Toggle value={emailAlerts} onChange={setEmailAlerts} /></SettingRow>
          <SettingRow label="Slack Alerts" description="Post alerts to a Slack channel"><Toggle value={slackAlerts} onChange={setSlackAlerts} /></SettingRow>
          <Field label="Alert Threshold (%)" value={alertThreshold} onChange={setAlertThreshold} type="number" />
          {emailAlerts && <Field label="Alert Email" value={alertEmail} onChange={setAlertEmail} type="email" />}
        </SectionCard>

        <SectionCard icon={<Shield size={20} />} title="Security" description="Session policies, encryption, and audit settings.">
          <Field label="Session Timeout (minutes)" value={sessionTimeout} onChange={setSessionTimeout} type="number" />
          <SettingRow label="Force HTTPS" description="Redirect all traffic to HTTPS"><Toggle value={forceHttps} onChange={setForceHttps} /></SettingRow>
          <SettingRow label="Audit Logging" description="Log all admin actions for compliance"><Toggle value={auditLogging} onChange={setAuditLogging} /></SettingRow>
        </SectionCard>

        <SectionCard icon={<Database size={20} />} title="Data Retention" description="Historical data storage and archival lifecycle rules.">
          <Field label="Retention Period (days)" value={retentionDays} onChange={setRetentionDays} type="number" />
          <SettingRow label="Auto-Archive" description="Automatically archive data older than retention period"><Toggle value={autoArchive} onChange={setAutoArchive} /></SettingRow>
          <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ⚠ Purging data destroys all historical records. Ensure archival is enabled before reducing retention.
          </div>
        </SectionCard>

      </main>

      {saved && <Toast onClose={() => setSaved(false)} />}

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
};

export default AdminSystemManagementPage;
