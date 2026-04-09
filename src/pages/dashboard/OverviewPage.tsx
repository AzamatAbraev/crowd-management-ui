import React, { useEffect, useState } from 'react';
import { Users, AlertTriangle, Wifi, TrendingUp } from 'lucide-react';
import { api } from '../../server';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="animate-in stagger-1">
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: 'var(--space-1)' }}>
          Live Overview
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Real-time campus occupancy — refreshes every 10 seconds
        </p>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
        {topStats.map((s, i) => (
          <div
            key={i}
            className={`animate-in stagger-${i + 2}`}
            style={{
              backgroundColor: 'var(--bg-panel)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-5)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              transition: 'var(--transition-base)',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
              }}>
                {s.label}
              </span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: s.tint,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <s.icon size={16} color={s.color} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
                {s.value}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-1)', fontWeight: 500 }}>
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Zone Occupancy ───────────────────────────────────────── */}
      <div
        className="animate-in stagger-6"
        style={{
          backgroundColor: 'var(--bg-panel)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Table header */}
        <div style={{
          padding: 'var(--space-4) var(--space-6)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              Zone Occupancy
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
              Live headcount across monitored zones
            </p>
          </div>
          <div className="live-dot" />
        </div>

        {/* Zone rows */}
        <div style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {zones.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No data found yet — waiting for sensor data
            </div>
          ) : zones.map((z, i) => {
            const pct = Math.min(100, Math.round((z.count / z.capacity) * 100));
            const barColor = pct > 85 ? 'var(--status-red)' : pct > 60 ? 'var(--status-yellow)' : 'var(--primary-teal)';
            return (
              <div key={i}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--space-2)',
                  fontSize: '0.875rem',
                }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{z.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums' }}>
                      {z.count.toLocaleString()} / {z.capacity.toLocaleString()}
                    </span>
                    <span style={{
                      fontWeight: 700,
                      color: barColor,
                      fontSize: 'var(--text-xs)',
                      fontVariantNumeric: 'tabular-nums',
                      minWidth: '36px',
                      textAlign: 'right',
                    }}>
                      {pct}%
                    </span>
                  </div>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-panel-hover)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    backgroundColor: barColor,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  }} />
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
