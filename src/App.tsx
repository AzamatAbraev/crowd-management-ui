import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/login/LandingPage';
import TimetablePage from './pages/timetable/TimetablePage';
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
import GrafanaPage from './pages/dashboard/GrafanaPage';
import NoticesPage from './pages/dashboard/NoticesPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/404" replace />;
};

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
  const { user, isAdmin, isManager, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (isManager) return <Navigate to="/admin/overview" replace />;
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
          <Route path="/live" element={<RequireAuth><ViewerLayout /></RequireAuth>}>
            <Route index element={<ViewerCampusMap />} />
            <Route path="building/:buildingId" element={<ViewerBuildingPlan />} />
            <Route path="area/:areaId" element={<ViewerAreaDetails />} />
            <Route path="schedule" element={<ViewerSchedulePage />} />
          </Route>
          <Route path="/admin/overview" element={<RequireManager><OverviewPage /></RequireManager>} />
          <Route path="/admin/floor" element={<RequireManager><FloorLayoutPage /></RequireManager>} />
          <Route path="/admin/timetable" element={<RequireManager><TimetablePage /></RequireManager>} />
          <Route path="/admin/notices" element={<RequireManager><NoticesPage /></RequireManager>} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}