import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { KeyboardControls, Html } from "@react-three/drei"; // <-- 1. IMPORTA Html
import "@fontsource/inter";
import SpaceshipSimulation from "./components/SpaceshipSimulation";
import ErrorBoundary from "./components/ErrorBoundary";
import FallbackSimulation from "./components/FallbackSimulation";
import { isWebGLSupported } from "./utils/webglDetection";

// Define control keys for the simulation
const controls = [
  { name: "pause", keys: ["Space"] },
  { name: "reset", keys: ["KeyR"] },
];

function App() {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // Check WebGL support when component mounts
    const supported = isWebGLSupported();
    setWebGLSupported(supported);
    console.log('WebGL support detected:', supported);
  }, []);

  // Show loading while checking WebGL support
  if (webGLSupported === null) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000011',
        color: 'white'
      }}>
        <div>Initializing Relativistic Spaceship Simulation...</div>
      </div>
    );
  }

  // Use fallback if WebGL is not supported
  if (!webGLSupported) {
    console.log('Using 2D fallback simulation');
    return <FallbackSimulation />;
  }

  console.log('Using 3D WebGL simulation');

  // Render 3D version if WebGL is supported
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}>
      <ErrorBoundary>
        <KeyboardControls map={controls}>
          <Canvas
            camera={{
              position: [30, 25, 30],
              fov: 60,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              alpha: false,
              depth: true,
              stencil: false,
              preserveDrawingBuffer: false,
              failIfMajorPerformanceCaveat: false
            }}
            onCreated={({ gl }) => {
              gl.setClearColor('#000011');
            }}
            fallback={<FallbackSimulation />}
          >
            <color attach="background" args={["#000011"]} />
            
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight
              position={[10, 10, 10]}
              intensity={1}
              castShadow
            />
            <pointLight position={[0, 10, 0]} intensity={0.5} />

            {/* --- 2. MODIFICA ESTA LÍNEA --- */}
            <Suspense fallback={<Html center>Cargando simulación...</Html>}>
              <SpaceshipSimulation />
            </Suspense>
          </Canvas>
        </KeyboardControls>
      </ErrorBoundary>
    </div>
  );
}

export default App;
