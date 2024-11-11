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
  Text,
  TextField,
} from '@fluentui/react';
import { useRef, useState } from 'react';
import './EmployeeSignup.css';
import { User } from '../../models';

export default function EmployeeSignup() {
  // Fluent UI variables
  const stackTokens: IStackTokens = { childrenGap: 10 };
  const optionsPuesto: IDropdownOption[] = [
    { key: '1', text: 'Administrador' },
    { key: '0', text: 'Empleado' },
  ];
  const optionsHorario: IDropdownOption[] = [
    { key: 'matutino', text: '8:00 - 14:00' },
    { key: 'vespertino', text: '14:00 - 20:00' },
    { key: 'nocturno', text: '20:00 - 4:00' },
  ];
  const cameraIcon: IIconProps = { iconName: 'Camera' };

  // Camera access variables
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [loadingCamera, setLoadingCamera] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined); // Image stored in base64 format
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
    }

    // Store image in base64
    const dataURL = canvas?.toDataURL('image/png');
    setImgSrc(dataURL);

    // Turn off camera
    if (mediaStreamRef) {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  }

  // User data variables
  const [userData, setUserData] = useState<User>({
    id: -1,
    username: '',
    email: '',
    password: '',
    role_id: -1,
  });

  const handleTextInputChange = (event: any, newValue: any) => {
    const { name } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleDropdownChange = (event: any, option: any) => {
    setUserData((prevValues) => ({
      ...prevValues,
      role_id: option.key,
    }));
  };

  function saveUser() {
    alert('Usuario registrado exitosamente');
    console.log(userData);
    setImgSrc(undefined);
    setUserData({
      id: -1,
      username: '',
      email: '',
      password: '',
      role_id: -1,
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
          <Text variant="xxLarge" color='#f5f5f5'>Registro de Empleados</Text>
          <TextField
            name="username"
            required
            autoComplete="off"
            label="Nombre:"
            onChange={handleTextInputChange}
            value={userData.username}
            className='text-input'
          />
          <TextField
            name="email"
            required
            autoComplete="off"
            label="Correo:"
            onChange={handleTextInputChange}
            value={userData.email}            
            className='text-input'
          />
          <TextField
            name="password"
            required
            autoComplete="off"
            type="password"
            canRevealPassword
            label="Contraseña:"
            onChange={handleTextInputChange}
            value={userData.password}
            className='text-input'
          />
          <Dropdown
            label="Puesto:"
            options={optionsPuesto}
            required
            responsiveMode={ResponsiveMode.large}
            selectedKey={userData.role_id}
            onChange={handleDropdownChange}
            className='text-input'
          />
          <Dropdown
            label="Horario:"
            options={optionsHorario}
            required
            responsiveMode={ResponsiveMode.large}
            className='text-input'
          />
          <PrimaryButton
            text="Capturar rostro"
            style={{ marginTop: '12px' }}
            iconProps={cameraIcon}
            onClick={openCamera}
            className='text-input'
          />
          <PrimaryButton
            text="Guardar"
            onClick={saveUser}
            disabled={imgSrc === undefined}
            className='text-input'
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

      <canvas ref={canvasRef} style={{ display: 'none'}}></canvas>
      {!isCameraActive && <img src={imgSrc} alt="" />}
    </Stack>
  );
}
