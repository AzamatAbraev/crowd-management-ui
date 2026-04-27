import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../server';
import { ArrowLeft, Users, AlertTriangle, BookOpen, Monitor } from 'lucide-react';
import type { TimetableEntry } from '../../types/timetable';

interface OccupancyData {
  deviceCounts: Record<string, number>;
}

interface DeviceInfo {
  building: string;
  floor: string;
  room: string;
  isLab?: boolean;
}

const DEVICE_REGISTRY: Record<string, DeviceInfo> = {
  'esp8266_01': { building: 'library', floor: 'floor_1', room: '113' },
  'esp8266_02': { building: 'library', floor: 'floor_2', room: '' },
  'esp8266_03': { building: 'ATB', floor: 'floor_1', room: 'Canteen' },
  'esp8266_04': { building: 'ATB', floor: 'floor_2', room: 'Room 214' },
  'esp8266_05': { building: 'ATB', floor: 'floor_3', room: 'Room 311' },
  'esp8266_06': { building: 'IB', floor: 'floor_1', room: 'Canteen' },
  'esp8266_07': { building: 'IB', floor: 'floor_2', room: 'Room 214' },
  'esp8266_08': { building: 'IB', floor: 'floor_3', room: 'Room 311' },
  'esp8266_09': { building: 'IB', floor: 'floor_4', room: 'Room 311' },
  'esp8266_10': { building: 'SHB', floor: 'floor_1', room: 'Student Zone' },
  'esp8266_11': { building: 'SHB', floor: 'floor_2', room: 'Room 216' },
  'esp8266_12': { building: 'SHB', floor: 'floor_3', room: '' },
  'esp8266_13': { building: 'SHB', floor: 'floor_4', room: 'Room 406' },
  'esp8266_14': { building: 'Sports Hall', floor: 'floor_1', room: '' },
  'esp8266_15': { building: 'Sports Hall', floor: 'floor_2', room: 'GYM' },
  'esp8266_16': { building: 'Lyceum', floor: 'floor_2', room: 'Lyceum Hall' },
  'esp8266_17': { building: 'Lyceum', floor: 'floor_1', room: 'Canteen' },
  'esp8266_18': { building: 'ATB', floor: 'floor_2', room: 'ATB212 CL', isLab: true },
  'esp8266_19': { building: 'ATB', floor: 'floor_2', room: 'ATB214 CL', isLab: true },
  'esp8266_20': { building: 'ATB', floor: 'floor_2', room: 'ATB207' },
  'esp8266_21': { building: 'ATB', floor: 'floor_3', room: 'ATB301' },
  'esp8266_22': { building: 'ATB', floor: 'floor_3', room: 'ATB306' },
  'esp8266_23': { building: 'IB', floor: 'floor_2', room: 'IB202 CL', isLab: true },
  'esp8266_24': { building: 'IB', floor: 'floor_2', room: 'IB208 CL', isLab: true },
  'esp8266_25': { building: 'IB', floor: 'floor_2', room: 'IB215 CL', isLab: true },
  'esp8266_26': { building: 'IB', floor: 'floor_3', room: 'IB301' },
  'esp8266_27': { building: 'IB', floor: 'floor_3', room: 'IB311 CL', isLab: true },
  'esp8266_28': { building: 'SHB', floor: 'floor_3', room: 'SHB303 CL', isLab: true },
  'esp8266_29': { building: 'SHB', floor: 'floor_3', room: 'SHB304 CL', isLab: true },
  'esp8266_30': { building: 'SHB', floor: 'floor_4', room: 'SHB408 CL', isLab: true },
  'esp8266_31': { building: 'SHB', floor: 'floor_4', room: 'SHB404' },
  'camera_01': { building: 'library', floor: 'floor_1', room: 'Entrance' },
  'esp8266_real_device': { building: 'library', floor: 'floor_1', room: 'meeting_room' },
};

const BUILDING_IOT_NAME: Record<string, string> = {
  'bldg-lrc': 'library',
  'bldg-atb': 'ATB',
  'bldg-shb': 'SHB',
  'bldg-ib': 'IB',
  'bldg-lyceum': 'Lyceum',
  'bldg-sports': 'Sports Hall',
};

const BUILDING_NAMES: Record<string, string> = {
  'bldg-lrc': 'Learning Resource Center',
  'bldg-atb': 'Amir Temur Building',
  'bldg-shb': 'Shakhrisabz Building',
  'bldg-ib': 'Istiqbol Building',
  'bldg-lyceum': 'Lyceum',
  'bldg-sports': 'Sports Hall',
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MAX_AREA_CAPACITY = 50;

const formatFloor = (floor: string) => floor.replace('floor_', 'Floor ');
const formatRoom = (room: string) => room.trim() === '' ? 'General Area' : room;

const parseTimeMins = (t: string): number => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
};

