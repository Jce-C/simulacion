import { useMemo } from "react";
import * as THREE from "three";
import { calculateSpacetimeCurvature } from "../utils/relativisticPhysics";

interface SpacetimeGridProps {
  shipBPosition?: [number, number, number];
  gravitationalMass?: number;
}

export default function SpacetimeGrid({ 
  shipBPosition = [0, 10, 0], 
  gravitationalMass = 15 
}: SpacetimeGridProps) {
  // Create spacetime grid geometry with deformation
  const gridGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    
    const size = 60;
    const divisions = 40;
    const step = size / divisions;
    const halfSize = size / 2;
    
    // Create grid lines with gravitational deformation
    for (let i = 0; i <= divisions; i++) {
      const pos = -halfSize + (i * step);
      
      // Horizontal lines with curvature
      for (let j = 0; j < divisions; j++) {
        const x1 = -halfSize + (j * step);
        const x2 = -halfSize + ((j + 1) * step);
        
        // Calculate curvature for both ends of the line
        const curvature1 = calculateSpacetimeCurvature([x1, 0, pos], shipBPosition, gravitationalMass);
        const curvature2 = calculateSpacetimeCurvature([x2, 0, pos], shipBPosition, gravitationalMass);
        
        // Deform the Y position based on curvature
        const y1 = -curvature1 * 8;
        const y2 = -curvature2 * 8;
        
        vertices.push(x1, y1, pos, x2, y2, pos);
        
        // Color intensity based on curvature
        const intensity1 = Math.min(1, curvature1 * 5);
        const intensity2 = Math.min(1, curvature2 * 5);
        colors.push(0.3 + intensity1 * 0.7, 0.3 + intensity1 * 0.7, 1.0);
        colors.push(0.3 + intensity2 * 0.7, 0.3 + intensity2 * 0.7, 1.0);
      }
      
      // Vertical lines with curvature
      for (let j = 0; j < divisions; j++) {
        const z1 = -halfSize + (j * step);
        const z2 = -halfSize + ((j + 1) * step);
        
        // Calculate curvature for both ends of the line
        const curvature1 = calculateSpacetimeCurvature([pos, 0, z1], shipBPosition, gravitationalMass);
        const curvature2 = calculateSpacetimeCurvature([pos, 0, z2], shipBPosition, gravitationalMass);
        
        // Deform the Y position based on curvature
        const y1 = -curvature1 * 8;
        const y2 = -curvature2 * 8;
        
        vertices.push(pos, y1, z1, pos, y2, z2);
        
        // Color intensity based on curvature
        const intensity1 = Math.min(1, curvature1 * 5);
        const intensity2 = Math.min(1, curvature2 * 5);
        colors.push(0.3 + intensity1 * 0.7, 0.3 + intensity1 * 0.7, 1.0);
        colors.push(0.3 + intensity2 * 0.7, 0.3 + intensity2 * 0.7, 1.0);
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    return geometry;
  }, [shipBPosition, gravitationalMass]);

  // Create dynamic curved spacetime deformation based on Ship B's gravitational effects
  const curvedGrid = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const colors: number[] = [];
    
    // Create a grid around Ship B showing gravitational curvature
    const gridResolution = 30;
    const gridSize = 40;
    
    for (let i = 0; i < gridResolution; i++) {
      for (let j = 0; j < gridResolution; j++) {
        const x = (i / (gridResolution - 1) - 0.5) * gridSize;
        const z = (j / (gridResolution - 1) - 0.5) * gridSize;
        
        // Calculate gravitational curvature at this point
        const curvature = calculateSpacetimeCurvature([x, 0, z], shipBPosition, gravitationalMass);
        
        // Create curved surface: higher curvature = more deformation
        const y = -curvature * 20; // Negative for "gravity well" effect
        
        vertices.push(x, y + shipBPosition[1], z);
        
        // Color intensity based on curvature strength
        const intensity = Math.min(1, curvature * 10);
        colors.push(0.8 + intensity * 0.2, 0.4 - intensity * 0.2, 0.8 + intensity * 0.2);
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    return geometry;
  }, [shipBPosition, gravitationalMass]);

  return (
    <>
      {/* Flat spacetime grid */}
      <lineSegments geometry={gridGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.4} />
      </lineSegments>
      
      {/* Curved spacetime visualization */}
      <points geometry={curvedGrid}>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation={true}
        />
      </points>
    </>
  );
}
