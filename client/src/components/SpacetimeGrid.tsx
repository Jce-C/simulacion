import { useMemo } from "react";
import * as THREE from "three";
import { calculateSpacetimeCurvature } from "../utils/relativisticPhysics";

// El componente ya no necesita propiedades
export default function SpacetimeGrid() {

  const gridGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    const size = 60;
    const divisions = 40;
    const step = size / divisions;
    const halfSize = size / 2;
    
    // Define una masa gravitacional estática en el centro
    const staticMassPosition: [number, number, number] = [0, 0, 0];
    const gravitationalMass = 250; // Aumentamos la masa para un efecto más fuerte

    // Crea las líneas de la malla con deformación
    for (let i = 0; i <= divisions; i++) {
      for (let j = 0; j <= divisions; j++) {
        const x = -halfSize + i * step;
        const z = -halfSize + j * step;
        
        // Calcula la curvatura en este punto
        const curvature = calculateSpacetimeCurvature([x, 0, z], staticMassPosition, gravitationalMass);
        
        // Deforma la posición Y para crear el efecto "hundido"
        const y = -curvature * 20; // Aumentamos el multiplicador para más profundidad
        
        if (i < divisions) vertices.push(x, y, z, -halfSize + (i + 1) * step, y, z);
        if (j < divisions) vertices.push(x, y, z, x, y, -halfSize + (j + 1) * step);
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    return geometry;
  }, []);

  return (
    <>
      <lineSegments geometry={gridGeometry}>
        <lineBasicMaterial color={"#444444"} transparent opacity={0.5} />
      </lineSegments>
    </>
  );
}
