import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/login/LoginPage';
import { HomePage } from './pages/home/HomePage';
import TimetablePage from './pages/timetable/TimetablePage';
import Dashboard from './pages/occupancy/OccupancyPage';
import FloorDashboard from './pages/floor-dashboard/FloorDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/floor-dashboard" element={<FloorDashboard />} />
      </Routes>
    </Router>
  );
}