import { useEffect, useState } from 'react';
import { IoMdAddCircle } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { Stack } from '@fluentui/react';
import { UserData } from '../../models/UserData';
import axios from 'axios';
import './EmployeesList.css';

export default function EmployeesList() {
  const [empleados, setEmpleados] = useState<UserData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await axios
        .get('http://127.0.0.1:8000/app/listar-empleados/')
        .then((response) => {
          setEmpleados(response.data.empleados);
        })
        .catch((error) =>
          console.error('Ocurrio un error al cargar los empleados. ', error)
        );
    };

    loadData();
  }, []);

  async function deleteUser(index: number) {
    const userConfirmed = window.confirm(
      `Desea eliminar al usuario ${empleados[index].nombre} ${empleados[index].apellido}? \n(Este proceso es irreversible)`
    );

    if (userConfirmed) {
      var nombre = empleados[index].nombre;
      var apellido = empleados[index].apellido;
      await axios
        .delete(
          `http://127.0.0.1:8000/app/eliminar-empleado/${nombre}/${apellido}/`
        )
        .then((response) => {
          alert(`Usuario ${nombre} ${apellido} eliminado`);
          console.log(response);
        })
        .catch((error) => {
          alert('Ocurrio un error. Intente de nuevo');
          console.error('Ocurrio un error. ', error);
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
            <p>{empleado.nombre + ' ' + empleado.apellido}</p>
            <p className="email-row">{empleado.correo}</p>
            <p>{empleado.celular}</p>
            <p>{empleado.direccion}</p>
            <p>{empleado.puesto}</p>
            <p>{empleado.horario.entrada}</p>
            <p>{empleado.horario.salida}</p>
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
