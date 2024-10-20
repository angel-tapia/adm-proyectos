import './App.css';
import BottomTabBar from './components/TabBar/TabBar';
//import Attendance from './components/Attendance/Attendance';
import { initializeIcons } from '@fluentui/react';
//import EmployeeSignup from './components/EmployeeSignup/EmployeeSignup';
import ReportesAsistencia from './pages/reportsPage/AttendanceReports';

initializeIcons();

function App() {
  return (
    <>
      <ReportesAsistencia></ReportesAsistencia>
      <BottomTabBar />
    </>
  );
}

export default App;
