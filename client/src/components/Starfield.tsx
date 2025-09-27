import { useMemo } from "react";
import * as THREE from "three";

export default function Starfield() {
  // Pre-calculate star positions to avoid Math.random() in render
  const starData = useMemo(() => {
    const stars = [];
    const starCount = 1000;
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        z: (Math.random() - 0.5) * 200,
        size: Math.random() * 2 + 0.5
      });
    }
    
    return stars;
  }, []);

  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];
    
    starData.forEach(star => {
      positions.push(star.x, star.y, star.z);
      
      // Vary star colors (white to blue-white)
      const colorIntensity = 0.8 + Math.random() * 0.2;
      colors.push(colorIntensity, colorIntensity, 1.0);
      
      sizes.push(star.size);
    });
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    return geometry;
  }, [starData]);

  return (
    <points geometry={starsGeometry}>
      <pointsMaterial
        size={1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={false}
      />
    </points>
  );
}
