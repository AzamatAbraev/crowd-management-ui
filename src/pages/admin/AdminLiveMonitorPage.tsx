import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Activity, Wifi, WifiOff, Server, Radio,
  RefreshCw, Clock, MapPin, AlertTriangle, CheckCircle, Cpu,
} from 'lucide-react';
import { api } from '../../server';
import type { AxiosResponse } from 'axios';
import { deviceService } from '../../services/deviceService';
import { buildingService } from '../../services/buildingService';
import { useAuth } from '../../contexts/AuthContext';
import type { Device } from '../../types/device';
import type { Building } from '../../types/building';
import '../../styles/dashboard.css';

interface OccupancyData {
  count: number;
  lastDevice: string;
  systemStatus: string;
  activeNodes: number;
  deviceCounts: Record<string, number>;
}

interface EventLogEntry {
  id: number;
  time: string;
  device: string;
  direction: 'entry' | 'exit';
  total: number;
}

const secondsAgo = (ts: string | undefined): number => {
  if (!ts) return Infinity;
  const d = new Date(ts);
  if (isNaN(d.getTime())) return Infinity;
  return Math.floor((Date.now() - d.getTime()) / 1000);
};

const formatLastSeen = (ts: string | undefined): string => {
  if (!ts) return 'Never';
  const s = secondsAgo(ts);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};


const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string; subtitle?: string }> = ({ icon, label, value, color, subtitle }) => (
  <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
    <div style={{ backgroundColor: color + '18', color, padding: '0.65rem', borderRadius: 10, display: 'flex', flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 3 }}>{label}</div>
      {subtitle && <div style={{ fontSize: '0.7rem', color, marginTop: 2, fontWeight: 600 }}>{subtitle}</div>}
    </div>
  </div>
);

const AdminLiveMonitorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [occupancy, setOccupancy] = useState<OccupancyData | null>(null);
  const [devices, setDevices] = useState<Record<string, Device>>({});
  const [buildings, setBuildings] = useState<Record<string, Building>>({});
  const [isPolling, setIsPolling] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [apiStatus, setApiStatus] = useState<'connecting' | 'live' | 'error'>('connecting');
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
  const eventIdRef = useRef(0);
  const prevCountRef = useRef<Record<string, number>>({});

  const fetchMeta = useCallback(async () => {
    try {
      const [devs, bldgs] = await Promise.all([
        deviceService.getAllDevices(),
        buildingService.getAllBuildings(),
      ]);
      const dm: Record<string, Device> = {};
      devs.forEach(d => dm[d.id] = d);
      setDevices(dm);

      const bm: Record<string, Building> = {};
      bldgs.forEach(b => bm[b.id] = b);
      setBuildings(bm);
    } catch { /* silent */ }
  }, []);

  const fetchOccupancy = useCallback(async () => {
    try {
      const res: AxiosResponse<OccupancyData> = await api.get('/people/count');
      const data = res.data;
      setOccupancy(data);
      setLastUpdated(new Date().toLocaleTimeString());
      setApiStatus('live');

      const prev = prevCountRef.current;
      const newEntries: EventLogEntry[] = [];
      Object.entries(data.deviceCounts || {}).forEach(([deviceId, newVal]) => {
        const oldVal = prev[deviceId] ?? 0;
        const diff = newVal - oldVal;
        if (diff !== 0) {
          eventIdRef.current += 1;
          newEntries.push({
            id: eventIdRef.current,
            time: new Date().toLocaleTimeString(),
            device: deviceId,
            direction: diff > 0 ? 'entry' : 'exit',
            total: data.count,
          });
        }
      });
      prevCountRef.current = { ...data.deviceCounts };

      if (newEntries.length > 0) {
        setEventLog(prev => [...newEntries, ...prev].slice(0, 50));
      }
    } catch {
      setApiStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchMeta();
    const metaInt = setInterval(fetchMeta, 10000);
    return () => clearInterval(metaInt);
  }, [fetchMeta]);

  useEffect(() => {
    fetchOccupancy();
    if (!isPolling) return;
    const countInt = setInterval(fetchOccupancy, 3000);
    return () => clearInterval(countInt);
  }, [isPolling, fetchOccupancy]);

  const allDevs = Object.values(devices);
  const onlineCount = allDevs.filter(d => d.status === 'ONLINE').length;
  const offlineCount = allDevs.filter(d => d.status === 'OFFLINE').length;
  const staleCount = allDevs.filter(d => d.status === 'ONLINE' && secondsAgo(d.lastSeen) > 60).length;
  const totalCount = occupancy?.count ?? 0;
  const activeNodes = occupancy?.activeNodes ?? 0;

  const statusColor = apiStatus === 'live' ? 'var(--status-green)' : apiStatus === 'error' ? 'var(--status-red)' : 'var(--status-yellow)';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>

      {/* Topbar */}
      <nav style={{ padding: '1.1rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <ChevronLeft size={18} /> Back
          </button>
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--border-color)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ backgroundColor: 'var(--status-green)', padding: '0.4rem', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Radio size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Live Monitor</h1>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Real-Time · {user?.username}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          {/* API status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 12px', borderRadius: 20, backgroundColor: statusColor + '18', border: `1px solid ${statusColor}44`, fontSize: '0.8rem', fontWeight: 700, color: statusColor }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: statusColor, animation: apiStatus === 'live' ? 'pulse 1.5s infinite' : 'none' }} />
            {apiStatus === 'live' ? `Live · ${lastUpdated}` : apiStatus === 'error' ? 'API Error' : 'Connecting…'}
          </div>

          <button onClick={() => setIsPolling(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 7, border: `1px solid var(--primary-teal)`, backgroundColor: isPolling ? 'var(--primary-teal-transparent)' : 'transparent', color: 'var(--primary-teal)', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>
            <RefreshCw size={13} className={isPolling ? 'spin' : ''} />
            {isPolling ? 'Pause' : 'Resume'}
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '1.75rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.875rem' }}>
          <StatCard icon={<Activity size={22} />} label="People Inside" value={totalCount} color="#3b82f6" subtitle="current occupancy" />
          <StatCard icon={<Server size={22} />} label="Total Fleet" value={allDevs.length} color="var(--text-muted)" subtitle="registered devices" />
          <StatCard icon={<Wifi size={22} />} label="Online" value={onlineCount} color="var(--status-green)" subtitle="healthy devices" />
          <StatCard icon={<WifiOff size={22} />} label="Offline" value={offlineCount} color="var(--status-red)" subtitle="via MQTT LWT" />
          <StatCard icon={<Cpu size={22} />} label="Reporting Now" value={activeNodes} color="var(--primary-teal)" subtitle="sent telemetry" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem', flex: 1, alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Device Grid
              </h2>
              {staleCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--status-yellow)', fontSize: '0.78rem', fontWeight: 700 }}>
                  <AlertTriangle size={14} /> {staleCount} stale node{staleCount > 1 ? 's' : ''}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.75rem' }}>
              {Object.entries(occupancy?.deviceCounts ?? {})
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([deviceId, netDelta]) => {
                  const dev = devices[deviceId];
                  const bldg = dev?.location ? buildings[dev.location] : null;
                  const isOnline = dev?.status === 'ONLINE';
                  const isOffline = dev?.status === 'OFFLINE';
                  const stale = isOnline && secondsAgo(dev?.lastSeen) > 60;
                  const dotColor = isOffline ? 'var(--status-red)' : stale ? 'var(--status-yellow)' : isOnline ? 'var(--status-green)' : 'var(--text-muted)';
                  const statusLabel = isOffline ? 'OFFLINE' : stale ? 'STALE' : isOnline ? 'ONLINE' : '—';

                  return (
                    <div key={deviceId} style={{
                      padding: '1rem', borderRadius: 10, border: `1px solid ${isOffline ? 'rgba(239,68,68,0.35)' : stale ? 'rgba(245,158,11,0.35)' : 'var(--border-color)'}`,
                      backgroundColor: isOffline ? 'rgba(239,68,68,0.04)' : 'var(--bg-panel)',
                      display: 'flex', flexDirection: 'column', gap: '0.6rem',
                      opacity: isOffline ? 0.7 : 1, transition: 'all 0.3s',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {dev?.name || deviceId.toUpperCase()}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: dotColor, animation: isOnline && !stale ? 'pulse 2s infinite' : 'none' }} />
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: dotColor, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{statusLabel}</span>
                          </div>
                        </div>

                        <div style={{
                          fontSize: '1.3rem', fontWeight: 800,
                          color: netDelta > 0 ? 'var(--primary-teal)' : netDelta < 0 ? 'var(--status-red)' : 'var(--text-muted)',
                        }}>
                          {netDelta > 0 ? `+${netDelta}` : netDelta}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <MapPin size={10} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {bldg?.name ?? dev?.location ?? 'Unassigned'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: isOffline ? 'var(--status-red)' : 'var(--text-muted)' }}>
                          <Clock size={10} />
                          {formatLastSeen(dev?.lastSeen)}
                        </div>
                        {dev?.firmwareVersion && (
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            fw {dev.firmwareVersion}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

              {allDevs.filter(d => d.status === 'OFFLINE' && !(occupancy?.deviceCounts ?? {})[d.id]).map(dev => (
                <div key={dev.id} style={{
                  padding: '1rem', borderRadius: 10, border: '1px solid rgba(239,68,68,0.35)',
                  backgroundColor: 'rgba(239,68,68,0.04)', display: 'flex', flexDirection: 'column', gap: '0.6rem', opacity: 0.65,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>{dev.name || dev.id.toUpperCase()}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--status-red)' }} />
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--status-red)', textTransform: 'uppercase' }}>OFFLINE</span>
                      </div>
                    </div>
                    <WifiOff size={16} color="var(--status-red)" />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--status-red)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={10} />{formatLastSeen(dev.lastSeen)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', maxHeight: '78vh', position: 'sticky', top: '1.75rem' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Event Log</div>
              <button onClick={() => setEventLog([])} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 600 }}>Clear</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
              {eventLog.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  Waiting for events…
                </div>
              ) : eventLog.map(e => (
                <div key={e.id} style={{
                  padding: '0.55rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
                  borderBottom: '1px solid var(--border-color)', animation: 'fadeIn 0.25s ease',
                }}>
                  {e.direction === 'entry'
                    ? <CheckCircle size={14} color="var(--status-green)" style={{ flexShrink: 0 }} />
                    : <Activity size={14} color="var(--status-red)" style={{ flexShrink: 0 }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase' }}>
                      {e.direction === 'entry' ? '↑ Entry' : '↓ Exit'}
                      <span style={{ marginLeft: 6, color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none' }}>
                        · total {e.total}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {e.device}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', flexShrink: 0 }}>{e.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
        @keyframes fadeIn  { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
        .spin { animation: spin 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default AdminLiveMonitorPage;
