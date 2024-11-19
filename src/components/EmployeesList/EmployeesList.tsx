import { Stack } from '@fluentui/react';
import { IoMdAddCircle } from 'react-icons/io';
import './EmployeesList.css';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';

export default function EmployeesList() {
  const [empleados, setEmpleados] = useState([
    {
      nombre: 'Ivan',
      apellidos: 'Ramirez',
      correo: 'ivanhn@email.com',
      celular: '8121234567',
      direccion: 'Calle 1234, Casa #1234, Colonia 1234',
      puesto: 'Gerencia',
      hora_entrada: '8:00',
      hora_salida: '14:00',
      imagen: '',
    },
    {
      nombre: 'Raymundo',
      apellidos: 'Garza',
      correo: 'ray_gg@email.com',
      celular: '8126354278',
      direccion: 'Calle 1234, Casa #1234, Colonia 1234',
      puesto: 'Recursos Humanos',
      hora_entrada: '8:00',
      hora_salida: '14:00',
      imagen: '',
    },
    {
      nombre: 'Alejandro',
      apellidos: 'Beltran',
      correo: 'alexbelt@email.com',
      celular: '8121687033',
      direccion: 'Calle 1234, Casa #1234, Colonia 1234',
      puesto: 'Finanzas',
      hora_entrada: '8:00',
      hora_salida: '14:00',
      imagen: '',
    },
    {
      nombre: 'Angel',
      apellidos: 'Tapia',
      correo: 'angel_tapia@email.com',
      celular: '8121267343',
      direccion: 'Calle 1234, Casa #1234, Colonia 1234',
      puesto: 'Finanzas',
      hora_entrada: '8:00',
      hora_salida: '14:00',
      imagen: '',
    },
    {
      nombre: 'Fernando',
      apellidos: 'Rivera',
      correo: 'fernando_rivera25@email.com',
      celular: '8128272836',
      direccion: 'Calle 1234, Casa #1234, Colonia 1234',
      puesto: 'Finanzas',
      hora_entrada: '8:00',
      hora_salida: '14:00',
      imagen: '',
    },
  ]);

  async function deleteUser(index: number) {
    const userConfirmed = window.confirm(
      `Desea eliminar al usuario ${empleados[index].nombre} ${empleados[index].apellidos}? \n(Este proceso es irreversible)`
    );

    if (userConfirmed) {
      var nombre = empleados[index].nombre;
      var apellido = empleados[index].apellidos;
      await axios
        .delete(
          `http://127.0.0.1:8000/app/eliminar-empleado/${nombre}/${apellido}/`
        )
        .then((response) => {
          window.alert('Empleado eliminado');
          console.log(response);
        })
        .catch((error) => {
          console.error('Ocurrio un error. ', error);
          alert("Ocurrio un error. Intente de nuevo");
        });
    }
  }

  return (
    <Stack className="list-container">
      <header className="header">
        <h1>Lista de Empleados</h1>
        <Link to="/register">
          <IoMdAddCircle className="header-btn" />
        </Link>
      </header>

      <Stack className="table">
        <Stack className="table-header table-row">
          <h3>Nombre</h3>
          <h3>Correo</h3>
          <h3>Telefono</h3>
          <h3>Direccion</h3>
          <h3>Puesto</h3>
          <h3>Hora de entrada</h3>
          <h3>Hora de salida</h3>
        </Stack>

        {empleados.map((empleado, index) => (
          <Stack className="table-row">
            <p>{empleado.nombre + ' ' + empleado.apellidos}</p>
            <p className="email-row">{empleado.correo}</p>
            <p>{empleado.celular}</p>
            <p>{empleado.direccion}</p>
            <p>{empleado.puesto}</p>
            <p>{empleado.hora_entrada}</p>
            <p>{empleado.hora_salida}</p>
            <FaTrash
              onClick={() => deleteUser(index)}
              className="delete-btn"
              color="#FF0000"
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
