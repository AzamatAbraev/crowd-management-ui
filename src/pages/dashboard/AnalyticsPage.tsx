import React from 'react';
import { Calendar, Download, PlusCircle } from 'lucide-react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const dummyChartData = [
  { month: 'MONTH 1', library: 20, union: 30, science: 10 },
  { month: 'Wk 2', library: 35, union: 25, science: 30 },
  { month: 'Wk 3', library: 45, union: 40, science: 25 },
  { month: 'MONTH 2', library: 60, union: 35, science: 45 },
  { month: 'Wk 5', library: 85, union: 65, science: 40 },
  { month: 'Wk 6', library: 75, union: 90, science: 55 },
  { month: 'MONTH 3', library: 50, union: 70, science: 45 },
];

const peakHeatmapData = [
  { time: '08:00', days: [0.3, 0.4, 0.5, 0.4, 0.3, 0.1, 0.1] },
  { time: '12:00', days: [0.7, 0.8, 0.9, 0.8, 0.7, 0.4, 0.3] },
  { time: '16:00', days: [0.6, 0.7, 0.7, 0.8, 0.6, 0.3, 0.2] },
  { time: '20:00', days: [0.4, 0.5, 0.4, 0.3, 0.5, 0.2, 0.1] }
];
const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const AnalyticsPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: '#fff' }}>Historical Analytics</h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--primary-teal)' }}>
            Comprehensive crowd density and occupancy data for the last 90 days.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.6rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
             <Calendar size={16} /> Past 90 Days
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-teal)', border: 'none', color: '#fff', padding: '0.6rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
             <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
           <div style={{ fontSize: '0.7rem', color: 'var(--primary-teal)', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Average Daily Visitors</div>
           <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
             <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>14,820</span>
             <span style={{ fontSize: '0.8rem', color: 'var(--primary-teal)', fontWeight: 600 }}>+12%</span>
           </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
           <div style={{ fontSize: '0.7rem', color: 'var(--primary-teal)', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Peak Occupancy Rate</div>
           <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
             <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>92%</span>
             <span style={{ fontSize: '0.8rem', color: 'var(--status-red)', fontWeight: 600 }}>+4%</span>
           </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
           <div style={{ fontSize: '0.7rem', color: 'var(--primary-teal)', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Avg. Stay Duration</div>
           <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
             <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>1.4 hrs</span>
             <span style={{ fontSize: '0.8rem', color: 'var(--primary-teal)', fontWeight: 600 }}>-5%</span>
           </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
           <div style={{ fontSize: '0.7rem', color: 'var(--primary-teal)', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Active Sensors</div>
           <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
             <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>248</span>
             <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stable</span>
           </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', flex: 1 }}>
        
        {/* Line Chart Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Occupancy Trends</h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--primary-teal)' }}>Top 3 most active buildings over last 90 days</p>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-teal)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-teal)' }}></div> Main Library
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div> Student Union
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a855f7' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a855f7' }}></div> Science Lab
                </div>
              </div>
           </div>
           
           <div style={{ flex: 1, minHeight: '220px', width: '100%' }}>
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={dummyChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                 <XAxis dataKey="month" axisLine={false} tickLine={false} stroke="var(--border-color)" tick={{ fill: 'var(--primary-teal)', fontSize: 10, fontWeight: 700, dy: 10 }} />
                 <Tooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff' }} />
                 <Line type="monotone" dataKey="library" stroke="var(--primary-teal)" strokeWidth={3} dot={false} />
                 <Line type="monotone" dataKey="union" stroke="#3b82f6" strokeWidth={3} dot={false} />
                 <Line type="monotone" dataKey="science" stroke="#a855f7" strokeWidth={3} dot={false} />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Heatmap Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
           <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Peak Hour Heatmap</h3>
           <p style={{ margin: '0.25rem 0 1.5rem', fontSize: '0.8rem', color: 'var(--primary-teal)' }}>Day vs Time (Average week)</p>
           
           <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             {/* Header row (Days) */}
             <div style={{ display: 'flex', borderBottom: 'none' }}>
               <div style={{ width: '40px' }}></div>
               <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                 {dayLabels.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-teal)' }}>{d}</div>)}
               </div>
             </div>
             
             {/* Data rows */}
             {peakHeatmapData.map((row, i) => (
               <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                 <div style={{ width: '40px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{row.time}</div>
                 <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                    {row.days.map((val, j) => (
                      <div key={j} style={{ 
                        height: '16px', 
                        backgroundColor: `rgba(28, 181, 136, ${Math.max(0.1, val)})`, 
                        borderRadius: '2px' 
                      }}></div>
                    ))}
                 </div>
               </div>
             ))}
           </div>
           
           {/* Legend */}
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem' }}>
             <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Low Activity</span>
             <div style={{ width: '120px', height: '4px', background: 'linear-gradient(to right, rgba(28, 181, 136, 0.1), rgba(28, 181, 136, 1))', borderRadius: '2px' }}></div>
             <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Peak</span>
           </div>
        </div>

      </div>

      {/* Bottom Table Row */}
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        
        {/* Compare Buildings */}
        <div className="glass-panel" style={{ width: '280px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Compare Buildings</h3>
          
          <div style={{ border: '1px solid var(--primary-teal)', borderRadius: '8px', padding: '1rem', position: 'relative' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
               Main Library <span style={{ color: 'var(--primary-teal)' }}>●</span>
             </div>
             <div style={{ height: '4px', backgroundColor: 'var(--bg-panel-hover)', borderRadius: '2px' }}>
               <div style={{ width: '90%', height: '100%', backgroundColor: 'var(--primary-teal)', borderRadius: '2px' }}></div>
             </div>
          </div>
          
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', position: 'relative' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
               Science Complex <span style={{ color: 'var(--border-color)' }}>○</span>
             </div>
             <div style={{ height: '4px', backgroundColor: 'var(--bg-panel-hover)', borderRadius: '2px' }}>
               <div style={{ width: '60%', height: '100%', backgroundColor: 'var(--text-muted)', borderRadius: '2px' }}></div>
             </div>
          </div>
          
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', position: 'relative' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
               Fitness Center <span style={{ color: 'var(--border-color)' }}>○</span>
             </div>
             <div style={{ height: '4px', backgroundColor: 'var(--bg-panel-hover)', borderRadius: '2px' }}>
               <div style={{ width: '30%', height: '100%', backgroundColor: 'var(--text-muted)', borderRadius: '2px' }}></div>
             </div>
          </div>

          <button style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px dashed var(--primary-teal)', borderRadius: '8px', color: 'var(--primary-teal)', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}>
            <PlusCircle size={16} /> Add Comparison
          </button>

        </div>

        {/* Building Efficiency Report Table */}
        <div className="glass-panel" style={{ flex: 1, padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Building Efficiency Report</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ backgroundColor: 'var(--primary-teal-transparent)', color: 'var(--primary-teal)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>HISTORICAL</span>
              <span style={{ backgroundColor: 'var(--bg-panel-hover)', color: 'var(--primary-teal)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>90D SCOPE</span>
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ color: 'var(--primary-teal)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ paddingBottom: '1rem' }}>CAMPUS BUILDING</th>
                <th style={{ paddingBottom: '1rem' }}>TOTAL FOOTFALL</th>
                <th style={{ paddingBottom: '1rem' }}>AVG. OCCUPANCY</th>
                <th style={{ paddingBottom: '1rem' }}>PEAK HOUR</th>
                <th style={{ paddingBottom: '1rem' }}>RISK LEVEL</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr>
                <td style={{ padding: '1.25rem 0', fontWeight: 600 }}>Main Library</td>
                <td style={{ padding: '1.25rem 0', color: 'var(--text-muted)' }}>42,501</td>
                <td style={{ padding: '1.25rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    64% <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--primary-teal)', borderRadius: '2px' }}></div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 0', color: 'var(--text-muted)' }}>14:00 - 16:00</td>
                <td style={{ padding: '1.25rem 0' }}>
                   <span style={{ padding: '4px 10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-red)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>High</span>
                </td>
              </tr>
              {/* Row 2 */}
              <tr style={{ borderTop: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.25rem 0', fontWeight: 600 }}>Student Union</td>
                <td style={{ padding: '1.25rem 0', color: 'var(--text-muted)' }}>38,122</td>
                <td style={{ padding: '1.25rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    62% <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--primary-teal)', borderRadius: '2px' }}></div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 0', color: 'var(--text-muted)' }}>12:00 - 13:30</td>
                <td style={{ padding: '1.25rem 0' }}>
                   <span style={{ padding: '4px 10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--status-yellow)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>Moderate</span>
                </td>
              </tr>
              {/* Row 3 */}
              <tr style={{ borderTop: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.25rem 0', fontWeight: 600 }}>Engineering Hall</td>
                <td style={{ padding: '1.25rem 0', color: 'var(--text-muted)' }}>12,400</td>
                <td style={{ padding: '1.25rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    31% <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--primary-teal)', borderRadius: '2px' }}></div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 0', color: 'var(--text-muted)' }}>09:00 - 11:00</td>
                <td style={{ padding: '1.25rem 0' }}>
                   <span style={{ padding: '4px 10px', backgroundColor: 'rgba(28, 181, 136, 0.1)', color: 'var(--status-green)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>Low</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;