const normalizeClassroom = (name: string): string =>
  name.trim().split(/[\s(]/)[0].toUpperCase();

const ViewerBuildingPlan: React.FC = () => {
  const { buildingId } = useParams<{ buildingId: string }>();
  const navigate = useNavigate();

  const [deviceCounts, setDeviceCounts] = useState<Record<string, number>>({});
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCounts = async (): Promise<void> => {
    try {
      const res = await api.get<OccupancyData>('/people/count');
      setDeviceCounts(res.data.deviceCounts || {});
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayTimetable = async (): Promise<void> => {
    const today = DAY_NAMES[new Date().getDay()];
    if (today === 'Sunday') return;
    try {
      const res = await api.get('/resources/timetable', { params: { day: today } });
      const data = res.data?.data;
      if (Array.isArray(data)) setTimetable(data);
    } catch {
    }
  };

  useEffect(() => {
    fetchCounts();
    fetchTodayTimetable();
    const interval = setInterval(fetchCounts, 3000);
    return () => clearInterval(interval);
  }, []);

  const bookedRooms = useMemo<Map<string, TimetableEntry>>(() => {
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const map = new Map<string, TimetableEntry>();
    timetable.forEach(entry => {
      if (!entry.startTime || !entry.endTime || !entry.classroom) return;
      const start = parseTimeMins(entry.startTime);
      const end = parseTimeMins(entry.endTime);
      if (nowMins >= start && nowMins < end) {
        map.set(normalizeClassroom(entry.classroom), entry);
      }
    });
    return map;
  }, [timetable]);

  const buildingAreas = useMemo(() => {
    const iotBuilding = buildingId ? BUILDING_IOT_NAME[buildingId] : null;
    if (!iotBuilding) return [];

    return Object.entries(DEVICE_REGISTRY)
      .filter(([, info]) => info.building === iotBuilding)
      .map(([deviceId, info]) => {
        const roomCode = normalizeClassroom(info.room || '');
        const booking = roomCode ? bookedRooms.get(roomCode) : undefined;
        return {
          deviceId,
          floor: info.floor,
          room: info.room,
          isLab: info.isLab ?? false,
          count: Math.max(0, deviceCounts[deviceId] || 0),
          booking,
        };
      })
      .sort((a, b) => a.floor.localeCompare(b.floor) || a.room.localeCompare(b.room));
  }, [deviceCounts, bookedRooms, buildingId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '1100px', margin: '0 auto', gap: '2rem' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
        <button
          onClick={() => navigate('/live')}
          style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', transition: 'all 0.2s' }}
          title="Back to Campus Map"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 300, color: 'var(--text-main)', letterSpacing: '1px' }}>
            {buildingId ? BUILDING_NAMES[buildingId] || 'Building Details' : 'Unknown Building'}
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '1rem' }}>Rooms and current occupancy</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-main)', margin: 0 }}>
          Monitored Rooms
        </h2>

        {loading ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading room data...</div>
        ) : buildingAreas.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem', backgroundColor: 'var(--bg-panel)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <AlertTriangle size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <div style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 500 }}>No rooms configured for this building</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Please select another building on the campus map.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {buildingAreas.map(({ deviceId, floor, room, isLab, count, booking }) => {
              const isBooked = !!booking;

              if (isBooked) {
                return (
                  <div
                    key={deviceId}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      backgroundColor: 'var(--bg-panel)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      opacity: 0.85,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {formatRoom(room)}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {formatFloor(floor)}
                          {isLab && <span style={{ marginLeft: '0.4rem', color: 'var(--status-blue)', fontWeight: 700 }}>· PC Lab</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--status-amber-tint, #fef3c720)', color: 'var(--status-amber)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', flexShrink: 0 }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--status-amber)' }} />
                        Unavailable
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', backgroundColor: 'var(--bg-base)', borderRadius: '8px', padding: '0.75rem' }}>
                      <BookOpen size={16} color="var(--status-amber)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
                          Class in Session
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                          {booking.startTime}–{booking.endTime}
                        </div>
                        {booking.teacherName && booking.teacherName !== 'N/A' && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                            {booking.teacherName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              let percentage = Math.round((count / MAX_AREA_CAPACITY) * 100);
              if (percentage > 100) percentage = 100;
              const isCrowded = percentage > 85;
              const isActive = percentage > 50;
              const indicatorColor = isCrowded ? 'var(--status-red)' : isActive ? 'var(--status-yellow)' : 'var(--primary-teal)';
              const statusText = isCrowded ? 'Crowded' : isActive ? 'Active' : 'Quiet';

              return (
                <div
                  key={deviceId}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    backgroundColor: 'var(--bg-panel)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = indicatorColor;
                    e.currentTarget.style.boxShadow = `0 8px 24px ${indicatorColor}20`;
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {isLab && <Monitor size={15} color="var(--status-blue)" />}
                        {formatRoom(room)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {formatFloor(floor)}
                        {isLab && <span style={{ marginLeft: '0.4rem', color: 'var(--status-blue)', fontWeight: 700 }}>· PC Lab</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: `${indicatorColor}15`, color: indicatorColor, padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', flexShrink: 0 }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: indicatorColor }} />
                      {statusText}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                    <Users size={20} color="var(--text-muted)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {count} {count === 1 ? 'person' : 'people'}
                        </span>
                        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{percentage}%</span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: 'var(--bg-panel-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${percentage}%`, backgroundColor: indicatorColor, borderRadius: '3px' }} />
                      </div>
                    </div>
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

export default ViewerBuildingPlan;
