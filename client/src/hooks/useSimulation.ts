import { useState, useCallback, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import {
  calculateProperTime,
  calculateStraightTrajectory,
  calculateCurvedTrajectory,
  calculateCombinedRelativisticTime
} from "../utils/relativisticPhysics";

export function useSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [velocityA, setVelocityA] = useState(0.5); // 50% speed of light
  const [velocityB, setVelocityB] = useState(0.8); // 80% speed of light
  
  // Ship times and positions
  const [shipATime, setShipATime] = useState(0);
  const [shipBTime, setShipBTime] = useState(0);
  const [shipAPosition, setShipAPosition] = useState<[number, number, number]>([0, 5, 0]);
  const [shipBPosition, setShipBPosition] = useState<[number, number, number]>([0, 10, 0]);
  
  // Trajectory trails
  const [trajectoryA, setTrajectoryA] = useState<Array<[number, number, number]>>([]);
  const [trajectoryB, setTrajectoryB] = useState<Array<[number, number, number]>>([]);
  
  // Refs for continuous updates
  const lastTimeRef = useRef(0);
  const maxTrajectoryPoints = 1000;

  // Keyboard controls
  const [subscribeKeys, getKeys] = useKeyboardControls();

  // Handle keyboard inputs
  useEffect(() => {
    const unsubscribePause = subscribeKeys(
      (state) => state.pause,
      (pressed) => {
        if (pressed) {
          toggleSimulation();
        }
      }
    );

    const unsubscribeReset = subscribeKeys(
      (state) => state.reset,
      (pressed) => {
        if (pressed) {
          resetSimulation();
        }
      }
    );

    return () => {
      unsubscribePause();
      unsubscribeReset();
    };
  }, []);

  // Animation loop
  useFrame((state, delta) => {
    if (!isRunning) return;

    const newSimulationTime = simulationTime + delta;
    setSimulationTime(newSimulationTime);

    // Calculate positions first
    const newPosA = calculateStraightTrajectory(newSimulationTime, velocityA, [0, 5, 0]);
    const newPosB = calculateCurvedTrajectory(newSimulationTime, velocityB, [0, 10, 0]);

    // Calculate proper times using relativistic physics
    // Ship A: Only special relativity (straight spacetime path)
    const newShipATime = calculateProperTime(newSimulationTime, velocityA);
    
    // Ship B: Combined special + general relativity effects (curved spacetime path)
    const newShipBTime = calculateCombinedRelativisticTime(
      newSimulationTime, 
      velocityB, 
      newPosB, 
      [0, 10, 0], // Gravitational mass position around Ship B's path
      15 // Gravitational mass strength
    );
    
    setShipATime(newShipATime);
    setShipBTime(newShipBTime);
    
    setShipAPosition(newPosA);
    setShipBPosition(newPosB);

    // Update trajectories (limit points to prevent memory issues)
    setTrajectoryA(prev => {
      const newTrajectory = [...prev, newPosA];
      return newTrajectory.length > maxTrajectoryPoints 
        ? newTrajectory.slice(-maxTrajectoryPoints) 
        : newTrajectory;
    });

    setTrajectoryB(prev => {
      const newTrajectory = [...prev, newPosB];
      return newTrajectory.length > maxTrajectoryPoints 
        ? newTrajectory.slice(-maxTrajectoryPoints) 
        : newTrajectory;
    });

    lastTimeRef.current = newSimulationTime;
  });

  const toggleSimulation = useCallback(() => {
    setIsRunning(prev => !prev);
    console.log(`Simulation ${!isRunning ? 'started' : 'paused'}`);
  }, [isRunning]);

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setSimulationTime(0);
    setShipATime(0);
    setShipBTime(0);
    setShipAPosition([0, 5, 0]);
    setShipBPosition([0, 10, 0]);
    setTrajectoryA([]);
    setTrajectoryB([]);
    lastTimeRef.current = 0;
    console.log('Simulation reset');
  }, []);

  const handleVelocityAChange = useCallback((newVelocity: number) => {
    setVelocityA(Math.max(0.1, Math.min(0.95, newVelocity)));
    console.log(`Ship A velocity set to ${(newVelocity * 100).toFixed(1)}% c`);
  }, []);

  const handleVelocityBChange = useCallback((newVelocity: number) => {
    setVelocityB(Math.max(0.1, Math.min(0.95, newVelocity)));
    console.log(`Ship B velocity set to ${(newVelocity * 100).toFixed(1)}% c`);
  }, []);

  return {
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
    setVelocityA: handleVelocityAChange,
    setVelocityB: handleVelocityBChange
  };
}
