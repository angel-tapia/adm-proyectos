// User.ts

export interface User {
  id: number; // Primary Key
  username: string;
  email: string;
  password: string;
  role_id: number; // Foreign Key
}
