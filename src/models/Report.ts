export interface Report {
  id: number;
  nombre: string;
  empleados: Employee[];
}

export interface Employee {
  id: number;
  nombre: string;
  asistencias: number;
  ausencias: number;
  tardanzas: number;
  horasExtras: number;
}
