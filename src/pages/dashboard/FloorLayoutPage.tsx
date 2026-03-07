import React from 'react';
import { ArrowLeft, Download, Edit3, Smartphone, Thermometer, Wind, Plus, Minus, Layers } from 'lucide-react';

const FloorLayoutPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: '100%' }}>
      
      {/* Internal Sidebar for Building/Floors */}
      <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <button style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: 0, marginBottom: '1rem', letterSpacing: '0.5px' }}>
            <ArrowLeft size={16} /> CAMPUS OVERVIEW
          </button>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Science Building</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Innovation District, North Campus</div>
        </div>

        {/* Floors List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            FLOORS
          </div>
          {[5, 4, 3, 2, 1].map((floor) => (
            <button key={floor} style={{
              background: floor === 3 ? 'var(--primary-teal)' : 'transparent',
              border: 'none',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              color: floor === 3 ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: floor === 3 ? 600 : 500
            }}>
              <div style={{ 
                width: '24px', height: '24px', 
                backgroundColor: floor === 3 ? 'rgba(255,255,255,0.2)' : 'var(--bg-panel-hover)', 
                borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: floor === 3 ? '#fff' : 'var(--text-main)'
              }}>
                {floor}
              </div>
              Floor {floor} {floor === 3 && "(Active)"}
            </button>
          ))}
        </div>

        {/* Live Capacity Sidebar Stats */}
        <div className="glass-panel" style={{ marginTop: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px' }}>
            LIVE CAPACITY (F3)
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700 }}>142</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 200 max</span>
          </div>
          {/* Progress bar */}
          <div style={{ height: '6px', backgroundColor: 'var(--bg-panel-hover)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '71%', backgroundColor: 'var(--primary-teal)', borderRadius: '3px' }}></div>
          </div>
          
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', marginTop: '0.5rem' }}>
            TRENDS (LAST 4H)
          </div>
          {/* Dummy Bar Chart */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '40px' }}>
            <div style={{ flex: 1, backgroundColor: 'var(--primary-teal-hover)', height: '40%', borderRadius: '2px' }}></div>
            <div style={{ flex: 1, backgroundColor: 'var(--primary-teal-hover)', height: '60%', borderRadius: '2px' }}></div>
            <div style={{ flex: 1, backgroundColor: 'var(--primary-teal-hover)', height: '80%', borderRadius: '2px' }}></div>
            <div style={{ flex: 1, backgroundColor: 'var(--primary-teal)', height: '100%', borderRadius: '2px' }}></div>
            <div style={{ flex: 1, backgroundColor: 'var(--primary-teal-hover)', height: '70%', borderRadius: '2px' }}></div>
            <div style={{ flex: 1, backgroundColor: 'var(--primary-teal-hover)', height: '50%', borderRadius: '2px' }}></div>
            <div style={{ flex: 1, backgroundColor: 'var(--primary-teal-hover)', height: '30%', borderRadius: '2px' }}></div>
          </div>
        </div>
      </div>

      {/* Main Floor Layout Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Floor 3 Layout</h1>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary-teal)'}}></div> Low (0-50%)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--status-yellow)'}}></div> Medium (51-80%)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--status-red)'}}></div> High (81-100%)
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
              <Download size={16} /> Export
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-teal)', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
              <Edit3 size={16} /> Layout Editor
            </button>
          </div>
        </div>

        {/* Room Grid Canvas Placeholder */}
        <div className="glass-panel" style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1.5rem' }}>
          
          {/* Room 301 */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-dark)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gridRow: 'span 2' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
               <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', color: 'var(--primary-teal)' }}>ROOM 301</div>
               <div style={{ backgroundColor: 'var(--status-red)', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>98%</div>
             </div>
             <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>Advanced Physics Lab</div>
             <div style={{ marginTop: 'auto', display: 'flex', gap: '-10px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#555', border: '2px solid var(--bg-dark)', zIndex: 1 }}></div>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#666', border: '2px solid var(--bg-dark)', zIndex: 2, marginLeft: '-8px' }}></div>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--bg-panel-hover)', border: '2px solid var(--bg-dark)', zIndex: 3, marginLeft: '-8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'var(--text-main)', fontWeight: 600 }}>+22</div>
             </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {/* Room 305 */}
            <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-dark)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', color: 'var(--primary-teal)' }}>ROOM 305</div>
                <div style={{ backgroundColor: 'var(--primary-teal)', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>12%</div>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>Faculty Office</div>
            </div>

            {/* Room 306 */}
            <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-dark)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', color: 'var(--primary-teal)' }}>ROOM 306</div>
                <div style={{ backgroundColor: 'var(--status-yellow)', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>54%</div>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>Study Lounge</div>
            </div>
          </div>

          {/* Room 302 */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-dark)', padding: '1.25rem', minHeight: '180px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
               <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', color: 'var(--primary-teal)' }}>ROOM 302</div>
               <div style={{ backgroundColor: 'var(--primary-teal)', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>25%</div>
             </div>
             <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>Seminar Room B</div>
          </div>
          
          {/* Right Floating Controls */}
          <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--primary-teal)', cursor: 'pointer' }}><Plus size={18} /></button>
              <button style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--primary-teal)', cursor: 'pointer' }}><Minus size={18} /></button>
              <button style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--primary-teal)', cursor: 'pointer', marginTop: '0.5rem' }}><Layers size={18} /></button>
          </div>

        </div>

        {/* Footer Stats Row */}
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-teal-transparent)', borderRadius: '8px' }}>
              <Smartphone size={24} color="var(--primary-teal)" />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px' }}>ACTIVE DEVICES</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>342</div>
            </div>
          </div>

          <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--status-yellow)20', borderRadius: '8px' }}>
              <Thermometer size={24} color="var(--status-yellow)" />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px' }}>AVG TEMPERATURE</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>21.4°C</div>
            </div>
          </div>

          <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.15)', borderRadius: '8px' }}>
              <Wind size={24} color="var(--status-blue)" />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px' }}>AIR QUALITY</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Excellent</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FloorLayoutPage;
