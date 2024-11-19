import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AttendanceReports.css';
import { exportToExcel } from '../../utils/exportToExcel';

const reports = [
  {
    id: 1,
    nombre: 'Reporte Enero 2024',
    empleados: [
      {
        id: 1,
        nombre: 'Maria Fernanda Pérez',
        asistencias: 22,
        ausencias: 1,
        tardanzas: 2,
        horasExtras: 5,
      },
      {
        id: 2,
        nombre: 'María García',
        asistencias: 23,
        ausencias: 0,
        tardanzas: 1,
        horasExtras: 3,
      },
      {
        id: 3,
        nombre: 'Carlos Rodríguez',
        asistencias: 20,
        ausencias: 3,
        tardanzas: 0,
        horasExtras: 0,
      },
    ],
  },
  {
    id: 2,
    nombre: 'Reporte Febrero 2024',
    empleados: [
      {
        id: 1,
        nombre: 'Mario Pérez Rodriguez',
        asistencias: 20,
        ausencias: 2,
        tardanzas: 1,
        horasExtras: 4,
      },
      {
        id: 2,
        nombre: 'María García',
        asistencias: 22,
        ausencias: 1,
        tardanzas: 0,
        horasExtras: 2,
      },
      {
        id: 4,
        nombre: 'Ana Martínez',
        asistencias: 21,
        ausencias: 2,
        tardanzas: 3,
        horasExtras: 1,
      },
    ],
  },
  {
    id: 3,
    nombre: 'Reporte Marzo 2024',
    empleados: [
      {
        id: 2,
        nombre: 'María García',
        asistencias: 23,
        ausencias: 0,
        tardanzas: 1,
        horasExtras: 6,
      },
      {
        id: 4,
        nombre: 'Ana Martínez',
        asistencias: 22,
        ausencias: 1,
        tardanzas: 2,
        horasExtras: 3,
      },
      {
        id: 5,
        nombre: 'Luis Sánchez',
        asistencias: 23,
        ausencias: 0,
        tardanzas: 0,
        horasExtras: 8,
      },
    ],
  },
];

const AttendanceReports = () => {
  const [selectedReport, setSelectedReport] = useState(reports[0]);
  const [search, setSearch] = useState('');

  const filteredEmployees = selectedReport.empleados.filter((employee) =>
    employee.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const totalEmployees = selectedReport.empleados.length;
  const averageAttendances =
    selectedReport.empleados.reduce((sum, emp) => sum + emp.asistencias, 0) /
    totalEmployees;
  const totalAbsences = selectedReport.empleados.reduce(
    (sum, emp) => sum + emp.ausencias,
    0
  );
  const totalLateness = selectedReport.empleados.reduce(
    (sum, emp) => sum + emp.tardanzas,
    0
  );
  const totalOvertimeHours = selectedReport.empleados.reduce(
    (sum, emp) => sum + emp.horasExtras,
    0
  );

  const getEmployeeStatus = (ausencias: number, tardanzas: number) => {
    if (ausencias === 0 && tardanzas === 0) return 'excellent';
    if (ausencias <= 1 && tardanzas <= 2) return 'needs-improvement';
    return 'critical';
  };

  const handleExport = () => {
    exportToExcel(selectedReport.empleados, selectedReport.nombre);
  };

  return (
    <div className="scrollable-content">
      <div className="header">
        <h1>Reportes de Asistencia</h1>
      </div>

      <div className="content">
        <div className="actions-container">
          <div className="selector-container">
            <select
              id="report"
              value={selectedReport.id}
              onChange={(e) =>
                setSelectedReport(
                  reports.find((r) => r.id === parseInt(e.target.value)) ||
                    reports[0]
                )
              }
              className="selector-input"
            >
              {reports.map((report) => (
                <option key={report.id} value={report.id}>
                  {report.nombre}
                </option>
              ))}
            </select>
          </div>
          <button className="export-button" onClick={handleExport}>
            <span className="icon">📊</span>
            Exportar Reporte
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedReport.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="statistics">
              <div className="statistic-card attendances">
                <div className="icon">👥</div>
                <h2>Promedio de Asistencias</h2>
                <p className="statistic-value">
                  {averageAttendances.toFixed(1)} días
                </p>
              </div>
              <div className="statistic-card absences">
                <div className="icon">🏖️</div>
                <h2>Total de Ausencias</h2>
                <p className="statistic-value">{totalAbsences} días</p>
              </div>
              <div className="statistic-card lateness">
                <div className="icon">⏰</div>
                <h2>Total de Tardanzas</h2>
                <p className="statistic-value">{totalLateness}</p>
              </div>
              <div className="statistic-card overtime-hours">
                <div className="icon">💪</div>
                <h2>Total Horas Extras</h2>
                <p className="statistic-value">{totalOvertimeHours} horas</p>
              </div>
            </div>
            <div className="actions-container">
              <div className="search-container">
                <input
                  id="search"
                  type="text"
                  placeholder="Buscar empleado..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="table-container">
              {filteredEmployees.map((employee) => {
                const status = getEmployeeStatus(
                  employee.ausencias,
                  employee.tardanzas
                );
                return (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`employee-card ${status}`}
                  >
                    <div className="employee-info">
                      <h3 className="employee-name">{employee.nombre}</h3>
                      <span className={`status-badge ${status}`}>
                        {status === 'excellent'
                          ? 'Excelente'
                          : status === 'needs-improvement'
                            ? 'Necesita mejorar'
                            : 'Crítico'}
                      </span>
                    </div>
                    <div className="employee-data">
                      <div className="data">
                        <span className="data-value">
                          {employee.asistencias}
                        </span>
                        <span className="data-label">Asistencias</span>
                      </div>
                      <div className="data">
                        <span className="data-value">{employee.ausencias}</span>
                        <span className="data-label">Ausencias</span>
                      </div>
                      <div className="data">
                        <span className="data-value">{employee.tardanzas}</span>
                        <span className="data-label">Tardanzas</span>
                      </div>
                      <div className="data">
                        <span className="data-value">
                          {employee.horasExtras}
                        </span>
                        <span className="data-label">Horas Extras</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AttendanceReports;
