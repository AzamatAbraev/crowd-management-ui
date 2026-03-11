import React, { useEffect, useState } from 'react';
import { Users, AlertTriangle, Wifi, TrendingUp } from 'lucide-react';
import { api } from '../../server';

// --- DATA TYPES ---
// TODO: Replace with real API results when available
interface OccupancyData { deviceCounts: Record<string, number>; }

interface ZoneRow { name: string; count: number; capacity: number; }

// --- DUMMY / FALLBACK DATA ---
// Replace each array/value below with a real API call in a future sprint.
const DUMMY_ZONES: ZoneRow[] = [
  { name: 'Main Library', count: 312, capacity: 400 },
  { name: 'Student Union', count: 280, capacity: 350 },
  { name: 'Engineering Hall', count: 95,  capacity: 200 },
  { name: 'Science Complex', count: 140, capacity: 220 },
  { name: 'Lecture Hall A', count: 180, capacity: 200 },
];

const DUMMY_STATS = {
  totalOccupancy: 1007,
  totalCapacity: 1370,
  activeAlerts: 2,
  sensorUptime: 98,  // percent
  predictedPeak: '14:00',
};

const OverviewPage: React.FC = () => {
  const [zones, setZones] = useState<ZoneRow[]>(DUMMY_ZONES);
  const [stats, setStats] = useState(DUMMY_STATS);

  // TODO: Replace this effect with real API fetching
  useEffect(() => {
    const fetchOccupancy = async () => {
      try {
        const res = await api.get<OccupancyData>('/people/count');
        const counts = res.data.deviceCounts || {};
        // Map real counts onto zones by id when API is wired
        // For now, just patch if matching keys exist
        setZones(prev => prev.map(z => ({ ...z, count: counts[z.name] ?? z.count })));
        const total = Object.values(counts).reduce((s, v) => s + v, 0);
        if (total > 0) setStats(p => ({ ...p, totalOccupancy: total }));
      } catch { /* keep dummy data */ }
    };
    fetchOccupancy();
    const t = setInterval(fetchOccupancy, 10000);
    return () => clearInterval(t);
  }, []);

  const topStats = [
    { label: 'Total Occupancy', value: `${stats.totalOccupancy.toLocaleString()} / ${stats.totalCapacity.toLocaleString()}`, icon: Users, color: 'var(--primary-teal)' },
    { label: 'Active Alerts', value: String(stats.activeAlerts), icon: AlertTriangle, color: stats.activeAlerts > 0 ? 'var(--status-red)' : 'var(--status-green)' },
    { label: 'Sensor Uptime', value: `${stats.sensorUptime}%`, icon: Wifi, color: 'var(--status-green)' },
    { label: 'Predicted Peak', value: stats.predictedPeak, icon: TrendingUp, color: 'var(--primary-teal)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)' }}>Live Overview</h1>

      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
        {topStats.map((s, i) => (
          <div key={i} style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</span>
              <s.icon size={18} color={s.color} />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Zone Occupancy Table */}
      <div style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>
          Zone Occupancy
        </div>
        <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {zones.map((z, i) => {
            const pct = Math.min(100, Math.round((z.count / z.capacity) * 100));
            const barColor = pct > 85 ? 'var(--status-red)' : pct > 60 ? 'var(--status-yellow)' : 'var(--primary-teal)';
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{z.name}</span>
                  <span style={{ color: barColor, fontWeight: 600 }}>{pct}% · {z.count}/{z.capacity}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-panel-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, backgroundColor: barColor, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
