import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/login/LoginPage';
import { HomePage } from './pages/home/HomePage';
import TimetablePage from './pages/timetable/TimetablePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/timetable" element={<TimetablePage />} />
      </Routes>
    </Router>
  );
}