import React from 'react';
import './App.css';
import BottomTabBar from './components/TabBar/TabBar';
import Attendance from './components/Attendance/Attendance';
import { initializeIcons } from '@fluentui/react';
initializeIcons();


function App() {
  return (
    <div className="App">
      <Attendance></Attendance>
      <BottomTabBar />
    </div>
  );
}

export default App;
