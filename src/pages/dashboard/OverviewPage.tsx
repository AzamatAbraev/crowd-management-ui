import React from 'react';
import { Users, AlertTriangle, RadioReceiver, TrendingUp, AlertCircle, Plus, Minus, Eye } from 'lucide-react';

const OverviewPage: React.FC = () => {

  const stats = [
    { title: 'TOTAL OCCUPANCY', value: '4,250', sub: '/ 12,000', change: '-5%', icon: Users, type: 'neutral' },
    { title: 'ACTIVE ALERTS', value: '3', sub: 'Buildings at Cap', change: '+20%', icon: AlertTriangle, type: 'danger' },
    { title: 'SENSOR STATUS', value: '98%', sub: 'Online', change: '+1%', icon: RadioReceiver, type: 'success' },
    { title: 'PREDICTED PEAK', value: '2:00 PM', sub: 'Today', change: '0%', icon: TrendingUp, type: 'neutral' }
  ];

  const criticalAreas = [
    { name: 'Main Library - Floor 2', capacity: '96%', color: 'var(--status-red)', width: '96%', alert: 'Quiet study zone overflow detected' },
    { name: 'Student Union Dining', capacity: '88%', color: 'var(--status-yellow)', width: '88%', alert: 'Lunch peak predicted for next 45m' },
    { name: 'Engineering Lab B', capacity: '82%', color: 'var(--status-yellow)', width: '82%' },
    { name: 'Med-School Lecture Hall', capacity: '76%', color: 'var(--primary-teal)', width: '76%' },
    { name: 'North Commons Annex', capacity: '64%', color: 'var(--primary-teal)', width: '64%' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Campus Live Overview</h1>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: stat.type === 'danger' ? 'rgba(239, 68, 68, 0.1)' : stat.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-panel-hover)',
                borderRadius: '8px'
              }}>
                <stat.icon size={24} color={stat.type === 'danger' ? 'var(--status-red)' : stat.type === 'success' ? 'var(--status-green)' : 'var(--primary-teal)'} />
              </div>
              <div style={{ fontSize: '0.8rem', color: stat.change.startsWith('+') && stat.type === 'danger' ? 'var(--status-red)' : 'var(--text-muted)' }}>
                {stat.change} ~
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '0.25rem' }}>{stat.title}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{stat.value}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stat.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', flex: 1, minHeight: '400px' }}>
        
        {/* Heatmap Area */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
              <div style={{ width: '16px', height: '16px', backgroundColor: 'var(--primary-teal)', borderRadius: '4px' }}></div>
              Interactive Heatmap
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ background: 'var(--primary-teal)', border: 'none', color: '#fff', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>2D VIEW</button>
              <button style={{ background: 'var(--bg-panel-hover)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>3D BLUEPRINT</button>
            </div>
          </div>
          
          {/* Mock Heatmap Canvas */}
          <div style={{ flex: 1, position: 'relative', backgroundColor: '#0d1312', backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            
            {/* Library Zone */}
            <div style={{ position: 'absolute', top: '25%', left: '25%', width: '180px', height: '120px', border: '1px solid var(--status-red)', backgroundColor: 'rgba(239, 68, 68, 0.15)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--status-red)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px' }}>
              LIBRARY (92%)
            </div>
            
            {/* Student Union Zone */}
            <div style={{ position: 'absolute', top: '35%', left: '42%', width: '220px', height: '150px', border: '1px solid var(--status-yellow)', backgroundColor: 'rgba(245, 158, 11, 0.15)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--status-yellow)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px' }}>
              UNION (78%)
            </div>
            
            {/* Science/Gym Zone */}
            <div style={{ position: 'absolute', top: '55%', left: '32%', width: '140px', height: '220px', border: '1px solid var(--primary-teal)', backgroundColor: 'rgba(28, 181, 136, 0.15)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary-teal)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px' }}>
              SCIENCE (45%)
            </div>

            <div style={{ position: 'absolute', top: '65%', left: '42%', width: '150px', height: '130px', border: '1px solid var(--primary-teal)', backgroundColor: 'rgba(28, 181, 136, 0.15)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary-teal)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px' }}>
              GYM (32%)
            </div>

            {/* Zoom Controls */}
            <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-main)', cursor: 'pointer' }}><Plus size={16} /></button>
              <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-main)', cursor: 'pointer' }}><Minus size={16} /></button>
            </div>
            
          </div>
        </div>

        {/* Critical Areas Sidebar */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} color="var(--status-red)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Critical Areas</h3>
          </div>
          
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
            {criticalAreas.map((area, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-main)' }}>{area.name}</span>
                  <span style={{ color: area.color }}>{area.capacity} Capacity</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-panel-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: area.width, backgroundColor: area.color, borderRadius: '3px' }}></div>
                </div>
                {area.alert && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {area.alert}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '1px' }}>
              VIEW DETAILED FLOOR PLANS
            </button>
          </div>
        </div>

      </div>

      {/* Footer Gate Activity */}
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--bg-panel-active)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--primary-teal)', borderRight: '1px solid var(--border-color)' }}>
          <Eye size={16} /> GATE ACTIVITY
        </div>
        
        <div style={{ display: 'flex', flex: 1, padding: '0 1.5rem', gap: '2rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {[
            { name: 'MAIN NORTH GATE', up: 12, down: 4 },
            { name: 'SCIENCE QUAD ENTRY', up: 31, down: 28 },
            { name: 'LIBRARY PLAZA', up: 54, down: 2 },
            { name: 'PARKING LOT C', up: 9, down: 15 }
          ].map((gate, i) => (
             <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
               <span>{gate.name}:</span>
               <span style={{ color: 'var(--status-green)' }}>↑{gate.up}</span>
               <span style={{ color: 'var(--status-red)' }}>↓{gate.down}</span>
             </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default OverviewPage;
