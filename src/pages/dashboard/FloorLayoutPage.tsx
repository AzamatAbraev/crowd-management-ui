import React, { useState } from 'react';

// --- DUMMY DATA ---
// TODO: Replace with API call to /buildings or /layout when available.
const BUILDINGS = [
  { id: 'lib',  name: 'Main Library',      floors: 4 },
  { id: 'eng',  name: 'Engineering Hall',  floors: 5 },
  { id: 'sci',  name: 'Science Complex',   floors: 3 },
  { id: 'union',name: 'Student Union',     floors: 2 },
];

// TODO: Replace with real /people/count or /layout/floor?building=X&floor=Y
const FLOOR_ROOMS: Record<string, { room: string; pct: number }[]> = {
  '1': [{ room: 'Lab 101', pct: 90 }, { room: 'Seminar A', pct: 45 }, { room: 'Office Suite', pct: 20 }],
  '2': [{ room: 'Lab 201', pct: 60 }, { room: 'Study Lounge', pct: 75 }, { room: 'Meeting Rm', pct: 10 }],
  '3': [{ room: 'Lab 301', pct: 30 }, { room: 'Lecture Hall', pct: 85 }],
  '4': [{ room: 'Archive', pct: 5 }, { room: 'Office 401', pct: 40 }],
  '5': [{ room: 'Rooftop Lab', pct: 15 }],
};

const colorFor = (pct: number) =>
  pct > 80 ? 'var(--status-red)' : pct > 55 ? 'var(--status-yellow)' : 'var(--primary-teal)';

const FloorLayoutPage: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(BUILDINGS[0].id);
  const [selectedFloor, setSelectedFloor] = useState(1);

  const building = BUILDINGS.find(b => b.id === selectedBuilding) ?? BUILDINGS[0];
  const rooms = FLOOR_ROOMS[String(selectedFloor)] ?? [];

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: '100%' }}>

      {/* Left sidebar – building & floor selection */}
      <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '1.5rem', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Building</div>
          {BUILDINGS.map(b => (
            <button key={b.id} onClick={() => { setSelectedBuilding(b.id); setSelectedFloor(1); }} style={{ width: '100%', textAlign: 'left', padding: '0.6rem 0.75rem', marginBottom: '0.25rem', borderRadius: '8px', border: 'none', backgroundColor: selectedBuilding === b.id ? 'var(--primary-teal)' : 'transparent', color: selectedBuilding === b.id ? '#fff' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
              {b.name}
            </button>
          ))}
        </div>

        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Floor</div>
          {Array.from({ length: building.floors }, (_, i) => i + 1).reverse().map(f => (
            <button key={f} onClick={() => setSelectedFloor(f)} style={{ width: '100%', textAlign: 'left', padding: '0.6rem 0.75rem', marginBottom: '0.25rem', borderRadius: '8px', border: 'none', backgroundColor: selectedFloor === f ? 'var(--primary-teal-transparent)' : 'transparent', color: selectedFloor === f ? 'var(--primary-teal)' : 'var(--text-muted)', fontWeight: selectedFloor === f ? 700 : 500, fontSize: '0.875rem', cursor: 'pointer' }}>
              Floor {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)' }}>{building.name} – Floor {selectedFloor}</h1>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Live room occupancy</p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.75rem', fontWeight: 600 }}>
          {[['Low (≤55%)', 'var(--primary-teal)'], ['Medium (56–80%)', 'var(--status-yellow)'], ['High (>80%)', 'var(--status-red)']].map(([label, color]) => (
            <div key={String(label)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: String(color) }} /> {label}
            </div>
          ))}
        </div>

        {/* Rooms grid */}
        {rooms.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>No rooms configured for this floor.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', flex: 1, alignContent: 'start' }}>
            {rooms.map((r, i) => {
              const c = colorFor(r.pct);
              return (
                <div key={i} style={{ backgroundColor: 'var(--bg-panel)', border: `2px solid ${c}`, borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>{r.room}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: c, backgroundColor: `${c}20`, padding: '2px 7px', borderRadius: '8px' }}>{r.pct}%</span>
                  </div>
                  <div style={{ height: '5px', backgroundColor: 'var(--bg-panel-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${r.pct}%`, backgroundColor: c, borderRadius: '3px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FloorLayoutPage;
