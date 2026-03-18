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



const AnalyticsPage: React.FC = () => {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div className="animate-in stagger-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Historical Analytics</h1>
          <p style={{ margin: 'var(--space-1) 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Occupancy trends and building-level insights</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-1)', alignItems: 'center' }}>
          {(['7d', '30d', '90d'] as const).map(r => (
            <button key={r} onClick={() => setRange(r)} className="btn" style={{
              padding: '4px 12px',
              fontSize: '0.8125rem',
              background: range === r ? 'var(--primary-teal-transparent)' : 'transparent',
              color: range === r ? 'var(--primary-teal)' : 'var(--text-muted)',
              border: `1px solid ${range === r ? 'var(--primary-teal)' : 'var(--border-color)'}`,
            }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
              onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {r}
            </button>
          ))}
          <button className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: '0.8125rem', gap: 'var(--space-1)' }}>
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-4)' }}>
        {SUMMARY_STATS.map((s, i) => (
          <div key={i} style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="section-label" style={{ marginBottom: 'var(--space-2)' }}>{s.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{s.value}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: s.change.startsWith('+') && !s.up ? 'var(--status-red)' : 'var(--primary-teal)', fontWeight: 700 }}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Occupancy Trend Chart */}
      <div style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-5)' }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9375rem', letterSpacing: '-0.01em' }}>Occupancy Trends <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>({range})</span></h3>
            <p style={{ margin: 'var(--space-1) 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>% capacity utilization by building</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
            {[['Library', 'var(--primary-teal)'], ['Union', 'var(--status-blue)'], ['Engineering', 'var(--status-purple)']].map(([label, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color }}>
                <div style={{ width: '8px', height: '2px', borderRadius: '1px', backgroundColor: String(color) }} /> {label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={WEEKLY_CHART} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--border-color)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', boxShadow: 'var(--shadow-md)' }} formatter={(v) => [`${v}%`]} />
              <Line type="monotone" dataKey="library" stroke="var(--primary-teal)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="union" stroke="var(--status-blue)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="eng" stroke="var(--status-purple)" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Buildings Table */}
      <div style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>Building Summary</div>
        <table className="data-table">
          <thead>
            <tr>
              {['Building', 'Total Footfall', 'Avg Occupancy', 'Peak Hours', 'Risk Level'].map((h, i) => (
                <th key={h} className={i >= 1 && i <= 2 ? 'right' : ''}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BUILDING_TABLE.map((b, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{b.name}</td>
                <td className="right" style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>{b.footfall.toLocaleString()}</td>
                <td className="right">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--text-main)' }}>{b.avgOcc}%</span>
                    <div style={{ width: '48px', height: '4px', backgroundColor: 'var(--bg-panel-hover)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${b.avgOcc}%`, backgroundColor: 'var(--primary-teal)', borderRadius: 'var(--radius-full)' }} />
                    </div>
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{b.peak}</td>
                <td>
                  <span className={`badge badge-${b.risk === 'High' ? 'red' : b.risk === 'Moderate' ? 'yellow' : 'green'}`}>{b.risk}</span>
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
