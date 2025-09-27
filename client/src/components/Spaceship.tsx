import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import Chronometer from "./Chronometer";

interface SpaceshipProps {
  position: [number, number, number];
  color: string;
  label: string;
  properTime: number;
  velocity: number;
}

export default function Spaceship({ position, color, label, properTime, velocity }: SpaceshipProps) {
  const shipRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  // Animate the spaceship with subtle rotation
  useFrame((state) => {
    if (bodyRef.current) {
      bodyRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={shipRef} position={position}>
      {/* Ship body */}
      <mesh ref={bodyRef} castShadow receiveShadow>
        <coneGeometry args={[0.5, 2, 8]} />
        <meshPhongMaterial color={color} />
      </mesh>
      
      {/* Ship wings */}
      <mesh position={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[1.5, 0.1, 0.3]} />
        <meshPhongMaterial color={color} />
      </mesh>
      
      {/* Engine glow */}
      <mesh position={[0, -1.2, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>

      {/* Ship label */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        {label}
      </Text>

      {/* Chronometer display */}
      <Chronometer
        position={[0, -2.5, 0]}
        time={properTime}
        velocity={velocity}
        color={color}
      />

      {/* Velocity indicator */}
      <Text
        position={[0, -3.5, 0]}
        fontSize={0.4}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        v = {(velocity * 100).toFixed(1)}% c
      </Text>
    </group>
  );
}
