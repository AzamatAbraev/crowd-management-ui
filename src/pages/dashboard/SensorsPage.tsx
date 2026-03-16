import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../server';
import { AxiosError, type AxiosResponse } from 'axios';
import { Radio, Activity, RefreshCw, MapPin, Clock, Wifi, WifiOff, Server } from 'lucide-react';
import { deviceService } from '../../services/deviceService';
import { buildingService } from '../../services/buildingService';
import type { Device } from '../../types/device';
import type { Building } from '../../types/building';

interface OccupancyData {
  count: number;
  lastDevice: string;
  systemStatus: string;
  activeNodes: number;
  deviceCounts: Record<string, number>;
}

// Counts how many seconds ago a timestamp string was
const secondsAgo = (ts: string | undefined): number => {
  if (!ts) return Infinity;
  const d = new Date(ts);
  if (isNaN(d.getTime())) return Infinity;
  return Math.floor((Date.now() - d.getTime()) / 1000);
};

const formatLastSeen = (ts: string | undefined): string => {
  if (!ts) return 'Never';
  const secs = secondsAgo(ts);
  if (secs < 60)  return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
};

// ── Fleet stat pill ────────────────────────────────────────────────────────────
const FleetStat: React.FC<{ icon: React.ReactNode; label: string; value: number; color: string }> = ({ icon, label, value, color }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.85rem 1.25rem', backgroundColor: 'var(--bg-panel)',
    border: '1px solid var(--border-color)', borderRadius: 10,
    flex: 1,
  }}>
    <div style={{ color, display: 'flex' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: 2 }}>{label}</div>
    </div>
  </div>
);

