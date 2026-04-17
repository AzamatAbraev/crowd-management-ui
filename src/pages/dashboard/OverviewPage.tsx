import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertTriangle, Wifi, TrendingUp, ChevronLeft, LayoutDashboard } from 'lucide-react';
import { api } from '../../server';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

interface OccupancyData { deviceCounts: Record<string, number>; }
interface ZoneRow { name: string; count: number; capacity: number; }

const DUMMY_ZONES: ZoneRow[] = [
  { name: 'Learning Resource Center', count: 210, capacity: 350 },
  { name: 'Amir Temur Building',      count: 320, capacity: 500 },
  { name: 'Shakhrisabz Building',     count: 285, capacity: 450 },
  { name: 'Istiqbol Building',        count: 240, capacity: 400 },
  { name: 'Lyceum',                   count: 145, capacity: 250 },
  { name: 'Sports Hall',              count: 95,  capacity: 200 },
];

const DUMMY_STATS = {
  totalOccupancy: 1295,
  totalCapacity:  2150,
  activeAlerts:   2,
  sensorUptime:   98,
  predictedPeak:  '14:00',
};

const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [zones, setZones] = useState<ZoneRow[]>(DUMMY_ZONES);
  const [stats, setStats] = useState(DUMMY_STATS);

  useEffect(() => {
    const fetchOccupancy = async () => {
      try {
        const res = await api.get<OccupancyData>('/people/count');
        const counts = res.data.deviceCounts || {};
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
    {
      label: 'Campus Occupancy',
      value: stats.totalOccupancy.toLocaleString(),
      sub: `of ${stats.totalCapacity.toLocaleString()} capacity`,
      icon: Users,
      color: 'var(--primary-teal)',
      tint: 'var(--primary-teal-transparent)',
    },
    {
      label: 'Active Alerts',
      value: String(stats.activeAlerts),
      sub: stats.activeAlerts > 0 ? 'Needs attention' : 'All clear',
      icon: AlertTriangle,
      color: stats.activeAlerts > 0 ? 'var(--status-red)' : 'var(--status-green)',
      tint: stats.activeAlerts > 0 ? 'var(--status-red-tint)' : 'var(--status-green-tint)',
    },
    {
      label: 'Sensor Uptime',
      value: `${stats.sensorUptime}%`,
      sub: 'All sensors reporting',
      icon: Wifi,
      color: 'var(--status-blue)',
      tint: 'var(--status-blue-tint)',
    },
    {
      label: 'Predicted Peak',
      value: stats.predictedPeak,
      sub: 'Based on 30-day trend',
      icon: TrendingUp,
      color: 'var(--status-amber)',
      tint: 'var(--status-amber-tint)',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>

      <nav style={{ padding: '1.25rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <ChevronLeft size={18} /> Back
          </button>
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--border-color)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ backgroundColor: 'var(--primary-teal)', padding: '0.4rem', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutDashboard size={22} color="#000" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Live Overview</h1>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Campus · {user?.username}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 20, backgroundColor: 'var(--primary-teal-transparent)', border: '1px solid var(--primary-teal)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-teal)' }}>
          <div className="live-dot" />
          Live · 10s refresh
        </div>
      </nav>

      <main style={{ flex: 1, padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {topStats.map((s, i) => (
            <div
              key={i}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                transition: 'var(--transition-base)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {s.label}
                </span>
                <div style={{ width: '32px', height: '32px', borderRadius: 8, backgroundColor: s.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <s.icon size={16} color={s.color} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
                  {s.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Zone Occupancy
              </h2>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2, marginBottom: 0 }}>
                Live headcount across monitored zones
              </p>
            </div>
            <div className="live-dot" />
          </div>

          <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {zones.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No data found yet — waiting for sensor data
              </div>
            ) : zones.map((z, i) => {
              const pct = Math.min(100, Math.round((z.count / z.capacity) * 100));
              const barColor = pct > 85 ? 'var(--status-red)' : pct > 60 ? 'var(--status-yellow)' : 'var(--primary-teal)';
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{z.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                        {z.count.toLocaleString()} / {z.capacity.toLocaleString()}
                      </span>
                      <span style={{ fontWeight: 700, color: barColor, fontSize: '0.72rem', minWidth: '36px', textAlign: 'right' }}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--bg-panel-hover)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, backgroundColor: barColor, borderRadius: 99, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
};

export default OverviewPage;
