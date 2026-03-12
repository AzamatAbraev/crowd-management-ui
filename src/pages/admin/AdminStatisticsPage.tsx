import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ChevronLeft, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

// ── Dummy data (replace with real API calls when endpoint available) ──
const WEEKLY_CHART = [
  { day: 'Mon', library: 68, union: 72, eng: 41 },
  { day: 'Tue', library: 75, union: 66, eng: 55 },
  { day: 'Wed', library: 82, union: 80, eng: 60 },
  { day: 'Thu', library: 90, union: 85, eng: 48 },
  { day: 'Fri', library: 70, union: 78, eng: 35 },
  { day: 'Sat', library: 40, union: 45, eng: 15 },
  { day: 'Sun', library: 20, union: 22, eng: 8 },
];

const SUMMARY_STATS = [
  { label: 'Avg Daily Visitors', value: '14,820', change: '+12%' },
  { label: 'Peak Occupancy',     value: '92%',   change: '+4%' },
  { label: 'Avg Stay Duration',  value: '1.4 hrs', change: '-5%' },
  { label: 'Active Sensors',     value: '248',   change: 'Stable' },
];

const BUILDING_TABLE = [
  { name: 'Main Library',     footfall: 42501, avgOcc: 64, peak: '14:00–16:00', risk: 'High' },
  { name: 'Student Union',    footfall: 38122, avgOcc: 62, peak: '12:00–13:30', risk: 'Moderate' },
  { name: 'Engineering Hall', footfall: 12400, avgOcc: 31, peak: '09:00–11:00', risk: 'Low' },
];

const RISK_COLORS: Record<string, string> = { High: 'var(--status-red)', Moderate: 'var(--status-yellow)', Low: 'var(--status-green)' };

const AdminStatisticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d');

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
            <div style={{ backgroundColor: '#a855f7', padding: '0.4rem', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={22} color="#fff" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Statistics & Analytics</h1>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Historical Data · {user?.username}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {(['7d', '30d', '90d'] as const).map(r => (
            <button key={r} onClick={() => setRange(r)} style={{ padding: '5px 14px', borderRadius: 7, border: `1px solid ${range === r ? 'var(--primary-teal)' : 'var(--border-color)'}`, backgroundColor: range === r ? 'var(--primary-teal-transparent)' : 'transparent', color: range === r ? 'var(--primary-teal)' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
              {r}
            </button>
          ))}
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 14px', borderRadius: 7, border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
            <Download size={13} /> Export
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
          {SUMMARY_STATS.map((s, i) => (
            <div key={i} className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>{s.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{s.value}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-teal)', fontWeight: 600 }}>{s.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Occupancy trend chart */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>Occupancy Trends ({range})</h3>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>% capacity by building</p>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.75rem', fontWeight: 600 }}>
              {[['Library', 'var(--primary-teal)'], ['Union', '#3b82f6'], ['Engineering', '#a855f7']].map(([label, color]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, color: color as string }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color as string }} /> {label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_CHART} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: '0.8rem' }} formatter={(v) => [`${v}%`]} />
                <Line type="monotone" dataKey="library" stroke="var(--primary-teal)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="union" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="eng" stroke="#a855f7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Buildings summary table */}
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Building Summary</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-panel-hover)' }}>
                {['Building', 'Total Footfall', 'Avg Occupancy', 'Peak Hours', 'Risk'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BUILDING_TABLE.map((b, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.875rem 1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{b.name}</td>
                  <td style={{ padding: '0.875rem 1.5rem', color: 'var(--text-muted)' }}>{b.footfall.toLocaleString()}</td>
                  <td style={{ padding: '0.875rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {b.avgOcc}%
                      <div style={{ flex: 1, height: 4, backgroundColor: 'var(--bg-panel-hover)', borderRadius: 2, maxWidth: 60 }}>
                        <div style={{ height: '100%', width: `${b.avgOcc}%`, backgroundColor: 'var(--primary-teal)', borderRadius: 2 }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1.5rem', color: 'var(--text-muted)' }}>{b.peak}</td>
                  <td style={{ padding: '0.875rem 1.5rem' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700, backgroundColor: `${RISK_COLORS[b.risk]}22`, color: RISK_COLORS[b.risk] }}>{b.risk}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminStatisticsPage;
