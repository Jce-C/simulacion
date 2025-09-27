import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Separator } from '../components/ui/separator';
import {
  calculateProperTime,
  calculateStraightTrajectory,
  calculateCurvedTrajectory,
  calculateCombinedRelativisticTime,
  getPhysicsInfo
} from '../utils/relativisticPhysics';

export default function FallbackSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [velocityA, setVelocityA] = useState(0.5);
  const [velocityB, setVelocityB] = useState(0.8);
  const [shipATime, setShipATime] = useState(0);
  const [shipBTime, setShipBTime] = useState(0);
  const [trajectoryA, setTrajectoryA] = useState<Array<[number, number, number]>>([]);
  const [trajectoryB, setTrajectoryB] = useState<Array<[number, number, number]>>([]);
  
  const animationRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTimeRef = useRef(0);

  // Animation loop
  useEffect(() => {
    let currentSimTime = simulationTime;
    
    const animate = (timestamp: number) => {
      if (!isRunning) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      if (deltaTime >= 16) { // ~60fps
        currentSimTime = currentSimTime + deltaTime * 0.001;
        setSimulationTime(currentSimTime);

        // Calculate positions and proper times
        const newPosA = calculateStraightTrajectory(currentSimTime, velocityA, [0, 5, 0]);
        const newPosB = calculateCurvedTrajectory(currentSimTime, velocityB, [0, 10, 0]);
        
        // Calculate proper times with gravitational effects
        const newShipATime = calculateProperTime(currentSimTime, velocityA);
        const newShipBTime = calculateCombinedRelativisticTime(
          currentSimTime, 
          velocityB, 
          newPosB, 
          [0, 10, 0], 
          15
        );
        
        setShipATime(newShipATime);
        setShipBTime(newShipBTime);
        
        setTrajectoryA(prev => [...prev.slice(-500), newPosA]);
        setTrajectoryB(prev => [...prev.slice(-500), newPosB]);

        lastTimeRef.current = timestamp;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, velocityA, velocityB]);

  // Canvas drawing function with isometric perspective
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw starfield (static pattern)
    ctx.fillStyle = 'white';
    for (let i = 0; i < 100; i++) {
      const x = (i * 127 % canvas.width); // Use deterministic pattern
      const y = (i * 211 % canvas.height);
      ctx.fillRect(x, y, 1, 1);
    }

    // Draw isometric spacetime grid with deformation
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 100;
    
    // Isometric projection parameters
    const gridSize = 30;
    const gridCount = 15;
    const isoScaleX = 1.0;
    const isoScaleY = 0.5;
    
    // Function to convert 3D to isometric 2D
    const toIsometric = (x: number, y: number, z: number) => {
      const isoX = (x - z) * isoScaleX;
      const isoY = (x + z) * isoScaleY - y;
      return {
        x: centerX + isoX,
        y: centerY - isoY
      };
    };

    // Draw deformed spacetime grid
    ctx.strokeStyle = 'rgba(100, 150, 255, 0.6)';
    ctx.lineWidth = 1;
    
    for (let i = -gridCount; i <= gridCount; i++) {
      for (let j = -gridCount; j <= gridCount; j++) {
        const x = i * gridSize;
        const z = j * gridSize;
        
        // Calculate deformation based on ship positions
        let deformation = 0;
        
        // Ship A deformation (smaller, straight trajectory)
        if (trajectoryA.length > 0) {
          const shipA = trajectoryA[trajectoryA.length - 1];
          const distA = Math.sqrt((x - shipA[0] * 20) ** 2 + (z - shipA[2] * 20) ** 2);
          deformation += Math.max(0, 20 - distA * 0.3) * 0.5;
        }
        
        // Ship B deformation (larger, creates gravitational well)
        if (trajectoryB.length > 0) {
          const shipB = trajectoryB[trajectoryB.length - 1];
          const distB = Math.sqrt((x - shipB[0] * 20) ** 2 + (z - shipB[2] * 20) ** 2);
          deformation += Math.max(0, 40 - distB * 0.2) * 2;
        }
        
        const y = -deformation;
        
        // Draw horizontal lines
        if (i < gridCount) {
          const start = toIsometric(x, y, z);
          const nextX = (i + 1) * gridSize;
          let nextDeformation = 0;
          
          if (trajectoryA.length > 0) {
            const shipA = trajectoryA[trajectoryA.length - 1];
            const distA = Math.sqrt((nextX - shipA[0] * 20) ** 2 + (z - shipA[2] * 20) ** 2);
            nextDeformation += Math.max(0, 20 - distA * 0.3) * 0.5;
          }
          
          if (trajectoryB.length > 0) {
            const shipB = trajectoryB[trajectoryB.length - 1];
            const distB = Math.sqrt((nextX - shipB[0] * 20) ** 2 + (z - shipB[2] * 20) ** 2);
            nextDeformation += Math.max(0, 40 - distB * 0.2) * 2;
          }
          
          const end = toIsometric(nextX, -nextDeformation, z);
          
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        }
        
        // Draw vertical lines
        if (j < gridCount) {
          const start = toIsometric(x, y, z);
          const nextZ = (j + 1) * gridSize;
          let nextDeformation = 0;
          
          if (trajectoryA.length > 0) {
            const shipA = trajectoryA[trajectoryA.length - 1];
            const distA = Math.sqrt((x - shipA[0] * 20) ** 2 + (nextZ - shipA[2] * 20) ** 2);
            nextDeformation += Math.max(0, 20 - distA * 0.3) * 0.5;
          }
          
          if (trajectoryB.length > 0) {
            const shipB = trajectoryB[trajectoryB.length - 1];
            const distB = Math.sqrt((x - shipB[0] * 20) ** 2 + (nextZ - shipB[2] * 20) ** 2);
            nextDeformation += Math.max(0, 40 - distB * 0.2) * 2;
          }
          
          const end = toIsometric(x, -nextDeformation, nextZ);
          
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        }
      }
    }

    // Draw trajectories in isometric view
    // Ship A trajectory (green) - straight line
    if (trajectoryA.length > 1) {
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      trajectoryA.forEach((point, index) => {
        const iso = toIsometric(point[0] * 20, point[1] * 5, point[2] * 20);
        if (index === 0) ctx.moveTo(iso.x, iso.y);
        else ctx.lineTo(iso.x, iso.y);
      });
      ctx.stroke();
    }

    // Ship B trajectory (red) - curved line  
    if (trajectoryB.length > 1) {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      trajectoryB.forEach((point, index) => {
        const iso = toIsometric(point[0] * 20, point[1] * 5, point[2] * 20);
        if (index === 0) ctx.moveTo(iso.x, iso.y);
        else ctx.lineTo(iso.x, iso.y);
      });
      ctx.stroke();
    }

    // Draw ships in isometric view
    let shipAPos, shipBPos;
    
    if (trajectoryA.length > 0) {
      shipAPos = trajectoryA[trajectoryA.length - 1];
    } else {
      // Show initial position when paused
      shipAPos = [0, 5, 0];
    }
    
    if (trajectoryB.length > 0) {
      shipBPos = trajectoryB[trajectoryB.length - 1];
    } else {
      // Show initial position when paused
      shipBPos = [0, 10, 0];
    }

    // Draw Ship A (Green) - elevated above the grid
    const isoA = toIsometric(shipAPos[0] * 20, shipAPos[1] * 5 + 20, shipAPos[2] * 20);
    
    // Ship A body (triangle pointing forward)
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(isoA.x, isoA.y - 12);
    ctx.lineTo(isoA.x - 10, isoA.y + 8);
    ctx.lineTo(isoA.x + 10, isoA.y + 8);
    ctx.closePath();
    ctx.fill();
    
    // Ship A label
    ctx.fillStyle = 'white';
    ctx.font = '14px monospace';
    ctx.fillText('A', isoA.x + 15, isoA.y - 5);
    
    // Draw Ship B (Red) - elevated above the grid 
    const isoB = toIsometric(shipBPos[0] * 20, shipBPos[1] * 5 + 20, shipBPos[2] * 20);
    
    // Ship B body (triangle pointing forward)
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(isoB.x, isoB.y - 12);
    ctx.lineTo(isoB.x - 10, isoB.y + 8);
    ctx.lineTo(isoB.x + 10, isoB.y + 8);
    ctx.closePath();
    ctx.fill();
    
    // Ship B label
    ctx.fillStyle = 'white';
    ctx.font = '14px monospace';
    ctx.fillText('B', isoB.x + 15, isoB.y - 5);
  };

  // Canvas drawing effect
  useEffect(() => {
    drawCanvas();
  }, [trajectoryA, trajectoryB]);

  // Initial canvas draw
  useEffect(() => {
    drawCanvas();
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning(prev => !prev);
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        resetSimulation();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setSimulationTime(0);
    setShipATime(0);
    setShipBTime(0);
    setTrajectoryA([]);
    setTrajectoryB([]);
    lastTimeRef.current = 0;
  };

  const physicsInfoA = getPhysicsInfo(velocityA);
  const physicsInfoB = getPhysicsInfo(velocityB);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000011', display: 'flex' }}>
      {/* Main simulation canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '1px solid #333',
            backgroundColor: '#000011'
          }}
        />
        
        {/* Title overlay */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          Relativistic Spaceship Paradox (2D View)
        </div>

        {/* WebGL Info */}
        <div style={{
          position: 'absolute',
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#888',
          fontSize: '12px',
          textAlign: 'center'
        }}>
          WebGL not available - using 2D canvas fallback
        </div>
      </div>

      {/* Control panel */}
      <div style={{ width: '350px', padding: '20px', overflowY: 'auto' }}>
        <Card className="w-full bg-gray-900 text-white border-gray-700 mb-4">
          <CardHeader>
            <CardTitle className="text-center text-lg">Simulation Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Simulation time */}
            <div className="text-center">
              <p className="text-sm text-gray-300 mb-1">Simulation Time</p>
              <p className="text-xl font-mono text-blue-400">{formatTime(simulationTime)}</p>
            </div>

            <Separator className="bg-gray-700" />

            {/* Control buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => setIsRunning(!isRunning)}
                variant={isRunning ? "destructive" : "default"}
                className="flex-1"
              >
                {isRunning ? "Pause" : "Play"}
              </Button>
              <Button
                onClick={resetSimulation}
                variant="outline"
                className="flex-1 border-gray-600 text-white hover:bg-gray-800"
              >
                Reset
              </Button>
            </div>

            <Separator className="bg-gray-700" />

            {/* Ship A controls */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-green-400">Ship A Velocity</label>
                <span className="text-sm text-gray-300">{physicsInfoA.velocityPercent}% c</span>
              </div>
              <Slider
                value={[velocityA]}
                onValueChange={(value) => setVelocityA(value[0])}
                max={0.95}
                min={0.1}
                step={0.01}
                className="w-full"
              />
              <div className="text-xs text-gray-400">
                γ = {physicsInfoA.gammaFormatted} | Time dilation = {physicsInfoA.timeDilationFormatted}
              </div>
            </div>

            {/* Ship B controls */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-red-400">Ship B Velocity</label>
                <span className="text-sm text-gray-300">{physicsInfoB.velocityPercent}% c</span>
              </div>
              <Slider
                value={[velocityB]}
                onValueChange={(value) => setVelocityB(value[0])}
                max={0.95}
                min={0.1}
                step={0.01}
                className="w-full"
              />
              <div className="text-xs text-gray-400">
                γ = {physicsInfoB.gammaFormatted} | Time dilation = {physicsInfoB.timeDilationFormatted}
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Chronometers */}
            <div className="space-y-3">
              <div className="bg-gray-800 p-3 rounded border border-green-600">
                <div className="text-green-400 text-sm font-medium mb-1">Ship A Proper Time</div>
                <div className="text-xl font-mono text-green-300">{formatTime(shipATime)}</div>
                <div className="text-xs text-gray-400">Straight spacetime path</div>
              </div>
              
              <div className="bg-gray-800 p-3 rounded border border-red-600">
                <div className="text-red-400 text-sm font-medium mb-1">Ship B Proper Time</div>
                <div className="text-xl font-mono text-red-300">{formatTime(shipBTime)}</div>
                <div className="text-xs text-gray-400">Curved spacetime path</div>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Physics info */}
            <div className="text-xs text-gray-400 space-y-1">
              <p>• Green ship: Straight spacetime trajectory</p>
              <p>• Red ship: Curved spacetime trajectory</p>
              <p>• Time dilation: t' = t/γ</p>
              <p>• γ = 1/√(1 - v²/c²)</p>
            </div>

            {/* Keyboard shortcuts */}
            <div className="text-xs text-gray-500">
              <p>Shortcuts: SPACE = Pause/Play, R = Reset</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}