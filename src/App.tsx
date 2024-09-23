import './App.css';
import BottomTabBar from './components/TabBar/TabBar';
import Attendance from './components/Attendance/Attendance';
import { initializeIcons } from '@fluentui/react';
import EmployeeSignup from './components/EmployeeSignup/EmployeeSignup';

initializeIcons();

function App() {
  return (
    <>
      <div className="App">
        {/* <Attendance></Attendance> */}
        <EmployeeSignup />
      </div>

      <BottomTabBar />
    </>
  );
}

export default App;
