export interface Employee {
  id: number; // Primary Key
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  biometricData: string;
  phoneNumber: string;
  address: string;
  employeeDetailId: number; // Foreign Key
}
