import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, AlertCircle, Wrench, CheckCircle } from 'lucide-react';
import { noticeService } from '../../services/noticeService';
import type { RoomNotice, NoticeType } from '../../types/notice';

const TYPE_CONFIG: Record<NoticeType, {
  color: string;
  bg: string;
  border: string;
  Icon: React.ElementType;
  label: string;
}> = {
  CLOSURE:     { color: 'var(--status-red)',    bg: 'var(--status-red-tint)',    border: 'var(--status-red)',    Icon: AlertCircle,   label: 'Closed' },
  UNAVAILABLE: { color: 'var(--status-yellow)', bg: 'var(--status-yellow-tint)', border: 'var(--status-yellow)', Icon: AlertTriangle, label: 'Unavailable' },
  MAINTENANCE: { color: 'var(--status-amber)',  bg: 'var(--status-amber-tint)',  border: 'var(--status-amber)',  Icon: Wrench,        label: 'Maintenance' },
  RESTORED:    { color: 'var(--status-green)',  bg: 'var(--status-green-tint)',  border: 'var(--status-green)',  Icon: CheckCircle,   label: 'Restored' },
};

const NoticeBanner: React.FC = () => {
  const [notices, setNotices] = useState<RoomNotice[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    noticeService.getActiveNotices().then(setNotices);
    const interval = setInterval(
      () => noticeService.getActiveNotices().then(setNotices),
      60_000
    );
    return () => clearInterval(interval);
  }, []);

  const visible = notices.filter(n => !dismissed.has(n.id));
  if (visible.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {visible.map(notice => {
        const cfg = TYPE_CONFIG[notice.type];
        const { Icon } = cfg;
        return (
          <div
            key={notice.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: '7px var(--space-8)',
              backgroundColor: cfg.bg,
              borderBottom: `1px solid ${cfg.border}33`,
            }}
          >
            <Icon size={13} style={{ color: cfg.color, flexShrink: 0 }} />
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: cfg.color,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.06em',
              flexShrink: 0,
            }}>
              {cfg.label}
            </span>
            <span style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              flexShrink: 0,
            }}>
              {notice.roomName}{notice.buildingId ? ` · ${notice.buildingId}` : ''}
            </span>
            {(notice.startTime || notice.endTime) && (
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                flexShrink: 0,
                whiteSpace: 'nowrap' as const,
              }}>
                {notice.startTime && notice.endTime
                  ? `${notice.startTime} – ${notice.endTime}`
                  : notice.startTime
                  ? `From ${notice.startTime}`
                  : `Until ${notice.endTime}`}
              </span>
            )}
            <span style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap' as const,
            }}>
              {notice.message}
            </span>
            <button
              onClick={() => setDismissed(prev => new Set([...prev, notice.id]))}
              title="Dismiss"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NoticeBanner;
