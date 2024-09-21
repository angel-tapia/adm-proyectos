export interface Delay {
  id: number; // Primary Key
  date: Date;
  time: string;
  employeeDetailId: number; // Foreign Key
}
