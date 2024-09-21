export interface Attendance {
  id: number; // Primary Key
  date: Date;
  checkInTime: string;
  checkOutTime: string;
  employeeDetailId: number; // Foreign Key
}
