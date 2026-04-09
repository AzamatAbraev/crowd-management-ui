import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/login/LandingPage';
import TimetablePage from './pages/timetable/TimetablePage';
import DashboardLayout from './components/layout/DashboardLayout';
import ViewerLayout from './components/layout/ViewerLayout';
import AdminLandingPage from './pages/admin/AdminLandingPage';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';
import AdminDevicePage from './pages/admin/AdminDevicePage';
import AdminSystemManagementPage from './pages/admin/AdminSystemManagementPage';
import AdminStatisticsPage from './pages/admin/AdminStatisticsPage';
import AdminLiveMonitorPage from './pages/admin/AdminLiveMonitorPage';
import OverviewPage from './pages/dashboard/OverviewPage';
import ViewerCampusMap from './pages/live/ViewerCampusMap';
import ViewerBuildingPlan from './pages/live/ViewerBuildingPlan';
import ViewerAreaDetails from './pages/live/ViewerAreaDetails';
import ViewerSchedulePage from './pages/live/ViewerSchedulePage';
import FloorLayoutPage from './pages/dashboard/FloorLayoutPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import GrafanaPage from './pages/dashboard/GrafanaPage';
import SensorsPage from './pages/dashboard/SensorsPage';
import DeviceManagementPage from './pages/dashboard/DeviceManagementPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const RequireTheKing = ({ children }: { children: React.ReactNode }) => {
  const { isTheKing, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isTheKing ? children : <Navigate to="/live" replace />;
};

const RequireSystemAdmin = ({ children }: { children: React.ReactNode }) => {
  const { isTheKing, isSystemAdmin, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (isTheKing || isSystemAdmin) ? children : <Navigate to="/admin" replace />;
};

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<SmartRedirect />} />
          <Route path="/admin" element={<RequireAdmin><AdminLandingPage /></RequireAdmin>} />
          <Route path="/admin/devices" element={<RequireAdmin><AdminDevicePage /></RequireAdmin>} />
          <Route path="/admin/statistics" element={<RequireAdmin><AdminStatisticsPage /></RequireAdmin>} />
          <Route path="/admin/monitor" element={<RequireAdmin><AdminLiveMonitorPage /></RequireAdmin>} />
          <Route path="/admin/grafana" element={<RequireAdmin><GrafanaPage /></RequireAdmin>} />
          <Route path="/admin/system" element={<RequireSystemAdmin><AdminSystemManagementPage /></RequireSystemAdmin>} />
          <Route path="/admin/users" element={<RequireTheKing><AdminUserManagementPage /></RequireTheKing>} />
          <Route path="/live" element={<ViewerLayout />}>
             <Route index element={<ViewerCampusMap />} />
             <Route path="building/:buildingId" element={<ViewerBuildingPlan />} />
             <Route path="area/:areaId" element={<ViewerAreaDetails />} />
             <Route path="schedule" element={<ViewerSchedulePage />} />
          </Route>
          <Route path="/dashboard" element={<RequireManager><DashboardLayout /></RequireManager>}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="floor" element={<FloorLayoutPage />} />
            <Route path="timetable" element={<TimetablePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="sensors" element={<SensorsPage />} />
            <Route path="devices" element={<DeviceManagementPage />} />
            <Route path="alerts" element={<div style={{padding: '2rem', color: 'var(--text-main)'}}>Alerts Page (Coming Soon)</div>} />
            <Route path="settings" element={<RequireAdmin><div style={{padding: '2rem', color: 'var(--text-main)'}}>Settings Page (Coming Soon)</div></RequireAdmin>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}