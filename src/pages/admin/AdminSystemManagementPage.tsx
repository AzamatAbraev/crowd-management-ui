import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Settings, ChevronLeft, Globe, Users, Building2, Cpu, Bell,
  RefreshCw, CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userManagementService } from '../../services/userManagementService';
import { buildingService } from '../../services/buildingService';
import { deviceService } from '../../services/deviceService';
import { noticeService } from '../../services/noticeService';
import type { Device } from '../../types/device';
import type { RoomNotice } from '../../types/notice';
import '../../styles/dashboard.css';

interface Stats {
  users: number;
  buildings: number;
  devices: Device[];
  notices: RoomNotice[];
}

const NOTICE_TYPE_CFG = {
  CLOSURE: { color: 'var(--status-red)', label: 'Closed' },
  UNAVAILABLE: { color: 'var(--status-yellow)', label: 'Unavailable' },
  MAINTENANCE: { color: 'var(--status-amber)', label: 'Maintenance' },
  RESTORED: { color: 'var(--status-green)', label: 'Restored' },
};


const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub?: string;
  loading?: boolean;
}> = ({ icon, label, value, sub, loading }) => (
  <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ backgroundColor: 'var(--bg-panel-hover)', padding: '0.65rem', borderRadius: 10, color: 'var(--primary-teal)', flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>{label}</div>
      {loading
        ? <div style={{ width: 48, height: 22, borderRadius: 4, backgroundColor: 'var(--bg-panel-hover)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        : <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{value}</div>
      }
      {sub && !loading && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; description: string; children: React.ReactNode; action?: React.ReactNode }> = ({ icon, title, description, children, action }) => (
  <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ backgroundColor: 'var(--bg-panel-hover)', padding: '0.6rem', borderRadius: 8, color: 'var(--primary-teal)', flexShrink: 0 }}>{icon}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>{title}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{description}</div>
        </div>
      </div>
      {action}
    </div>
    {children}
  </div>
);

const AdminSystemManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<Stats>({ users: 0, buildings: 0, devices: [], notices: [] });

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [users, buildings, devices, notices] = await Promise.all([
        userManagementService.getAllUsers(),
        buildingService.getAllBuildings(),
        deviceService.getAllDevices(),
        noticeService.getActiveNotices(),
      ]);
      setStats({
        users: users.length,
        buildings: buildings.length,
        devices,
        notices,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onlineDevices = stats.devices.filter(d => d.status === 'ONLINE').length;
  const offlineDevices = stats.devices.filter(d => d.status === 'OFFLINE').length;

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
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Overview · {user?.username}</div>
            </div>
          </div>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0.6rem 1.2rem', borderRadius: 9, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-secondary)', cursor: refreshing ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.9rem', opacity: refreshing ? 0.6 : 1 }}
        >
          <RefreshCw size={15} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : undefined }} />
          Refresh
        </button>
      </nav>

      <main style={{ flex: 1, padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <StatCard icon={<Users size={20} />} label="Total Users" value={stats.users} loading={loading} />
          <StatCard icon={<Building2 size={20} />} label="Buildings" value={stats.buildings} loading={loading} />
          <StatCard
            icon={<Cpu size={20} />}
            label="Devices"
            value={stats.devices.length}
            sub={loading ? undefined : `${onlineDevices} online · ${offlineDevices} offline`}
            loading={loading}
          />
          <StatCard
            icon={<Bell size={20} />}
            label="Active Notices"
            value={stats.notices.length}
            sub={stats.notices.length > 0 ? 'Rooms with open notices' : 'No active notices'}
            loading={loading}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

          <SectionCard icon={<Globe size={20} />} title="General" description="Platform display name and session information.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

              {[
                { label: 'Platform Name', value: 'Palantir' },
                { label: 'Signed in as', value: user ? `${user.firstName} ${user.lastName} (${user.username})` : '—' },
                { label: 'Environment', value: 'Production' },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: '0.75rem 1rem', borderRadius: 8, backgroundColor: 'var(--bg-panel-hover)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600 }}>{value}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Active Notices */}
          <SectionCard
            icon={<Bell size={20} />}
            title="Active Notices"
            description="Currently open room notices visible to all users."
            action={
              <Link
                to="/admin/notices"
                style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-teal)', textDecoration: 'none', flexShrink: 0 }}
              >
                Manage all →
              </Link>
            }
          >
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ height: 44, borderRadius: 7, backgroundColor: 'var(--bg-panel-hover)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                ))}
              </div>
            ) : stats.notices.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '1.5rem', color: 'var(--text-muted)' }}>
                <CheckCircle size={28} style={{ color: 'var(--status-green)' }} />
                <span style={{ fontSize: '0.875rem' }}>No active notices</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 300, overflowY: 'auto' }}>
                {stats.notices.map(notice => {
                  const cfg = NOTICE_TYPE_CFG[notice.type];
                  return (
                    <div
                      key={notice.id}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.6rem 0.85rem', borderRadius: 7, backgroundColor: 'var(--bg-panel-hover)', borderLeft: `3px solid ${cfg.color}` }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{cfg.label}</span>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>{notice.roomName}</span>
                          {notice.buildingId && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>· {notice.buildingId}</span>}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notice.message}</div>
                        {(notice.startTime || notice.endTime) && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            {notice.startTime && notice.endTime
                              ? `${notice.startTime} – ${notice.endTime}`
                              : notice.startTime ? `From ${notice.startTime}` : `Until ${notice.endTime}`}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

        </div>


      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};

export default AdminSystemManagementPage;
