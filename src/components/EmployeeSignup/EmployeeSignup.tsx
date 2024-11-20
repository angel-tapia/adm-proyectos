import {
  Dropdown,
  IDropdownOption,
  IIconProps,
  IStackTokens,
  PrimaryButton,
  ResponsiveMode,
  Spinner,
  SpinnerSize,
  Stack,
  TextField,
} from '@fluentui/react';
import { useEffect, useRef, useState } from 'react';
import { IoArrowBackCircle } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { User } from '../../models';
import axios from 'axios';
import './EmployeeSignup.css';

export default function EmployeeSignup() {
  // Fluent UI variables
  const stackTokens: IStackTokens = { childrenGap: 10 };
  const [optionsPuesto, setOptionsPuesto] = useState<IDropdownOption[]>([]);
  const [optionsHorario, setOptionsHorario] = useState<IDropdownOption[]>([]);

  useEffect(() => {
    const loadPuestos = async () => {
      await axios
        .get('http://localhost:8000/app/get-puestos/')
        .then((response) => {
          var puestos: IDropdownOption[] = [];
          response.data.puestos.forEach((puesto: any) => {
            puestos.push({
              key: puesto.id,
              text: puesto.nombre,
            });
          });
          setOptionsPuesto(puestos);
        })
        .catch((error) =>
          console.error('Ocurrio un error al cargar puestos. ', error)
        );
    };

    const loadHorarios = async () => {
      await axios
        .get('http://localhost:8000/app/get-horarios/')
        .then((response) => {
          var horarios: IDropdownOption[] = [];
          response.data.horarios.forEach((horario: any) => {
            horarios.push({
              key: horario.id,
              text: horario.horario,
            });
          });
          setOptionsHorario(horarios);
        })
        .catch((error) =>
          console.error('Ocurrio un error al cargar horarios. ', error)
        );
    };

    loadPuestos();
    loadHorarios();
  }, []);

  const cameraIcon: IIconProps = { iconName: 'Camera' };

  // Camera access variables
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [loadingCamera, setLoadingCamera] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>(); // Image stored in base64 format
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null); // Reference to video element
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Reference to canvas element

  async function openCamera() {
    try {
      setIsCameraActive(true);
      setLoadingCamera(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      mediaStreamRef.current = mediaStream;
      setLoadingCamera(false);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play(); // Display camera stream
      }
    } catch (error) {
      console.error('Error accessing camera. ', error);
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (canvas && video) {
      const context = canvas.getContext('2d');
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Store image in base64
      const dataURL = canvas.toDataURL('image/png');
      setImgSrc(dataURL);
      userData.imagen = dataURL.split(',')[1];
    }

    // Turn off camera
    if (mediaStreamRef) {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  }

  // User data variables
  const [userData, setUserData] = useState<User>({
    nombre: '',
    apellidos: '',
    correo: '',
    celular: '',
    direccion: '',
    puesto: '',
    horario: '',
    imagen: '',
  });

  const handleTextInputChange = (event: any, newValue: any) => {
    const { name } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handlePuestoChange = (event: any, option: any) => {
    setUserData((prevValues) => ({
      ...prevValues,
      puesto: option.key,
    }));
  };

  const handleHorarioChange = (event: any, option: any) => {
    setUserData((prevValues) => ({
      ...prevValues,
      horario: option.key,
    }));
  };

  function validData() {
    for (const [key, value] of Object.entries(userData)) {
      if (value == null || value == undefined || value == '') {
        return false;
      }
    }

    return true;
  }

  async function saveUser() {
    console.log(userData);
    await axios
      .post(`http://localhost:8000/app/crear-empleado/`, userData)
      .then((response) => {
        alert('Usuario registrado exitosamente');
        console.log(response);

        setUserData({
          nombre: '',
          apellidos: '',
          correo: '',
          celular: '',
          direccion: '',
          puesto: '',
          horario: '',
          imagen: '',
        });

        setImgSrc('');
      })
      .catch((error) => {
        console.error('Ha ocurrido un error. ', error);
        alert('Ocurrio un error. Intente de nuevo');
      });
  }

  return (
    <Stack
      tokens={stackTokens}
      styles={{
        root: {
          padding: '16px',
        },
      }}
      className="form-container"
    >
      {!isCameraActive && (
        <>
          <div className="header">
            <h1>Registro de Empleados</h1>
            <Link to="/employees">
              <IoArrowBackCircle className="header-btn" />
            </Link>
          </div>

          <TextField
            name="nombre"
            required
            autoComplete="off"
            label="Nombre:"
            onChange={handleTextInputChange}
            value={userData.nombre}
            className="text-input"
          />
          <TextField
            name="apellidos"
            required
            autoComplete="off"
            label="Apellidos:"
            onChange={handleTextInputChange}
            value={userData.apellidos}
            className="text-input"
          />
          <TextField
            name="correo"
            required
            autoComplete="off"
            label="Correo:"
            onChange={handleTextInputChange}
            value={userData.correo}
            className="text-input"
          />
          <TextField
            name="celular"
            required
            autoComplete="off"
            label="Celular:"
            onChange={handleTextInputChange}
            value={userData.celular}
            className="text-input"
            type="number"
          />
          <TextField
            name="direccion"
            required
            autoComplete="off"
            label="Direccion:"
            onChange={handleTextInputChange}
            value={userData.direccion}
            className="text-input"
          />
          <Dropdown
            label="Puesto:"
            options={optionsPuesto}
            required
            responsiveMode={ResponsiveMode.large}
            selectedKey={userData.puesto}
            onChange={handlePuestoChange}
            className="text-input"
          />
          <Dropdown
            label="Horario:"
            options={optionsHorario}
            required
            responsiveMode={ResponsiveMode.large}
            className="text-input"
            onChange={handleHorarioChange}
            selectedKey={userData.horario}
          />
          <PrimaryButton
            text="Capturar rostro"
            style={{ marginTop: '12px' }}
            iconProps={cameraIcon}
            onClick={openCamera}
            className="text-input"
          />

          <PrimaryButton
            text="Guardar"
            onClick={saveUser}
            disabled={!validData()}
            className="text-input"
          />
        </>
      )}

      {isCameraActive && (
        <div className="camera-container">
          {loadingCamera && (
            <Spinner
              label="Cargando..."
              size={SpinnerSize.large}
              styles={{ root: { height: '120px' } }}
            />
          )}

          <video ref={videoRef} className="camera-feed" />
          <PrimaryButton
            onClick={capturePhoto}
            text="Tomar foto"
            style={{ width: '100%' }}
          />
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      {!isCameraActive && (
        <img src={imgSrc} alt="" style={{ marginBottom: '2rem' }} />
      )}
    </Stack>
  );
}
