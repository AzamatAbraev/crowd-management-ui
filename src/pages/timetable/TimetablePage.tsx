import React, { useEffect, useState, useCallback } from "react";
import { fetchTimetable } from "../../services/timetableService";
import type { TimetableEntry, TimetableFilters } from "../../types/timetable";

const daysOfWeek: string[] = [
  "",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const TimetablePage = () => {
  const [data, setData] = useState<TimetableEntry[]>([]);
  const [filters, setFilters] = useState<TimetableFilters>({
    day: "",
    className: "",
    teacher: "",
    subject: "",
    classroom: "",
    group: ""
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const loadData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const result = await fetchTimetable(filters);

      const sorted = [...result].sort((a, b) => {
        if (a.day === b.day) {
          return a.startTime.localeCompare(b.startTime);
        }
        return a.day.localeCompare(b.day);
      });

      setData(sorted);

    } catch (err: any) {
      setError(err.message || "Failed to load timetable");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const clearFilters = (): void => {
    setFilters({
      day: "",
      className: "",
      teacher: "",
      subject: "",
      classroom: "",
      group: ""
    });
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Timetable</h2>

      <div style={filterContainer}>
        <select name="day" value={filters.day} onChange={handleChange}>
          {daysOfWeek.map(day => (
            <option key={day} value={day}>
              {day === "" ? "All Days" : day}
            </option>
          ))}
        </select>

        <input name="className" placeholder="Class"
          value={filters.className}
          onChange={handleChange} />

        <input name="group" placeholder="Group"
          value={filters.group}
          onChange={handleChange} />

        <input name="teacher" placeholder="Professor"
          value={filters.teacher}
          onChange={handleChange} />

        <input name="subject" placeholder="Subject"
          value={filters.subject}
          onChange={handleChange} />

        <input name="classroom" placeholder="Room"
          value={filters.classroom}
          onChange={handleChange} />

        <button onClick={loadData}>Apply</button>
        <button onClick={clearFilters}>Clear</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && data.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Day</th>
              <th>Start</th>
              <th>End</th>
              <th>Subject</th>
              <th>Class</th>
              <th>Group</th>
              <th>Professor</th>
              <th>Room</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index}>
                <td>{entry.day}</td>
                <td>{entry.startTime}</td>
                <td>{entry.endTime}</td>
                <td>{entry.subject}</td>
                <td>{entry.className}</td>
                <td>{entry.groupName}</td>
                <td>{entry.teacherName}</td>
                <td>{entry.classroom}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && data.length === 0 && <p>No results</p>}
    </div>
  );
};

const filterContainer: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "20px"
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse"
};

export default TimetablePage;