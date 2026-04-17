import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellRing,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Wrench,
  RefreshCw,
  X,
  ChevronLeft,
} from 'lucide-react';
import { noticeService } from '../../services/noticeService';
import { buildingService } from '../../services/buildingService';
import type { RoomNotice, NoticeType, CreateNoticeRequest } from '../../types/notice';
import type { Building } from '../../types/building';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const TYPE_CONFIG: Record<NoticeType, { color: string; bg: string; Icon: React.ElementType; label: string }> = {
  CLOSURE:     { color: 'var(--status-red)',    bg: 'var(--status-red-tint)',    Icon: AlertCircle,   label: 'Closed' },
  UNAVAILABLE: { color: 'var(--status-yellow)', bg: 'var(--status-yellow-tint)', Icon: AlertTriangle, label: 'Unavailable' },
  MAINTENANCE: { color: 'var(--status-amber)',  bg: 'var(--status-amber-tint)',  Icon: Wrench,        label: 'Maintenance' },
  RESTORED:    { color: 'var(--status-green)',  bg: 'var(--status-green-tint)',  Icon: CheckCircle,   label: 'Restored' },
};

const EMPTY_FORM: CreateNoticeRequest = {
  roomName: '',
  buildingId: '',
  type: 'UNAVAILABLE',
  message: '',
  startTime: null,
  endTime: null,
};

const NoticesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [notices, setNotices] = useState<RoomNotice[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOnly, setActiveOnly] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CreateNoticeRequest>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = async () => {
    setLoading(true);
    const data = await noticeService.getAllNotices();
    setNotices(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotices();
    buildingService.getAllBuildings().then(setBuildings);
  }, []);

  const displayed = activeOnly ? notices.filter(n => n.active) : notices;
  const activeCount = notices.filter(n => n.active).length;

  const handleCreate = async () => {
    if (!form.roomName.trim() || !form.message.trim()) {
      setError('Room name and message are required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await noticeService.createNotice(form);
      setShowModal(false);
      setForm(EMPTY_FORM);
      await fetchNotices();
    } catch {
      setError('Failed to create notice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (id: string) => {
    await noticeService.resolveNotice(id);
    await fetchNotices();
  };

  const handleDelete = async (id: string) => {
    await noticeService.deleteNotice(id);
    await fetchNotices();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>

      <nav style={{ padding: '1.25rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <ChevronLeft size={18} /> Back
          </button>
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--border-color)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ backgroundColor: 'var(--status-yellow)', padding: '0.4rem', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BellRing size={22} color="#000" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Room Notices</h1>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Notices · {user?.username}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={fetchNotices}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1rem', borderRadius: 8, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
          {isAdmin && (
            <button
              onClick={() => { setShowModal(true); setError(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1.1rem', borderRadius: 8, border: 'none', backgroundColor: 'var(--primary-teal)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}
            >
              <Plus size={14} /> New Notice
            </button>
          )}
        </div>
      </nav>

      <main style={{ flex: 1, padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {([
            { label: 'Total', value: notices.length, color: 'var(--text-main)' },
            { label: 'Active', value: activeCount, color: 'var(--status-red)' },
            { label: 'Resolved', value: notices.length - activeCount, color: 'var(--status-green)' },
          ] as const).map(stat => (
            <div key={stat.label} className="glass-panel" style={{ padding: '1rem 1.5rem', minWidth: 100 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter toggle */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['All', 'Active only'] as const).map((label, i) => {
            const isSelected = i === 0 ? !activeOnly : activeOnly;
            return (
              <button
                key={label}
                onClick={() => setActiveOnly(i === 1)}
                style={{
                  padding: '5px 12px', borderRadius: 7,
                  border: `1px solid ${isSelected ? 'var(--primary-teal)' : 'var(--border-color)'}`,
                  backgroundColor: isSelected ? 'var(--primary-teal-transparent)' : 'transparent',
                  color: isSelected ? 'var(--primary-teal)' : 'var(--text-muted)',
                  fontSize: '0.8125rem', fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Loading notices...
            </div>
          ) : displayed.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <BellRing size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                {activeOnly ? 'No active notices.' : 'No notices posted yet.'}
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel-hover)' }}>
                  {['Type', 'Room', 'Building', 'Message', 'Posted by', 'Status', ...(isAdmin ? ['Actions'] : [])].map(h => (
                    <th key={h} style={{
                      padding: '0.85rem 1.25rem',
                      textAlign: 'left', fontSize: '0.72rem', fontWeight: 700,
                      color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map((notice, idx) => {
                  const cfg = TYPE_CONFIG[notice.type];
                  const { Icon } = cfg;
                  return (
                    <tr key={notice.id} style={{
                      borderBottom: idx < displayed.length - 1 ? '1px solid var(--border-color)' : 'none',
                      backgroundColor: notice.active ? 'transparent' : 'var(--bg-panel-hover)',
                    }}>
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '3px 8px', borderRadius: 20,
                          backgroundColor: cfg.bg, color: cfg.color,
                          fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}>
                          <Icon size={11} />
                          {cfg.label}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {notice.roomName}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {notice.buildingId || '—'}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-main)', maxWidth: 300 }}>
                        {notice.message}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        {notice.createdBy}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <span style={{
                          padding: '3px 8px', borderRadius: 20,
                          backgroundColor: notice.active ? 'var(--status-red-tint)' : 'var(--status-green-tint)',
                          color: notice.active ? 'var(--status-red)' : 'var(--status-green)',
                          fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}>
                          {notice.active ? 'Active' : 'Resolved'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {notice.active && (
                              <button
                                onClick={() => handleResolve(notice.id)}
                                title="Mark as resolved"
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '4px',
                                  padding: '4px 8px', borderRadius: 6,
                                  border: '1px solid var(--status-green)',
                                  backgroundColor: 'var(--status-green-tint)',
                                  color: 'var(--status-green)', fontSize: '0.75rem',
                                  fontWeight: 600, cursor: 'pointer',
                                }}
                              >
                                <CheckCircle size={11} /> Resolve
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notice.id)}
                              title="Delete notice"
                              style={{
                                display: 'flex', alignItems: 'center',
                                padding: '4px 6px', borderRadius: 6,
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'transparent',
                                color: 'var(--status-red)', cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </main>

      {/* Create Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div className="glass-panel" style={{
            width: 480, maxWidth: '90vw', padding: '2rem',
            backgroundColor: 'var(--bg-panel)', borderRadius: 16,
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Post New Notice
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div style={{
                padding: '0.65rem 0.9rem',
                backgroundColor: 'var(--status-red-tint)', border: '1px solid var(--status-red)',
                borderRadius: 7, color: 'var(--status-red)', fontSize: '0.8125rem',
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Room Name *</label>
                  <input
                    value={form.roomName}
                    onChange={e => setForm(f => ({ ...f, roomName: e.target.value }))}
                    placeholder="e.g. IB208 CL"
                    style={{ padding: '0.55rem 0.75rem', borderRadius: 7, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Building</label>
                  <select
                    value={form.buildingId}
                    onChange={e => setForm(f => ({ ...f, buildingId: e.target.value }))}
                    style={{ padding: '0.55rem 0.75rem', borderRadius: 7, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none' }}
                  >
                    <option value="">— Select building —</option>
                    {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value as NoticeType }))}
                  style={{ padding: '0.55rem 0.75rem', borderRadius: 7, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none' }}
                >
                  <option value="CLOSURE">Closure — room is fully closed</option>
                  <option value="UNAVAILABLE">Unavailable — temporarily inaccessible</option>
                  <option value="MAINTENANCE">Maintenance — work in progress</option>
                  <option value="RESTORED">Restored — back to normal</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Message *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Describe the situation for students..."
                  rows={3}
                  style={{ padding: '0.55rem 0.75rem', borderRadius: 7, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', fontSize: '0.875rem', resize: 'vertical', outline: 'none', boxSizing: 'border-box', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Start time (optional)</label>
                  <input
                    type="datetime-local"
                    value={form.startTime?.slice(0, 16) ?? ''}
                    onChange={e => setForm(f => ({ ...f, startTime: e.target.value ? e.target.value + ':00' : null }))}
                    style={{ padding: '0.55rem 0.75rem', borderRadius: 7, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', width: '100%' }}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>End time (optional)</label>
                  <input
                    type="datetime-local"
                    value={form.endTime?.slice(0, 16) ?? ''}
                    onChange={e => setForm(f => ({ ...f, endTime: e.target.value ? e.target.value + ':00' : null }))}
                    style={{ padding: '0.55rem 0.75rem', borderRadius: 7, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', width: '100%' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: '0.6rem 1.2rem', borderRadius: 8, border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={submitting}
                style={{ padding: '0.6rem 1.2rem', borderRadius: 8, border: 'none', backgroundColor: 'var(--primary-teal)', color: '#fff', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 700, opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? 'Posting...' : 'Post Notice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticesPage;
