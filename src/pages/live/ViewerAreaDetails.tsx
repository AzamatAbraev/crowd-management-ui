import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../server';
import { ArrowLeft, MapPin, Activity, Wifi, TrendingUp, AlertTriangle, Clock } from 'lucide-react';

interface OccupancyData {
  deviceCounts: Record<string, number>;
}

const MAX_AREA_CAPACITY = 50;

// Dummy historical data per hour block for the chart
const HOURLY_DUMMY = [
  { label: '8am', pct: 10 }, { label: '9am', pct: 35 }, { label: '10am', pct: 75 },
  { label: '11am', pct: 90 }, { label: '12pm', pct: 65 }, { label: '1pm', pct: 50 },
  { label: '2pm', pct: 80 }, { label: '3pm', pct: 60 }, { label: '4pm', pct: 30 },
  { label: '5pm', pct: 15 },
];

// Dummy sensor events for the area feed
const DUMMY_EVENTS = [
  { time: '10:42', type: 'entry', count: 3, icon: '→' },
  { time: '10:38', type: 'exit', count: 1, icon: '←' },
  { time: '10:31', type: 'entry', count: 5, icon: '→' },
  { time: '10:20', type: 'alert', count: 0, icon: '⚠', note: 'Occupancy above 80%' },
  { time: '10:15', type: 'exit', count: 2, icon: '←' },
];

const ViewerAreaDetails: React.FC = () => {
  const { areaId } = useParams<{ areaId: string }>();
  const navigate = useNavigate();

  const [deviceCounts, setDeviceCounts] = useState<Record<string, number>>({});

  const fetchCount = async (): Promise<void> => {
    try {
      const response = await api.get<OccupancyData>('/people/count');
      setDeviceCounts(response.data.deviceCounts || {});
    } catch {
      // fail silently, show 0
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 5000);
    return () => clearInterval(interval);
  }, [areaId]);

  const rawCount = Math.max(0, deviceCounts[areaId || ''] || 0);
  let percentage = Math.round((rawCount / MAX_AREA_CAPACITY) * 100);
  if (percentage > 100) percentage = 100;

  const isCrowded = percentage > 85;
  const isActive = percentage > 50;
  const indicatorColor = isCrowded ? 'var(--status-red)' : isActive ? 'var(--status-yellow)' : 'var(--primary-teal)';
  const statusText = isCrowded ? 'Crowded' : isActive ? 'Active' : 'Quiet';

  const peakHour = HOURLY_DUMMY.reduce((max, h) => h.pct > max.pct ? h : max, HOURLY_DUMMY[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-main)', textTransform: 'capitalize' }}>
              {(areaId || 'Unknown').replace(/-/g, ' ')}
            </h1>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={14} /> Sensor-Monitored Area
            </p>
          </div>

          {/* Live Occupancy Badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', backgroundColor: 'var(--bg-panel)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Live Occupancy</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, padding: '4px 12px', borderRadius: '16px', backgroundColor: `${indicatorColor}20`, color: indicatorColor, textTransform: 'uppercase' }}>
                {statusText}
              </span>
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>{percentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

        {/* Left Column: Stats + Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Quick Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { label: 'Current Count', value: String(rawCount), icon: Activity, color: indicatorColor },
              { label: 'Peak Today', value: peakHour.label, icon: TrendingUp, color: 'var(--primary-teal)' },
              { label: 'Sensor Status', value: 'Online', icon: Wifi, color: 'var(--status-green)' },
              { label: 'Last Update', value: 'just now', icon: Clock, color: 'var(--text-muted)' },
            ].map((stat, i) => (
              <div key={i} style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <stat.icon size={18} color={stat.color} />
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Hourly Occupancy Chart */}
          <div style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1rem' }}>Today's Occupancy Flow</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '80px' }}>
              {HOURLY_DUMMY.map((h, i) => {
                const barColor = h.pct > 80 ? 'var(--status-red)' : h.pct > 50 ? 'var(--status-yellow)' : 'var(--primary-teal)';
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '100%', height: `${h.pct * 0.75}px`, backgroundColor: barColor, borderRadius: '3px 3px 0 0', opacity: 0.85 }} />
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>{h.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Capacity progress */}
          <div style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Capacity Used</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: indicatorColor }}>{percentage}% / 100%</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'var(--bg-panel-hover)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${percentage}%`, backgroundColor: indicatorColor, borderRadius: '4px', transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Max capacity: {MAX_AREA_CAPACITY} people</div>
          </div>
        </div>

        {/* Right Column: Sensor Event Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', flex: 1 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={14} color="var(--primary-teal)" /> Sensor Event Log
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {DUMMY_EVENTS.map((ev, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', backgroundColor: ev.type === 'alert' ? 'rgba(239,68,68,0.06)' : 'var(--bg-dark)', borderRadius: '8px', border: `1px solid ${ev.type === 'alert' ? 'var(--status-red)' : 'var(--border-color)'}` }}>
                  <span style={{ fontSize: '0.95rem', color: ev.type === 'entry' ? 'var(--status-green)' : ev.type === 'exit' ? 'var(--status-blue)' : 'var(--status-red)' }}>{ev.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {ev.type === 'alert'
                      ? <span style={{ fontSize: '0.8rem', color: 'var(--status-red)', fontWeight: 600 }}>{ev.note}</span>
                      : <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 500 }}>{ev.count} person{ev.count !== 1 ? 's' : ''} {ev.type === 'entry' ? 'entered' : 'exited'}</span>
                    }
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>{ev.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts panel */}
          <div style={{ backgroundColor: 'var(--bg-panel)', border: `1px solid ${isCrowded ? 'var(--status-red)' : 'var(--border-color)'}`, borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <AlertTriangle size={16} color={isCrowded ? 'var(--status-red)' : 'var(--text-muted)'} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isCrowded ? 'var(--status-red)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isCrowded ? 'Crowd Alert Active' : 'No Active Alerts'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {isCrowded
                ? 'This area is near or at capacity. Consider redirecting to nearby spaces.'
                : 'Occupancy levels are within safe thresholds. Area is operating normally.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerAreaDetails;
