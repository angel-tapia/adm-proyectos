export interface MonthlyReport {
  id: number; // Primary Key
  month: number;
  year: number;
  delays: number;
  earlyExits: number;
  hoursWorked: number;
  extraHours: number;
  absences: number;
  employeeDetailId: number; // Foreign Key
}
