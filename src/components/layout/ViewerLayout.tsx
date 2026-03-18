import React from 'react';
import { Outlet } from 'react-router-dom';
import ViewerTopbar from './ViewerTopbar';
import { ThemeProvider } from './ThemeContext';
import '../../styles/dashboard.css';

const ViewerLayout: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="dashboard-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
        <ViewerTopbar />
        <main style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-8)', backgroundColor: 'var(--bg-base)' }}>
           {/* Center content to avoid extreme width stretching on big screens */}
           <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
             <Outlet />
           </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default ViewerLayout;
