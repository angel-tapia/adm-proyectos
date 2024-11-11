import './App.css';
import BottomTabBar from './components/TabBar/TabBar';
import { initializeIcons } from '@fluentui/react';
import ReportesAsistencia from './pages/reportsPage/AttendanceReports';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Attendance from './components/Attendance/Attendance';
import EmployeeSignup from './components/EmployeeSignup/EmployeeSignup';

initializeIcons();

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Attendance />} />
        <Route path="/register" element={<EmployeeSignup />} />
        <Route path="/reports" element={<ReportesAsistencia />} />
      </Routes>
      <BottomTabBar />
    </Router>
  );
}

export default App;
