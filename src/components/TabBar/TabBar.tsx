import React from 'react';
import { FiUser, FiUserPlus, FiBarChart2 } from 'react-icons/fi';
import './TabBar.css';

const BottomTabBar = () => {
  return (
    <div className="tab-bar">
      <div className="tab-item">
        <FiUser size={24} />
        <span className="tab-text">Asistencia</span>
      </div>
      <div className="tab-item">
        <FiUserPlus size={24} />
        <span className="tab-text">Registrar empleado</span>
      </div>
      <div className="tab-item">
        <FiBarChart2 size={24} />
        <span className="tab-text">Reportes</span>
      </div>
    </div>
  );
};

export default BottomTabBar;
