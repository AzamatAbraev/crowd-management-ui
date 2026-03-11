import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/login/LandingPage';
import TimetablePage from './pages/timetable/TimetablePage';
import DashboardLayout from './components/layout/DashboardLayout';
import ViewerLayout from './components/layout/ViewerLayout';
import AdminLandingPage from './pages/admin/AdminLandingPage';
import OverviewPage from './pages/dashboard/OverviewPage';
import ViewerCampusMap from './pages/live/ViewerCampusMap';
import ViewerBuildingPlan from './pages/live/ViewerBuildingPlan';
import ViewerAreaDetails from './pages/live/ViewerAreaDetails';
import ViewerSchedulePage from './pages/live/ViewerSchedulePage';
import FloorLayoutPage from './pages/dashboard/FloorLayoutPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import SensorsPage from './pages/dashboard/SensorsPage';
import DeviceManagementPage from './pages/dashboard/DeviceManagementPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// --- Protective Route Wrappers ---
const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  
  // Extra robust check: if they have the 'admin' role explicitly in the user object
  const effectivelyAdmin = isAdmin || user?.roles?.includes('admin');
  
  return effectivelyAdmin ? children : <Navigate to="/live" replace />;
};

const RequireManager = ({ children }: { children: React.ReactNode }) => {
  const { user, isManager, isAdmin, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  
  const effectivelyAdmin = isAdmin || user?.roles?.includes('admin');
  const effectivelyManager = isManager || effectivelyAdmin || user?.roles?.includes('manage-devices');
  
  return effectivelyManager ? children : <Navigate to="/live" replace />;
};

const SmartRedirect = () => {
    const { isAdmin, isManager, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    
    if (isAdmin) return <Navigate to="/admin" replace />;
    if (isManager) return <Navigate to="/dashboard/overview" replace />;
    return <Navigate to="/live" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public / Landing Route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Gateway Redirect */}
          <Route path="/home" element={<SmartRedirect />} />
          
          {/* 1. Admin Exclusive Domain */}
          <Route path="/admin" element={<RequireAdmin><AdminLandingPage /></RequireAdmin>} />
          
          {/* 2. Viewer Minimalist Domain */}
          <Route path="/live" element={<ViewerLayout />}>
             <Route index element={<ViewerCampusMap />} />
             <Route path="building/:buildingId" element={<ViewerBuildingPlan />} />
             <Route path="area/:areaId" element={<ViewerAreaDetails />} />
             <Route path="schedule" element={<ViewerSchedulePage />} />
          </Route>

          {/* 3. Faculty Manager Dashboard Domain */}
          <Route path="/dashboard" element={<RequireManager><DashboardLayout /></RequireManager>}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="floor" element={<FloorLayoutPage />} />
            <Route path="timetable" element={<TimetablePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            
            {/* Some specific routes inside the dashboard might still require strict admin checks */}
            <Route path="sensors" element={<SensorsPage />} />
            {/* Devices is accessible by admins+managers (already inside RequireManager wrapper) */}
            <Route path="devices" element={<DeviceManagementPage />} />
            <Route path="alerts" element={<div style={{padding: '2rem', color: 'var(--text-main)'}}>Alerts Page (Coming Soon)</div>} />
            <Route path="settings" element={<RequireAdmin><div style={{padding: '2rem', color: 'var(--text-main)'}}>Settings Page (Coming Soon)</div></RequireAdmin>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}