import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Thermometer } from 'lucide-react';

const BUILDINGS = [
  { id: 'bldg-lib', name: 'Main Library', color: 'var(--primary-teal)' },
  { id: 'bldg-eng', name: 'Engineering Block', color: 'var(--status-yellow)' },
  { id: 'bldg-sci', name: 'Science Complex', color: 'var(--primary-teal)' },
  { id: 'bldg-union', name: 'Student Union', color: 'var(--status-red)' },
  { id: 'bldg-arts', name: 'Arts Center', color: 'var(--primary-teal)' },
  { id: 'bldg-gym', name: 'Fitness & Recreation', color: 'var(--primary-teal)' }
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
      
      {/* Header with Time and Weather */}
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

      {/* Interactive Map Area */}
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
        
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: '2rem' }}>
            
            <button 
               onClick={() => navigate(`/live/building/${BUILDINGS[0].id}`)}
               style={{ position: 'absolute', top: '15%', left: '20%', width: '220px', height: '140px', backgroundColor: 'var(--bg-panel)', border: `2px solid ${BUILDINGS[0].color}`, borderRadius: 'var(--radius-lg)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-main)', fontWeight: 600, fontSize: '1rem', transition: 'var(--transition-base)', boxShadow: 'var(--shadow-sm)', fontFamily: 'inherit' }}
               className="hover-lift"
            >
              {BUILDINGS[0].name}
            </button>

            <button 
               onClick={() => navigate(`/live/building/${BUILDINGS[1].id}`)}
               style={{ position: 'absolute', top: '10%', right: '25%', width: '180px', height: '200px', backgroundColor: 'var(--bg-panel)', border: `2px solid ${BUILDINGS[1].color}`, borderRadius: 'var(--radius-lg)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-main)', fontWeight: 600, fontSize: '1rem', transition: 'var(--transition-base)', boxShadow: 'var(--shadow-sm)', fontFamily: 'inherit' }}
               className="hover-lift"
            >
              {BUILDINGS[1].name}
            </button>

            <button 
               onClick={() => navigate(`/live/building/${BUILDINGS[2].id}`)}
               style={{ position: 'absolute', top: '45%', left: '35%', width: '300px', height: '160px', backgroundColor: 'var(--bg-panel)', border: `2px solid ${BUILDINGS[2].color}`, borderRadius: 'var(--radius-lg)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-main)', fontWeight: 600, fontSize: '1rem', transition: 'var(--transition-base)', boxShadow: 'var(--shadow-sm)', fontFamily: 'inherit' }}
               className="hover-lift"
            >
              {BUILDINGS[2].name}
            </button>

            <button 
               onClick={() => navigate(`/live/building/${BUILDINGS[3].id}`)}
               style={{ position: 'absolute', bottom: '15%', left: '15%', width: '200px', height: '150px', backgroundColor: 'var(--bg-panel)', border: `2px solid ${BUILDINGS[3].color}`, borderRadius: 'var(--radius-lg)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-main)', fontWeight: 600, fontSize: '1rem', transition: 'var(--transition-base)', boxShadow: 'var(--shadow-sm)', fontFamily: 'inherit' }}
               className="hover-lift"
            >
              {BUILDINGS[3].name}
            </button>

            <button 
               onClick={() => navigate(`/live/building/${BUILDINGS[4].id}`)}
               style={{ position: 'absolute', bottom: '25%', right: '15%', width: '160px', height: '220px', backgroundColor: 'var(--bg-panel)', border: `2px solid ${BUILDINGS[4].color}`, borderRadius: 'var(--radius-lg)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-main)', fontWeight: 600, fontSize: '1rem', transition: 'var(--transition-base)', boxShadow: 'var(--shadow-sm)', fontFamily: 'inherit' }}
               className="hover-lift"
            >
              {BUILDINGS[4].name}
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