const SensorsPage: React.FC = () => {
  const [count, setCount]               = useState<number>(0);
  const [lastUpdated, setLastUpdated]   = useState<string>('');
  const [status, setStatus]             = useState<string>('Connecting...');
  const [isPolling, setIsPolling]       = useState<boolean>(true);
  const [lastDevice, setLastDevice]     = useState<string>('None');
  const [systemStatus, setSystemStatus] = useState<string>('UNKNOWN');
  const [activeNodes, setActiveNodes]   = useState<number>(0);
  const [deviceCounts, setDeviceCounts] = useState<Record<string, number>>({});
  const [devicesData, setDevicesData]   = useState<Record<string, Device>>({});
  const [buildingsData, setBuildingsData] = useState<Record<string, Building>>({});

  const API_URL = '/people/count';

  // ── Metadata fetch ───────────────────────────────────────────────────────────
  // Previously called only once (on mount). Now also polled every 10 seconds
  // so device ONLINE/OFFLINE status from MQTT LWT is reflected in the UI
  // without a page refresh.
  const fetchMetadata = useCallback(async () => {
    try {
      const [devs, bldgs] = await Promise.all([
        deviceService.getAllDevices(),
        buildingService.getAllBuildings(),
      ]);

      const devMap: Record<string, Device> = {};
      devs.forEach(d => devMap[d.id] = d);
      setDevicesData(devMap);

      const bldgMap: Record<string, Building> = {};
      bldgs.forEach(b => bldgMap[b.id] = b);
      setBuildingsData(bldgMap);
    } catch (e) {
      console.error('Failed to load metadata', e);
    }
  }, []);

  // ── Count fetch ──────────────────────────────────────────────────────────────
  const fetchCount = useCallback(async (): Promise<void> => {
    try {
      const response: AxiosResponse<OccupancyData> = await api.get(API_URL);
      setCount(response.data.count);
      setLastDevice(response.data.lastDevice);
      setSystemStatus(response.data.systemStatus);
      setActiveNodes(response.data.activeNodes);
      setDeviceCounts(response.data.deviceCounts || {});
      setLastUpdated(new Date().toLocaleTimeString());
      setStatus('Connected (Live Feed)');
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 401) {
        window.location.href = 'http://localhost:8082/oauth2/authorization/keycloak';
      } else {
        console.error('Fetch error:', err.message);
        setStatus('Error Connecting to IoT Device');
      }
    }
  }, []);

  // ── Polling effects ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchMetadata();
    // Re-fetch device metadata every 10s so ONLINE/OFFLINE state from
    // MQTT LWT is reflected without a manual refresh
    const metaInterval = setInterval(fetchMetadata, 10000);
    return () => clearInterval(metaInterval);
  }, [fetchMetadata]);

  useEffect(() => {
    fetchCount();
    if (!isPolling) return;
    const countInterval = setInterval(fetchCount, 3000);
    return () => clearInterval(countInterval);
  }, [isPolling, fetchCount]);

  // ── Derived fleet stats ──────────────────────────────────────────────────────
  const allDevices        = Object.values(devicesData);
  const onlineDevices     = allDevices.filter(d => d.status === 'ONLINE');
  const offlineDevices    = allDevices.filter(d => d.status === 'OFFLINE');
  const totalFleet        = allDevices.length;

  const isConnected = status.includes('Connected');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Radio color="var(--primary-teal)" />
            Live IoT Sensor Feed
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Real-time occupancy data from simulation devices
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          {/* API connection status indicator */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            backgroundColor: isConnected ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: isConnected ? 'var(--status-green)' : 'var(--status-red)',
            padding: '6px 12px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 600,
            border: `1px solid ${isConnected ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isConnected ? 'var(--status-green)' : 'var(--status-red)', animation: isConnected ? 'pulse 2s infinite' : 'none' }} />
            {status}
          </div>

          <button onClick={() => setIsPolling(!isPolling)} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: isPolling ? 'var(--primary-teal-transparent)' : 'var(--bg-panel-hover)',
            color: 'var(--primary-teal)', border: '1px solid var(--primary-teal)',
            padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
          }}>
            <RefreshCw size={15} className={isPolling ? 'spin' : ''} />
            {isPolling ? 'Pause Polling' : 'Resume Polling'}
          </button>
        </div>
      </div>

      {/* ── Fleet Status Summary ────────────────────────────────────────────── */}
      {/* These numbers come from the real Device entities updated by MQTT LWT.
          Previously this section didn't exist — the only info was the hardcoded
          "Active Nodes: 20" text. Now it's real and live-refreshed every 10s. */}
      {totalFleet > 0 && (
        <div style={{ display: 'flex', gap: '0.875rem' }}>
          <FleetStat icon={<Server size={20} />}  label="Total Fleet"   value={totalFleet}          color="var(--text-muted)" />
          <FleetStat icon={<Wifi size={20} />}    label="Online"        value={onlineDevices.length} color="var(--status-green)" />
          <FleetStat icon={<WifiOff size={20} />} label="Offline"       value={offlineDevices.length} color="var(--status-red)" />
          <FleetStat icon={<Activity size={20} />} label="Reporting Now" value={activeNodes}          color="var(--primary-teal)" />
        </div>
      )}

      {/* ── Main Count Display ──────────────────────────────────────────────── */}
      <div className="glass-panel" style={{ padding: '3.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)',
          borderRadius: '50%', width: 220, height: 220,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: isConnected ? '0 0 48px var(--primary-teal-transparent)' : 'none',
          transition: 'all 0.4s ease',
        }}>
          <Activity size={28} color="var(--text-muted)" style={{ marginBottom: '0.75rem' }} />
          <div style={{ fontSize: '4.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{count}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>People Inside</div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Last ping: <strong style={{ color: 'var(--text-main)' }}>{lastUpdated || 'Waiting for data…'}</strong>
          </p>
          <p style={{ margin: 0, color: 'var(--primary-teal)', fontSize: '0.82rem', fontWeight: 600 }}>
            Last active device: <strong>{lastDevice}</strong>
          </p>
          {systemStatus !== 'UNKNOWN' && (
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              System: <strong>{systemStatus}</strong>
            </p>
          )}
        </div>
      </div>

      {/* ── Per-Device Node Grid ─────────────────────────────────────────────── */}
      {Object.keys(deviceCounts).length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Individual Node Sensors
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {Object.keys(deviceCounts).length} reporting · refreshes every 10s
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.875rem' }}>
            {Object.entries(deviceCounts)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([device, value]) => {
                const devMeta = devicesData[device];
                const isOnline = devMeta?.status === 'ONLINE';
                const isOffline = devMeta?.status === 'OFFLINE';
                // A device is "stale" if its lastSeen is > 60 seconds ago, regardless of DB status
                const stale   = secondsAgo(devMeta?.lastSeen) > 60;

                // Border colour: green accent if sending entries, red for exits, grey otherwise
                const accentColor = value > 0 ? 'var(--primary-teal)' : value < 0 ? 'var(--status-red)' : 'var(--border-color)';

                return (
                  <div key={device} className="glass-panel" style={{
                    padding: '1.1rem 1.25rem',
                    display: 'flex', flexDirection: 'column', gap: '0.875rem',
                    borderLeft: `3px solid ${isOffline || stale ? 'var(--status-red)' : accentColor}`,
                    opacity: isOffline ? 0.65 : 1,
                    transition: 'opacity 0.3s',
                  }}>
                    {/* Card header: name + delta */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {devMeta?.name || device.toUpperCase()}
                        </span>

                        {/* Online / Offline / Unknown indicator — now reflects real MQTT LWT status */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', fontWeight: 700 }}>
                          <div style={{
                            width: 7, height: 7, borderRadius: '50%',
                            backgroundColor: isOffline ? 'var(--status-red)' : isOnline ? 'var(--status-green)' : 'var(--text-muted)',
                            animation: isOnline && !stale ? 'pulse 2s infinite' : 'none',
                          }} />
                          <span style={{ color: isOffline ? 'var(--status-red)' : isOnline ? 'var(--status-green)' : 'var(--text-muted)' }}>
                            {isOffline ? 'OFFLINE' : isOnline ? (stale ? 'STALE' : 'ONLINE') : 'UNKNOWN'}
                          </span>
                          {stale && isOnline && (
                            <span style={{ color: 'var(--status-yellow)', fontSize: '0.68rem' }}>· no recent ping</span>
                          )}
                        </div>
                      </div>

                      {/* Net delta */}
                      <div style={{
                        fontSize: '1.5rem', fontWeight: 800,
                        color: value > 0 ? 'var(--primary-teal)' : value < 0 ? 'var(--status-red)' : 'var(--text-main)',
                      }}>
                        {value > 0 ? `+${value}` : value}
                      </div>
                    </div>

                    {/* Card footer: location + last seen */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <MapPin size={11} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {devMeta?.location || 'Unassigned'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: isOffline ? 'var(--status-red)' : 'var(--text-muted)' }}>
                        <Clock size={11} />
                        <span>{formatLastSeen(devMeta?.lastSeen)}</span>
                      </div>
                      {devMeta?.firmwareVersion && (
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 1 }}>
                          fw {devMeta.firmwareVersion}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 2s linear infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default SensorsPage;
