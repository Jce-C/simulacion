import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { KeyboardControls, Html } from "@react-three/drei";
import "@fontsource/inter";
import SpaceshipSimulation from "./components/SpaceshipSimulation";
import ControlPanel from "./components/ControlPanel";
import ErrorBoundary from "./components/ErrorBoundary";
import FallbackSimulation from "./components/FallbackSimulation";
import { isWebGLSupported } from "./utils/webglDetection";
import { useSimulation } from "./hooks/useSimulation";

const controls = [
  { name: "pause", keys: ["Space"] },
  { name: "reset", keys: ["KeyR"] },
];

function App() {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
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
    <div style={{ width: '100vw', height: '100vh', display: 'flex', backgroundColor: '#000' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <ErrorBoundary>
          <KeyboardControls map={controls}>
            <Canvas
              orthographic
              camera={{
                position: [40, 40, 40],
                zoom: 80, // <-- 1. HEMOS AUMENTADO EL ZOOM PARA ALEJAR LA VISTA
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
              
              {/* --- 2. AÑADIMOS UN CUBO ROJO DE PRUEBA --- */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color="red" />
              </mesh>
              
              <Suspense fallback={<Html center>Cargando...</Html>}>
                <SpaceshipSimulation {...simulation} />
              </Suspense>
            </Canvas>
          </KeyboardControls>
        </ErrorBoundary>
      </div>
      
      <div style={{ width: '320px', padding: '1rem', background: '#111827', color: 'white', overflowY: 'auto' }}>
        <ControlPanel {...simulation} />
      </div>
    </div>
  );
}

export default App;
