import React, { useState } from 'react';


const BUILDINGS = [
  { id: 'LRC',          name: 'Learning Resource Center',           floors: 2 },
  { id: 'ATB',          name: 'Amir Temur Building',                floors: 3 },
  { id: 'SHB',          name: 'Shakhrisabz Building',               floors: 4 },
  { id: 'IB',           name: 'Istiqbol Building',                  floors: 4 },
  { id: 'Lyceum',       name: 'Lyceum',                             floors: 2 },
  { id: 'Sports Hall',  name: 'Sports Hall',                        floors: 2 },
];

const BUILDING_FLOOR_ROOMS: Record<string, Record<string, { room: string; pct: number; isLab?: boolean }[]>> = {
  'LRC': {
    '1': [{ room: 'Room 113', pct: 55 }],
    '2': [{ room: 'General Area', pct: 46 }],
  },
  'ATB': {
    '1': [{ room: 'Canteen', pct: 72 }],
    '2': [
      { room: 'ATB207',     pct: 48 },
      { room: 'ATB212 CL',  pct: 60, isLab: true },
      { room: 'ATB214 CL',  pct: 35, isLab: true },
      { room: 'Room 214',   pct: 40 },
    ],
    '3': [
      { room: 'Room 311',   pct: 65 },
      { room: 'ATB301',     pct: 50 },
      { room: 'ATB306',     pct: 30 },
    ],
  },
  'SHB': {
    '1': [{ room: 'Student Zone', pct: 65 }],
    '2': [{ room: 'Room 216', pct: 50 }],
    '3': [
      { room: 'General Area', pct: 30 },
      { room: 'SHB303 CL',   pct: 55, isLab: true },
      { room: 'SHB304 CL',   pct: 40, isLab: true },
    ],
    '4': [
      { room: 'Room 406',   pct: 30 },
      { room: 'SHB404',     pct: 45 },
      { room: 'SHB408 CL',  pct: 50, isLab: true },
    ],
  },
  'IB': {
    '1': [{ room: 'Canteen', pct: 60 }],
    '2': [
      { room: 'Room 214',   pct: 47 },
      { room: 'IB202 CL',   pct: 70, isLab: true },
      { room: 'IB208 CL',   pct: 45, isLab: true },
      { room: 'IB215 CL',   pct: 55, isLab: true },
    ],
    '3': [
      { room: 'Room 311',   pct: 37 },
      { room: 'IB301',      pct: 60 },
      { room: 'IB311 CL',   pct: 80, isLab: true },
    ],
    '4': [{ room: 'Room 311', pct: 25 }],
  },
  'Lyceum': {
    '1': [{ room: 'Canteen', pct: 55 }],
    '2': [{ room: 'Lyceum Hall', pct: 40 }],
  },
  'Sports Hall': {
    '1': [{ room: 'Main Hall', pct: 33 }],
    '2': [{ room: 'GYM', pct: 45 }],
  },
};

const colorFor = (pct: number) =>
  pct > 80 ? 'var(--status-red)' : pct > 55 ? 'var(--status-yellow)' : 'var(--primary-teal)';

const FloorLayoutPage: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(BUILDINGS[0].id);
  const [selectedFloor, setSelectedFloor] = useState(1);

  const building = BUILDINGS.find(b => b.id === selectedBuilding) ?? BUILDINGS[0];
  const rooms = BUILDING_FLOOR_ROOMS[building.id]?.[String(selectedFloor)] ?? [];

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: '100%' }}>

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

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)' }}>{building.name} – Floor {selectedFloor}</h1>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Live room occupancy</p>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.75rem', fontWeight: 600, flexWrap: 'wrap' }}>
          {[['Low (≤55%)', 'var(--primary-teal)'], ['Medium (56–80%)', 'var(--status-yellow)'], ['High (>80%)', 'var(--status-red)']].map(([label, color]) => (
            <div key={String(label)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: String(color) }} /> {label}
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: 'var(--status-blue)' }} /> PC Lab
          </div>
        </div>

        {rooms.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>No rooms configured for this floor.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', flex: 1, alignContent: 'start' }}>
            {rooms.map((r, i) => {
              const c = colorFor(r.pct);
              return (
                <div key={i} style={{ backgroundColor: 'var(--bg-panel)', border: `2px solid ${c}`, borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>{r.room}</span>
                      {r.isLab && (
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--status-blue)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          PC Lab
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: c, backgroundColor: `${c}20`, padding: '2px 7px', borderRadius: '8px', flexShrink: 0 }}>{r.pct}%</span>
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
