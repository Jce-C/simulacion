import { Text } from "@react-three/drei";
import Spaceship from "./Spaceship";
import SpacetimeGrid from "./SpacetimeGrid";
import Starfield from "./Starfield";
import TrajectoryTrail from "./TrajectoryTrail";

// El componente ahora recibe todas las propiedades de la simulación
export default function SpaceshipSimulation({
  shipATime,
  shipBTime,
  velocityA,
  velocityB,
  shipAPosition,
  shipBPosition,
  trajectoryA,
  trajectoryB,
}: any) {
  
  return (
    <>
      {/* SE HAN ELIMINADO LOS OrbitControls */}

      {/* Background elements */}
      <Starfield />
      {/* La malla ahora es estática y no depende de la posición de la nave */}
      <SpacetimeGrid />

      {/* Title */}
      <Text
        position={[0, 15, 0]}
        fontSize={2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Relativistic Spaceship Paradox
      </Text>

      {/* Spaceships */}
      <Spaceship
        position={shipAPosition}
        color="#ff0000" // El color rojo ahora es para la Nave A (curva)
        label="A"
        properTime={shipATime}
        velocity={velocityA}
      />
      
      <Spaceship
        position={shipBPosition}
        color="#0077ff" // El color azul ahora es para la Nave B (recta)
        label="B"
        properTime={shipBTime}
        velocity={velocityB}
      />

      {/* Trajectory trails */}
      <TrajectoryTrail
        points={trajectoryA}
        color="#ff0000"
        opacity={0.6}
      />
      
      <TrajectoryTrail
        points={trajectoryB}
        color="#0077ff"
        opacity={0.6}
      />
      
      {/* SE HA MOVIDO el ControlPanel a App.tsx */}

      {/* Coordinate axes */}
      <axesHelper args={[10]} />
    </>
  );
}
