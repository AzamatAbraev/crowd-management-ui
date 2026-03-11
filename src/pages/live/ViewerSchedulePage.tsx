import React, { useEffect, useState, useCallback } from 'react';
import { fetchTimetable, fetchTimetableMetadata } from '../../services/timetableService';
import type { TimetableEntry, TimetableFilters, TimetableMetadata } from '../../types/timetable';
import { Calendar, Search, RefreshCw, FilterX, Clock, MapPin, User } from 'lucide-react';

const DAYS_ORDER: Record<string, number> = {
  'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4,
  'Friday': 5, 'Saturday': 6, 'Sunday': 7
};

const ALL_DAYS = Object.keys(DAYS_ORDER);

const MOCK_ENTRIES: TimetableEntry[] = [
  { subject: 'Computer Architecture', className: 'CS-301', teacherName: 'Dr. Arbak', groupName: 'G1', classroom: 'Room 101', day: 'Monday', startTime: '09:00', endTime: '10:30' },
  { subject: 'Database Systems', className: 'CS-302', teacherName: 'Prof. Bakyt', groupName: 'G2', classroom: 'Lab 04', day: 'Monday', startTime: '11:00', endTime: '12:30' },
  { subject: 'Software Engineering', className: 'CS-401', teacherName: 'Dr. Serik', groupName: 'G1', classroom: 'Room 205', day: 'Tuesday', startTime: '09:00', endTime: '10:30' },
  { subject: 'Machine Learning', className: 'CS-501', teacherName: 'Dr. Irina', groupName: 'G1', classroom: 'Lab 06', day: 'Tuesday', startTime: '14:00', endTime: '15:30' },
  { subject: 'Human-Computer Interaction', className: 'CS-405', teacherName: 'Prof. Dana', groupName: 'G3', classroom: 'Room 310', day: 'Wednesday', startTime: '11:00', endTime: '12:30' },
  { subject: 'Network Security', className: 'IT-402', teacherName: 'Dr. Marat', groupName: 'G2', classroom: 'Lab 02', day: 'Wednesday', startTime: '16:00', endTime: '17:30' },
  { subject: 'Operating Systems', className: 'CS-303', teacherName: 'Prof. Askhat', groupName: 'G1', classroom: 'Room 101', day: 'Thursday', startTime: '09:00', endTime: '10:30' },
  { subject: 'Algorithms & Complexity', className: 'CS-304', teacherName: 'Dr. Aigerim', groupName: 'G3', classroom: 'Room 205', day: 'Friday', startTime: '10:00', endTime: '11:30' },
];

const ViewerSchedulePage: React.FC = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [metadata, setMetadata] = useState<TimetableMetadata>({ subjects: [], teachers: [], classrooms: [], classes: [], times: [], endTimes: [] });
  const [filters, setFilters] = useState<TimetableFilters>({ day: '', className: '', teacher: '', subject: '', classroom: '' });
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [meta, data] = await Promise.all([
        fetchTimetableMetadata(),
        fetchTimetable(filters)
      ]);
      setMetadata(meta);
      const validData = (data || []).filter(e => e && e.subject);
      if (validData.length > 0) {
        const sorted = validData.sort((a, b) =>
          (DAYS_ORDER[a.day] - DAYS_ORDER[b.day]) || a.startTime.localeCompare(b.startTime)
        );
        setEntries(sorted);
      } else {
        // Use mock data filtered by current filters
        let mock = MOCK_ENTRIES;
        if (filters.day) mock = mock.filter(e => e.day === filters.day);
        if (filters.classroom) mock = mock.filter(e => e.classroom?.toLowerCase().includes(filters.classroom!.toLowerCase()));
        if (filters.teacher) mock = mock.filter(e => e.teacherName?.toLowerCase().includes(filters.teacher!.toLowerCase()));
        setEntries(mock);
      }
    } catch {
      let mock = MOCK_ENTRIES;
      if (filters.day) mock = mock.filter(e => e.day === filters.day);
      setEntries(mock);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(loadData, 300);
    return () => clearTimeout(t);
  }, [loadData]);

  const reset = () => {
    setFilters({ day: '', className: '', teacher: '', subject: '', classroom: '' });
    setSearchText('');
  };

  const displayed = entries.filter(e => {
    if (!searchText) return true;
    const q = searchText.toLowerCase();
    return e.subject?.toLowerCase().includes(q) || e.className?.toLowerCase().includes(q) || e.teacherName?.toLowerCase().includes(q) || e.classroom?.toLowerCase().includes(q);
  });

  // Group by day
  const grouped: Record<string, TimetableEntry[]> = {};
  displayed.forEach(e => {
    if (!grouped[e.day]) grouped[e.day] = [];
    grouped[e.day].push(e);
  });
  const orderedDays = Object.keys(grouped).sort((a, b) => (DAYS_ORDER[a] || 99) - (DAYS_ORDER[b] || 99));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-main)' }}>University Schedule</h1>
        <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Browse classes across all buildings</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '160px' }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="Search subject, class, teacher..."
            style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-main)', fontSize: '0.85rem', boxSizing: 'border-box' }}
          />
        </div>

        {/* Day filter */}
        <div style={{ position: 'relative' }}>
          <Calendar size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <select
            value={filters.day}
            onChange={e => setFilters(p => ({ ...p, day: e.target.value }))}
            style={{ paddingLeft: '30px', padding: '8px 12px 8px 30px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <option value="">All Days</option>
            {ALL_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Teacher filter */}
        {metadata.teachers.length > 0 && (
          <div style={{ position: 'relative' }}>
            <User size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <select
              value={filters.teacher}
              onChange={e => setFilters(p => ({ ...p, teacher: e.target.value }))}
              style={{ paddingLeft: '30px', padding: '8px 12px 8px 30px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <option value="">All Professors</option>
              {metadata.teachers.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}

        {/* Room filter */}
        {metadata.classrooms.length > 0 && (
          <div style={{ position: 'relative' }}>
            <MapPin size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <select
              value={filters.classroom}
              onChange={e => setFilters(p => ({ ...p, classroom: e.target.value }))}
              style={{ paddingLeft: '30px', padding: '8px 12px 8px 30px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <option value="">All Rooms</option>
              {metadata.classrooms.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        )}

        <button onClick={loadData} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)', color: 'var(--primary-teal)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
        </button>

        {(searchText || filters.day || filters.teacher || filters.classroom) && (
          <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--status-red)', backgroundColor: 'transparent', color: 'var(--status-red)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
            <FilterX size={14} /> Clear
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>Loading schedule...</div>
      ) : displayed.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          No classes match your filters.
        </div>
      ) : (
        orderedDays.map(day => (
          <div key={day}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-teal)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={12} /> {day}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {grouped[day].map((entry, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden', gap: 0 }}>
                  <div style={{ width: '4px', backgroundColor: 'var(--primary-teal)', alignSelf: 'stretch' }} />
                  <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem' }}>{entry.subject}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{entry.className} · {entry.teacherName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} /> {entry.startTime}–{entry.endTime}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={12} /> {entry.classroom}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ViewerSchedulePage;
