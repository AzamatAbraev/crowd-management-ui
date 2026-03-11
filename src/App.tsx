import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/login/LandingPage';
import TimetablePage from './pages/timetable/TimetablePage';
import DashboardLayout from './components/layout/DashboardLayout';
import OverviewPage from './pages/dashboard/OverviewPage';
import FloorLayoutPage from './pages/dashboard/FloorLayoutPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import SensorsPage from './pages/dashboard/SensorsPage';
import DeviceManagementPage from './pages/dashboard/DeviceManagementPage';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Legacy redirect for Keycloak login */}
          <Route path="/home" element={<Navigate to="/dashboard/overview" replace />} />
          
          {/* New Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="floor" element={<FloorLayoutPage />} />
            <Route path="timetable" element={<TimetablePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="sensors" element={<SensorsPage />} />
            <Route path="devices" element={<DeviceManagementPage />} />
            {/* Placeholders for sidebar links */}
            <Route path="alerts" element={<div style={{padding: '2rem'}}>Alerts Page (Coming Soon)</div>} />
            <Route path="settings" element={<div style={{padding: '2rem'}}>Settings Page (Coming Soon)</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}