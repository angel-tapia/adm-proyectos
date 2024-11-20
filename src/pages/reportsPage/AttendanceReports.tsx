import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AttendanceReports.css';
import { exportToExcel } from '../../utils/exportToExcel';
import axios from 'axios';
import { Report } from '../../models/Report';
import Loading from './components/Loading';

const AttendanceReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fetch the reports data from the provided URL
    axios
      .get('http://127.0.0.1:8000/app/exportar-reporte/')
      .then((response) => {
        console.log('Data received:', response.data); // Verificar los datos recibidos
        setReports(response.data);
        setSelectedReport(response.data[0]);
      })
      .catch((error) => {
        console.error('Error fetching reports:', error);
      });
  }, []);

  if (!selectedReport) {
    return (
      <div className="scrollable-content">
        <Loading />
      </div>
    );
  }

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
