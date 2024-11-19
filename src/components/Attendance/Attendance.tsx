import React, { useState, useEffect, useRef } from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  IIconProps,
  Spinner,
  IStackTokens,
} from '@fluentui/react';
import axios from 'axios';
import './Attendance.css';

const cameraIcon: IIconProps = { iconName: 'Camera' };

const stackTokens: IStackTokens = { childrenGap: 15 };

const Attendance: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState<string>('');
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStartCameraAndCapture = async () => {
    try {
      setIsCameraActive(true);
      setAttendanceStatus('');
      setIsRecognizing(false);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      mediaStreamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraActive(false);
    }
  };

  const captureAndSend = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Set canvas size to match the video feed
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        // Draw the video frame to the canvas
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Convert canvas to Base64 and remove the prefix
        const base64Image = canvas.toDataURL('image/png');
        const base64ImageWithoutPrefix = base64Image.replace(
          /^data:image\/png;base64,/,
          ''
        );

        // Stop the camera
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
        setIsCameraActive(false);

        // Send the image to the API
        try {
          setIsRecognizing(true);
          const response = await axios.post(
            'http://127.0.0.1:8000/app/validar-asistencia/',
            {
              foto: base64ImageWithoutPrefix,
            }
          );

          // Handle the response
          const { asistencia, retardo, empleado } = response.data;

          // Construct the attendance status message
          const message = `
            Empleado: ${empleado}
            Asistencia: ${asistencia ? 'Presente' : 'Ausente'}
            Retardo: ${retardo ? 'Sí' : 'No'}
          `;

          setAttendanceStatus(message);
        } catch (error) {
          console.error('Error validating attendance:', error);
          setAttendanceStatus('Error al validar asistencia');
        } finally {
          setIsRecognizing(false);
        }
      }
    }
  };

  return (
    <Stack className='main-container'>
      <header className="header">
        <h1>Registro de asistencia</h1>
      </header>

      <Stack
        className="asistencia-card"
        tokens={stackTokens}
        styles={{
          root: {
            width: '90%',
            maxWidth: '400px',
            margin: '50px auto',
            padding: '20px',
            boxShadow: '0 0 5px rgba(0,0,0,0.2)',
            borderRadius: '8px',
            backgroundColor: '#fff',
          },
        }}
      >
        <Text variant="xLargePlus">Asistencia</Text>
        <Text variant="large" className="date-time">
          {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
        </Text>

        {!isCameraActive && !isRecognizing && !attendanceStatus && (
          <PrimaryButton
            text="Iniciar Cámara y Tomar Foto"
            iconProps={cameraIcon}
            onClick={handleStartCameraAndCapture}
          />
        )}

        {isCameraActive && (
          <div className="video-container">
            <video ref={videoRef} className="video-feed" />
            <PrimaryButton text="Capturar y Enviar" onClick={captureAndSend} className='send-btn' />
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {isRecognizing && (
          <div className="recognizing">
            <Spinner label="Reconociendo..." />
          </div>
        )}

        {attendanceStatus && (
          <Text variant="large" className="attendance-status">
            {attendanceStatus.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </Text>
        )}
      </Stack>
    </Stack>
  );
};

export default Attendance;
