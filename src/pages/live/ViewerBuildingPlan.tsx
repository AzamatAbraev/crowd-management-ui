import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../server';
import { ArrowLeft, Users, AlertTriangle } from 'lucide-react';

interface OccupancyData {
  deviceCounts: Record<string, number>;
}

const MAX_AREA_CAPACITY_ASSUMPTION = 50;

const BUILDING_NAMES: Record<string, string> = {
  'bldg-lib': 'Main Library',
  'bldg-eng': 'Engineering Block',
  'bldg-sci': 'Science Complex',
  'bldg-union': 'Student Union',
  'bldg-arts': 'Arts Center',
  'bldg-gym': 'Fitness & Recreation'
};

const ViewerBuildingPlan: React.FC = () => {
  const { buildingId } = useParams<{ buildingId: string }>();
  const navigate = useNavigate();
  const [deviceCounts, setDeviceCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchCount = async (): Promise<void> => {
    try {
      const response = await api.get<OccupancyData>('/people/count');
      setDeviceCounts(response.data.deviceCounts || {});
    } catch (error) {
      console.error('Failed to fetch occupancy', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 3000);
    return () => clearInterval(interval);
  }, []);

  const buildingAreas = useMemo(() => {
     const allDevices = Object.keys(deviceCounts);
     if (allDevices.length === 0) return [];
     
     const hashString = (str: string) => str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
     
     return allDevices.filter(dev => {
       const bldgIndex = hashString(dev) % Object.keys(BUILDING_NAMES).length;
       return Object.keys(BUILDING_NAMES)[bldgIndex] === buildingId;
     });
  }, [deviceCounts, buildingId]);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '1000px', margin: '0 auto', gap: '2rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
        <button 
          onClick={() => navigate('/live')}
          style={{ 
            background: 'var(--bg-panel)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '50%', 
            width: '40px', height: '40px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            cursor: 'pointer', color: 'var(--text-main)', transition: 'all 0.2s' 
          }}
          title="Back to Campus Map"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 300, color: 'var(--text-main)', letterSpacing: '1px' }}>
            {buildingId ? BUILDING_NAMES[buildingId] || 'Building Details' : 'Unknown Building'}
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '1rem' }}>Common areas and current occupancy</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-main)', margin: 0 }}>
          Select an Area
        </h2>

        {loading ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading building areas...</div>
        ) : buildingAreas.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem', backgroundColor: 'var(--bg-panel)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
             <AlertTriangle size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
             <div style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 500 }}>No sensors active in this building</div>
             <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Please select another building on the campus map.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {buildingAreas.sort().map(areaId => {
              const count = Math.max(0, deviceCounts[areaId] || 0);
              let percentage = Math.round((count / MAX_AREA_CAPACITY_ASSUMPTION) * 100);
              if (percentage > 100) percentage = 100;
              
              const isCrowded = percentage > 85;
              const isActive = percentage > 50;
              const indicatorColor = isCrowded ? 'var(--status-red)' : isActive ? 'var(--status-yellow)' : 'var(--primary-teal)';
              const statusText = isCrowded ? 'Crowded' : isActive ? 'Active' : 'Quiet';

              return (
                <button 
                  key={areaId}
                  onClick={() => navigate(`/live/area/${areaId}`)}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '1rem',
                    backgroundColor: 'var(--bg-panel)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '12px', 
                    padding: '1.5rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = indicatorColor;
                    e.currentTarget.style.boxShadow = `0 8px 24px ${indicatorColor}20`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                     <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{areaId.toUpperCase()}</span>
                     <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        backgroundColor: `${indicatorColor}15`, 
                        color: indicatorColor, 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase'
                     }}>
                       <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: indicatorColor }} />
                       {statusText}
                     </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', width: '100%' }}>
                    <Users size={20} color="var(--text-muted)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                         <span style={{ color: 'var(--text-muted)' }}>Estimated Occupancy</span>
                         <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{percentage}%</span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: 'var(--bg-panel-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${percentage}%`, backgroundColor: indicatorColor, borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  </div>

                </button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default ViewerBuildingPlan;
