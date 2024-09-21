export interface ExtraHours {
  id: number; // Primary Key
  date: Date;
  hours: number;
  employeeDetailId: number; // Foreign Key
}
