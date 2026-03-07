import React, { useEffect, useState } from 'react';
import { api } from '../../server';
import { AxiosError, type AxiosResponse } from 'axios';
import { Radio, Activity, RefreshCw } from 'lucide-react';

interface OccupancyData {
  count: number;
}

const SensorsPage: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [status, setStatus] = useState<string>('Connecting...');
  const [isPolling, setIsPolling] = useState<boolean>(true);

  const API_URL = '/people/count';

  const fetchCount = async (): Promise<void> => {
    try {
      const response: AxiosResponse<OccupancyData> = await api.get(API_URL);

      setCount(response.data.count);
      setLastUpdated(new Date().toLocaleTimeString());
      setStatus('Connected (Live Feed)');
    } catch (error) {
      const err = error as AxiosError;

      if (err.response?.status === 401) {
        window.location.href = 'http://localhost:8082/oauth2/authorization/keycloak';
      } else {
        console.error('Fetch error:', err.message);
        setStatus('Error Connecting to IoT Device');
      }
    }
  };

  useEffect(() => {
    fetchCount();

    let interval: number | null = null;
    if (isPolling) {
      // Poll every 3 seconds for live simulation
      interval = window.setInterval(fetchCount, 3000);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isPolling]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Radio color="var(--primary-teal)" />
            Live IoT Sensor Feed
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Real-time occupancy data from simulation devices
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            backgroundColor: status.includes('Connected') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
            color: status.includes('Connected') ? 'var(--status-green)' : 'var(--status-red)',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            border: `1px solid ${status.includes('Connected') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: status.includes('Connected') ? 'var(--status-green)' : 'var(--status-red)' }}></div>
            {status}
          </div>

          <button 
            onClick={() => setIsPolling(!isPolling)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: isPolling ? 'var(--primary-teal-transparent)' : 'var(--bg-panel-hover)',
              color: 'var(--primary-teal)',
              border: '1px solid var(--primary-teal)',
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            <RefreshCw size={16} className={isPolling ? "spin" : ""} />
            {isPolling ? 'Pause Polling' : 'Resume Polling'}
          </button>
        </div>
      </div>

      {/* Main Display */}
      <div className="glass-panel" style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        <div style={{
          backgroundColor: 'var(--bg-dark)',
          border: '1px solid var(--border-color)',
          borderRadius: '50%',
          width: '240px',
          height: '240px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: status.includes('Connected') ? '0 0 40px var(--primary-teal-transparent)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <Activity size={32} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
            {count}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>
            People Inside
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Last data ping: <strong style={{ color: 'var(--text-main)' }}>{lastUpdated || "Waiting for data..."}</strong>
          </p>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--primary-teal)', fontSize: '0.85rem' }}>
            Updates every 3 seconds from Device: <strong>SIM-001</strong>
          </p>
        </div>

      </div>

      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SensorsPage;
