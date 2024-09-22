// Asistencia.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  IIconProps,
  Spinner,
  initializeIcons,
  IStackTokens,
} from '@fluentui/react';
import './Attendance.css';

// Initialize icons
initializeIcons();

const cameraIcon: IIconProps = { iconName: 'Camera' };

const stackTokens: IStackTokens = { childrenGap: 15 };

const Asistencia: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState<string>('');
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const workStartTime = new Date();
  workStartTime.setHours(9, 0, 0, 0); // Start work at 9:00 AM

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTakePicture = async () => {
    setIsCameraActive(true);
    setAttendanceStatus('');
    setIsRecognizing(false);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      mediaStreamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setTimeout(async () => {
        setIsRecognizing(true);

        mediaStream.getTracks().forEach((track) => track.stop());
        setIsCameraActive(false);

        // Simulate API call to take picture and get employee data
        await fakeApiCall('/api/take-picture');

        // If it is succesful, get employee data
        await fakeApiCall('/api/get-employee-data');

        // Determine attendance status
        if (currentTime > workStartTime) {
          setAttendanceStatus('Retardo');
        } else {
          setAttendanceStatus('¡Bienvenido!');
        }
        setIsRecognizing(false);
      }, 3000); // 3-second delay to simulate recognition
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraActive(false);
    }
  };

  const fakeApiCall = (endpoint: string) => {
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        console.log(`Called endpoint: ${endpoint}`);
        resolve({ success: true });
      }, 500);
    });
  };

  return (
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
          text="Tomar Foto"
          iconProps={cameraIcon}
          onClick={handleTakePicture}
        />
      )}

      {isCameraActive && (
        <div className="video-container">
          <video ref={videoRef} className="video-feed" />
        </div>
      )}

      {isRecognizing && (
        <div className="recognizing">
          <Spinner label="Reconociendo..." />
        </div>
      )}

      {attendanceStatus && (
        <Text variant="xxLarge" className="attendance-status">
          {attendanceStatus}
        </Text>
      )}
    </Stack>
  );
};

export default Asistencia;
