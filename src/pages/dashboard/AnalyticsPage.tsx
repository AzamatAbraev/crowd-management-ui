import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// --- DUMMY DATA ---
// TODO: Replace with API call to /analytics/occupancy?range=7d or similar.
const WEEKLY_CHART = [
  { day: 'Mon', library: 68, union: 72, eng: 41 },
  { day: 'Tue', library: 75, union: 66, eng: 55 },
  { day: 'Wed', library: 82, union: 80, eng: 60 },
  { day: 'Thu', library: 90, union: 85, eng: 48 },
  { day: 'Fri', library: 70, union: 78, eng: 35 },
  { day: 'Sat', library: 40, union: 45, eng: 15 },
  { day: 'Sun', library: 20, union: 22, eng: 8  },
];

// TODO: Replace with API call to /analytics/summary?range=7d
const SUMMARY_STATS = [
  { label: 'Avg Daily Visitors', value: '14,820', change: '+12%', up: true },
  { label: 'Peak Occupancy',     value: '92%',   change: '+4%',  up: false },
  { label: 'Avg Stay Duration',  value: '1.4 hrs', change: '-5%', up: true },
  { label: 'Active Sensors',     value: '248',   change: 'Stable', up: true },
];

// TODO: Replace with API call to /analytics/buildings
const BUILDING_TABLE = [
  { name: 'Main Library',    footfall: 42501, avgOcc: 64, peak: '14:00–16:00', risk: 'High'     },
  { name: 'Student Union',   footfall: 38122, avgOcc: 62, peak: '12:00–13:30', risk: 'Moderate' },
  { name: 'Engineering Hall',footfall: 12400, avgOcc: 31, peak: '09:00–11:00', risk: 'Low'      },
];

const RISK_COLORS: Record<string, string> = {
  High:     'var(--status-red)',
  Moderate: 'var(--status-yellow)',
  Low:      'var(--status-green)',
};

const AnalyticsPage: React.FC = () => {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)' }}>Historical Analytics</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {(['7d', '30d', '90d'] as const).map(r => (
            <button key={r} onClick={() => setRange(r)} style={{ padding: '5px 12px', borderRadius: '6px', border: `1px solid ${range === r ? 'var(--primary-teal)' : 'var(--border-color)'}`, backgroundColor: range === r ? 'var(--primary-teal-transparent)' : 'transparent', color: range === r ? 'var(--primary-teal)' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
              {r}
            </button>
          ))}
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '5px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
        {SUMMARY_STATS.map((s, i) => (
          <div key={i} style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.1rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>{s.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>{s.value}</span>
              <span style={{ fontSize: '0.75rem', color: s.change.startsWith('+') && !s.up ? 'var(--status-red)' : 'var(--primary-teal)', fontWeight: 600 }}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Occupancy Trend Chart */}
      <div style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>Occupancy Trends ({range})</h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>% capacity by building</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
            {[['Library', 'var(--primary-teal)'], ['Union', '#3b82f6'], ['Engineering', '#a855f7']].map(([label, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: String(color) }} /> {label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={WEEKLY_CHART} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.8rem' }} formatter={(v) => [`${v}%`]} />
              <Line type="monotone" dataKey="library" stroke="var(--primary-teal)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="union" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="eng" stroke="#a855f7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Buildings Table */}
      <div style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>Building Summary</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
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
                <td style={{ padding: '0.875rem 1.5rem', fontWeight: 600, color: 'var(--text-main)' }}>{b.name}</td>
                <td style={{ padding: '0.875rem 1.5rem', color: 'var(--text-muted)' }}>{b.footfall.toLocaleString()}</td>
                <td style={{ padding: '0.875rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {b.avgOcc}%
                    <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--bg-panel-hover)', borderRadius: '2px', maxWidth: '60px' }}>
                      <div style={{ height: '100%', width: `${b.avgOcc}%`, backgroundColor: 'var(--primary-teal)', borderRadius: '2px' }} />
                    </div>
                  </div>
                </td>
                <td style={{ padding: '0.875rem 1.5rem', color: 'var(--text-muted)' }}>{b.peak}</td>
                <td style={{ padding: '0.875rem 1.5rem' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: `${RISK_COLORS[b.risk]}20`, color: RISK_COLORS[b.risk] }}>{b.risk}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsPage;
