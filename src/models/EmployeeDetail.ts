export interface EmployeeDetail {
  id: number; // Primary Key
  startDate: Date;
  endDate: Date | null;
  employeeId: number; // Foreign Key
  positionId: number; // Foreign Key
  scheduleId: number; // Foreign Key
}
