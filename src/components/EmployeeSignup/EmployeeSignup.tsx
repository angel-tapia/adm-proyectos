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
import { useRef, useState } from 'react';
import { User } from '../../models';
import { IoArrowBackCircle } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import './EmployeeSignup.css';
import axios from 'axios';

export default function EmployeeSignup() {
  // Fluent UI variables
  const stackTokens: IStackTokens = { childrenGap: 10 };
  const optionsPuesto: IDropdownOption[] = [
    { key: 'Gerencia', text: 'Gerencia' },
    { key: 'Recursos Humanos', text: 'Recursos Humanos' },
    { key: 'Finanzas', text: 'Finanzas' },
    { key: 'Produccion', text: 'Produccion' },
    { key: 'Ventas', text: 'Ventas' },
  ];

  const optionsHorario: IDropdownOption[] = [
    { key: 'matutino', text: '8:00' },
    { key: 'vespertino', text: '14:00' },
    { key: 'nocturno', text: '20:00' },
  ];

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
      userData.imagen = dataURL;
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
    hora_entrada: '',
    hora_salida: '',
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

  const handleHoraEntradaChange = (event: any, option: any) => {
    setUserData((prevValues) => ({
      ...prevValues,
      hora_entrada: option.key,
    }));
  };

  const handleHoraSalidaChange = (event: any, option: any) => {
    setUserData((prevValues) => ({
      ...prevValues,
      hora_salida: option.key,
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
    await axios
      .post(`http://localhost:8000/crear-empleado/`, userData)
      .then((response) => {
        alert('Usuario registrado exitosamente');
        console.log(response);
      })
      .catch((error) => console.error('Ha ocurrido un error. ', error));

    setUserData({
      nombre: '',
      apellidos: '',
      correo: '',
      celular: '',
      direccion: '',
      puesto: '',
      hora_entrada: '',
      hora_salida: '',
      imagen: '',
    });

    setImgSrc('');
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
            label="Horario de entrada:"
            options={optionsHorario}
            required
            responsiveMode={ResponsiveMode.large}
            className="text-input"
            onChange={handleHoraEntradaChange}
            selectedKey={userData.hora_entrada}
          />
          <Dropdown
            label="Horario de salida:"
            options={optionsHorario}
            required
            responsiveMode={ResponsiveMode.large}
            className="text-input"
            onChange={handleHoraSalidaChange}
            selectedKey={userData.hora_salida}
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
