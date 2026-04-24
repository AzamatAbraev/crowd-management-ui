import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Thermometer } from 'lucide-react';

const BUILDINGS = [
  { id: 'bldg-lrc',    name: 'Learning Resource Center', color: 'var(--primary-teal)' },
  { id: 'bldg-atb',    name: 'Amir Temur Building',      color: 'var(--status-yellow)' },
  { id: 'bldg-shb',    name: 'Shakhrisabz Building',     color: 'var(--primary-teal)' },
  { id: 'bldg-ib',     name: 'Istiqbol Building',        color: 'var(--status-red)' },
  { id: 'bldg-lyceum', name: 'Lyceum',                   color: 'var(--primary-teal)' },
  { id: 'bldg-sports', name: 'Sports Hall',              color: 'var(--primary-teal)' },
];

const ViewerCampusMap: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 300, color: 'var(--text-main)', letterSpacing: '1px' }}>Campus Map</h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '1rem' }}>Select a building to view occupancy</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', backgroundColor: 'var(--bg-panel)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)' }}>{timeString}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{dateString}</span>
          </div>
          <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--border-color)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <Thermometer size={20} color="var(--primary-teal)" />
            <span style={{ fontSize: '1.25rem', fontWeight: 500 }}>24°C</span>
          </div>
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        backgroundColor: 'var(--bg-base)', 
        borderRadius: 'var(--radius-2xl)', 
        border: '1px solid var(--border-color)',
        position: 'relative',
        minHeight: '580px',
        overflow: 'hidden',
        backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
        backgroundSize: '28px 28px'
      }}>
        
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>

            <button
               onClick={() => navigate(`/live/building/${BUILDINGS[1].id}`)}
               style={{ position: 'absolute', top: '8%', left: '2%', width: '10%', height: '57%', backgroundColor: 'var(--bg-panel)', border: `2px solid ${BUILDINGS[1].color}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem', transition: 'var(--transition-base)', boxShadow: 'var(--shadow-sm)', fontFamily: 'inherit', textAlign: 'center', padding: '0.5rem' }}
               className="hover-lift"
            >
              {BUILDINGS[1].name}
            </button>

            <button
               onClick={() => navigate(`/live/building/${BUILDINGS[5].id}`)}
               style={{ position: 'absolute', top: '3%', left: '24%', width: '19%', height: '20%', backgroundColor: 'var(--bg-panel)', border: `2px solid ${BUILDINGS[5].color}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem', transition: 'var(--transition-base)', boxShadow: 'var(--shadow-sm)', fontFamily: 'inherit', textAlign: 'center', padding: '0.5rem' }}
               className="hover-lift"
            >
              {BUILDINGS[5].name}
            </button>

            <button
               onClick={() => navigate(`/live/building/${BUILDINGS[0].id}`)}
               style={{ position: 'absolute', top: '2%', left: '45%', width: '28%', height: '22%', backgroundColor: 'var(--bg-panel)', border: `2px solid ${BUILDINGS[0].color}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem', transition: 'var(--transition-base)', boxShadow: 'var(--shadow-sm)', fontFamily: 'inherit', textAlign: 'center', padding: '0.5rem' }}
               className="hover-lift"
            >
              {BUILDINGS[0].name}
            </button>

            <button
               onClick={() => navigate(`/live/building/${BUILDINGS[3].id}`)}
               style={{ position: 'absolute', top: '2%', left: '74%', width: '10%', height: '67%', backgroundColor: 'var(--bg-panel)', border: `2px solid ${BUILDINGS[3].color}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem', transition: 'var(--transition-base)', boxShadow: 'var(--shadow-sm)', fontFamily: 'inherit', textAlign: 'center', padding: '0.5rem' }}
               className="hover-lift"
            >
              {BUILDINGS[3].name}
            </button>

            <button
               onClick={() => navigate(`/live/building/${BUILDINGS[4].id}`)}
               style={{ position: 'absolute', top: '40%', left: '44%', width: '22%', height: '24%', backgroundColor: 'var(--bg-panel)', border: `2px solid ${BUILDINGS[4].color}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem', transition: 'var(--transition-base)', boxShadow: 'var(--shadow-sm)', fontFamily: 'inherit', textAlign: 'center', padding: '0.5rem' }}
               className="hover-lift"
            >
              {BUILDINGS[4].name}
            </button>

            <button
               onClick={() => navigate(`/live/building/${BUILDINGS[2].id}`)}
               style={{ position: 'absolute', top: '74%', left: '22%', width: '28%', height: '20%', backgroundColor: 'var(--bg-panel)', border: `2px solid ${BUILDINGS[2].color}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem', transition: 'var(--transition-base)', boxShadow: 'var(--shadow-sm)', fontFamily: 'inherit', textAlign: 'center', padding: '0.5rem' }}
               className="hover-lift"
            >
              {BUILDINGS[2].name}
            </button>
        </div>
      </div>

      <style>{`
        .hover-lift:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 8px 30px rgba(28, 181, 136, 0.15) !important;
          background-color: var(--bg-panel-hover) !important;
        }
      `}</style>

    </div>
  );
};

export default ViewerCampusMap;
