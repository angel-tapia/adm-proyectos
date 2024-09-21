export interface Absence {
  id: number; // Primary Key
  date: Date;
  reason: string;
  employeeDetailId: number; // Foreign Key
}
