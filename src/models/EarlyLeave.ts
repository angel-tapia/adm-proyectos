export interface EarlyLeave {
  id: number; // Primary Key
  date: Date;
  time: string;
  reason: string;
  employeeDetailId: number; // Foreign Key
}
