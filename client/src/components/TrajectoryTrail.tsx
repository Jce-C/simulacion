import { useMemo } from "react";
import * as THREE from "three";

interface TrajectoryTrailProps {
  points: Array<[number, number, number]>;
  color: string;
  opacity?: number;
}

export default function TrajectoryTrail({ points, color, opacity = 0.8 }: TrajectoryTrailProps) {
  const lineGeometry = useMemo(() => {
    if (points.length < 2) return null;
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 3);
    
    points.forEach((point, index) => {
      positions[index * 3] = point[0];
      positions[index * 3 + 1] = point[1];
      positions[index * 3 + 2] = point[2];
    });
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [points]);

  if (!lineGeometry || points.length < 2) {
    return null;
  }

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        linewidth={2}
      />
    </lineSegments>
  );
}
