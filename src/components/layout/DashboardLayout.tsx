import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { ThemeProvider } from './ThemeContext';
import '../../styles/dashboard.css';

const DashboardLayout: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="dashboard-layout">
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Topbar />
          <main style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-8)', backgroundColor: 'var(--bg-base)' }}>
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default DashboardLayout;
