import React, { useEffect, useState, useCallback } from "react";
import { fetchTimetable, fetchTimetableMetadata } from "../../services/timetableService";
import type { TimetableEntry, TimetableFilters, TimetableMetadata } from "../../types/timetable";
import {
  Calendar, MapPin, User, FilterX, RefreshCw, Clock,
  ChevronDown, Search, CheckCircle, Info
} from "lucide-react";
import "./Timetable.css";

const DAYS_ORDER: Record<string, number> = {
  "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4,
  "Friday": 5, "Saturday": 6, "Sunday": 7
};

const TimetablePage = () => {
  const [data, setData] = useState<TimetableEntry[]>([]);
  const [metadata, setMetadata] = useState<TimetableMetadata>({
    subjects: [], teachers: [], classrooms: [], classes: [], times: [], endTimes: []
  });
  const [filters, setFilters] = useState<TimetableFilters>({
    day: "", className: "", teacher: "", subject: "", classroom: "", startTime: "", endTime: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const meta = await fetchTimetableMetadata();
        setMetadata(meta);
      } catch (err) { console.error("Metadata load failed", err); }
    };
    loadMeta();
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchTimetable(filters);
      const sorted = result.sort((a, b) =>
        (DAYS_ORDER[a.day] - DAYS_ORDER[b.day]) || a.startTime.localeCompare(b.startTime)
      );
      setData(sorted);
    } catch (err) { setData([]); }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    const handler = setTimeout(loadData, 300);
    return () => clearTimeout(handler);
  }, [loadData]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetFilters = () => {
    setFilters({ day: "", className: "", teacher: "", subject: "", classroom: "", startTime: "", endTime: "" });
  };

  const renderTableBody = () => {
    if (loading) return null;

    if (filters.classroom && filters.day && metadata.times.length > 0) {
      return metadata.times.map((slot) => {
        const entry = data.find(e => e.startTime === slot);
        return entry ? renderRow(entry) : renderFreeRow(slot);
      });
    }

    if (data.length === 0) return null;
    return data.map((entry, idx) => renderRow(entry, idx));
  };

  const renderRow = (entry: TimetableEntry, idx?: number) => (
    <tr key={idx || entry.startTime + entry.classroom + entry.className} className="fade-in">
      <td className="time-cell">
        <span className="day-badge">{entry.day}</span>
        <span className="time-text">{entry.startTime} — {entry.endTime}</span>
      </td>
      <td><strong>{entry.subject}</strong></td>
      <td>
        <div className="class-info-wrapper">
          {/* Handled long class names with truncation and tooltip */}
          <span className="class-display-name" title={entry.className}>
            {entry.className}
          </span>
        </div>
      </td>
      <td className="teacher-cell">{entry.teacherName}</td>
      <td><span className="room-pill">{entry.classroom}</span></td>
    </tr>
  );

  const renderFreeRow = (slot: string) => (
    <tr key={slot} className="free-slot-row">
      <td className="time-cell"><span className="time-text">{slot}</span></td>
      <td colSpan={4}>
        <div className="free-indicator">
          <CheckCircle size={14} /> <span>Room Available</span>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="timetable-container">
      <header className="page-header">
        <div className="header-content">
          <h1>University Timetable</h1>
          <p>{filters.classroom ? `Availability for Room ${filters.classroom}` : "Real-time schedule & resource mapping"}</p>
        </div>
        <div className="header-meta">
          {data.length > 0 && <span className="results-count">{data.length} entries found</span>}
          <button className="btn-refresh" onClick={loadData} disabled={loading}>
            <RefreshCw size={18} className={loading ? "spin" : ""} /> {loading ? "Updating..." : "Refresh"}
          </button>
        </div>
      </header>

      <section className="filter-section">
        <div className="filter-grid">
          {/* Class Search */}
          <div className="input-wrapper search-input">
            <Search className="input-icon" size={18} />
            <input name="className" placeholder="Search Class..." value={filters.className} onChange={handleChange} />
          </div>

          {/* Day Dropdown */}
          <div className="input-wrapper">
            <Calendar className="input-icon" size={18} />
            <select name="day" value={filters.day} onChange={handleChange}>
              <option value="">All Days</option>
              {Object.keys(DAYS_ORDER).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown className="select-arrow" size={14} />
          </div>

          {/* Professor Dropdown */}
          <div className="input-wrapper">
            <User className="input-icon" size={18} />
            <select name="teacher" value={filters.teacher} onChange={handleChange}>
              <option value="">All Professors</option>
              {metadata.teachers.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown className="select-arrow" size={14} />
          </div>

          {/* Classroom Dropdown */}
          <div className="input-wrapper">
            <MapPin className="input-icon" size={18} />
            <select name="classroom" value={filters.classroom} onChange={handleChange}>
              <option value="">All Rooms</option>
              {metadata.classrooms.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <ChevronDown className="select-arrow" size={14} />
          </div>

          {/* Start Time Filter */}
          <div className="input-wrapper time-filter-group">
            <Clock className="input-icon" size={18} />
            <select name="startTime" value={filters.startTime} onChange={handleChange}>
              <option value="">Starts...</option>
              {metadata.times.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* End Time Filter */}
          <div className="input-wrapper time-filter-group">
            <Clock className="input-icon" size={18} />
            <select name="endTime" value={filters.endTime} onChange={handleChange}>
              <option value="">Ends...</option>
              {metadata.endTimes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="filter-footer">
          <button className="btn-clear" onClick={resetFilters}>
            <FilterX size={16} /> Reset All Filters
          </button>
          {filters.classroom && !filters.day && (
            <div className="status-tip">
              <Info size={14} /> Select a day to track full room availability
            </div>
          )}
        </div>
      </section>

      <div className="table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Subject</th>
              <th>Class & Groups</th>
              <th>Professor</th>
              <th>Room</th>
            </tr>
          </thead>
          <tbody>
            {renderTableBody()}
          </tbody>
        </table>
        {!loading && data.length === 0 && !filters.classroom && (
          <div className="empty-state">
            <Search size={40} />
            <p>No matching lessons found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetablePage;