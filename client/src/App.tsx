import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { KeyboardControls, Html } from "@react-three/drei";
import "@fontsource/inter";
import SpaceshipSimulation from "./components/SpaceshipSimulation";
import ControlPanel from "./components/ControlPanel"; // <-- 1. IMPORTA el panel aquí
import ErrorBoundary from "./components/ErrorBoundary";
import FallbackSimulation from "./components/FallbackSimulation";
import { isWebGLSupported } from "./utils/webglDetection";
import { useSimulation } from "./hooks/useSimulation"; // <-- 2. IMPORTA el hook de simulación

// Define control keys for the simulation
const controls = [
  { name: "pause", keys: ["Space"] },
  { name: "reset", keys: ["KeyR"] },
];

function App() {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  
  // <-- 3. MUEVE la lógica de la simulación aquí para pasarla a los componentes
  const simulation = useSimulation();

  useEffect(() => {
    const supported = isWebGLSupported();
    setWebGLSupported(supported);
    console.log('WebGL support detected:', supported);
  }, []);

  if (webGLSupported === null) {
    return <div>Initializing...</div>;
  }

  if (!webGLSupported) {
    return <FallbackSimulation />;
  }

  return (
    // <-- 4. MODIFICA la estructura para tener el panel y el canvas por separado
    <div style={{ width: '100vw', height: '100vh', display: 'flex', backgroundColor: '#000' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <ErrorBoundary>
          <KeyboardControls map={controls}>
            <Canvas
              orthographic // <-- 5. AÑADE para cámara isométrica
              camera={{
                position: [40, 40, 40], // Posición fija para la vista
                zoom: 15, // Ajusta el acercamiento
                near: 0.1,
                far: 1000,
              }}
              onCreated={({ gl }) => {
                gl.setClearColor('#000011');
              }}
              fallback={<FallbackSimulation />}
            >
              <color attach="background" args={["#000011"]} />
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} />
              
              <Suspense fallback={<Html center>Cargando...</Html>}>
                <SpaceshipSimulation {...simulation} />
              </Suspense>
            </Canvas>
          </KeyboardControls>
        </ErrorBoundary>
      </div>
      
      {/* 6. RENDERIZA el panel de control fuera del canvas */}
      <div style={{ width: '320px', padding: '1rem', background: '#111827', color: 'white', overflowY: 'auto' }}>
        <ControlPanel {...simulation} />
      </div>
    </div>
  );
}

export default App;
