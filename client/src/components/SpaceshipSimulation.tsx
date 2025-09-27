import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import Spaceship from "./Spaceship";
import SpacetimeGrid from "./SpacetimeGrid";
import Starfield from "./Starfield";
import ControlPanel from "./ControlPanel";
import TrajectoryTrail from "./TrajectoryTrail";
import { useSimulation } from "../hooks/useSimulation";

export default function SpaceshipSimulation() {
  console.log('SpaceshipSimulation component loaded');
  const {
    isRunning,
    simulationTime,
    shipATime,
    shipBTime,
    velocityA,
    velocityB,
    shipAPosition,
    shipBPosition,
    trajectoryA,
    trajectoryB,
    toggleSimulation,
    resetSimulation,
    setVelocityA,
    setVelocityB
  } = useSimulation();

  return (
    <>
      {/* Orbital controls for camera movement */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={100}
      />

      {/* Background elements */}
      <Starfield />
      <SpacetimeGrid 
        shipBPosition={shipBPosition}
        gravitationalMass={15}
      />

      {/* Title */}
      <Text
        position={[0, 15, 0]}
        fontSize={2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        Relativistic Spaceship Paradox
      </Text>

      {/* Spaceships */}
      <Spaceship
        position={shipAPosition}
        color="#00ff00"
        label="Ship A"
        properTime={shipATime}
        velocity={velocityA}
      />
      
      <Spaceship
        position={shipBPosition}
        color="#ff0000"
        label="Ship B"
        properTime={shipBTime}
        velocity={velocityB}
      />

      {/* Trajectory trails */}
      <TrajectoryTrail
        points={trajectoryA}
        color="#00ff00"
        opacity={0.6}
      />
      
      <TrajectoryTrail
        points={trajectoryB}
        color="#ff0000"
        opacity={0.6}
      />

      {/* Control panel */}
      <ControlPanel
        isRunning={isRunning}
        simulationTime={simulationTime}
        velocityA={velocityA}
        velocityB={velocityB}
        onToggleSimulation={toggleSimulation}
        onReset={resetSimulation}
        onVelocityAChange={setVelocityA}
        onVelocityBChange={setVelocityB}
      />

      {/* Coordinate axes */}
      <axesHelper args={[10]} />
    </>
  );
}
