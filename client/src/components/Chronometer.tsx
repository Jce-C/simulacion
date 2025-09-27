import { Text } from "@react-three/drei";
import * as THREE from "three";

interface ChronometerProps {
  position: [number, number, number];
  time: number;
  velocity: number;
  color: string;
}

export default function Chronometer({ position, time, velocity, color }: ChronometerProps) {
  // Format time display
  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  return (
    <group position={position}>
      {/* Chronometer background */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[3, 1]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
      </mesh>
      
      {/* Chronometer border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(3, 1)]} />
        <lineBasicMaterial color={color} />
      </lineSegments>

      {/* Time display */}
      <Text
        position={[0, 0.1, 0]}
        fontSize={0.3}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
        fontWeight="bold"
      >
        {formatTime(time)}
      </Text>

      {/* Proper time label */}
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.15}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        Proper Time
      </Text>
    </group>
  );
}
