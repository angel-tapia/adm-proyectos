export interface UserData {
  nombre: string,
  apellido: string,
  correo: string,
  celular: string,
  direccion: string,
  puesto: string,
  horario: {
    entrada: string,
    salida: string
  },
  imagen: string
}