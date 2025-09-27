/**
 * Relativistic physics calculations for time dilation
 */

// Speed of light (normalized to 1)
export const SPEED_OF_LIGHT = 1;

/**
 * Calculate Lorentz factor (gamma)
 * γ = 1 / √(1 - v²/c²)
 */
export function calculateLorentzFactor(velocity: number): number {
  const v_over_c = Math.abs(velocity) / SPEED_OF_LIGHT;
  
  // Prevent division by zero at light speed
  if (v_over_c >= 1) {
    return 1000; // Very large factor for near-light-speed
  }
  
  return 1 / Math.sqrt(1 - v_over_c * v_over_c);
}

/**
 * Calculate proper time from coordinate time
 * t' = t / γ
 */
export function calculateProperTime(coordinateTime: number, velocity: number): number {
  const gamma = calculateLorentzFactor(velocity);
  return coordinateTime / gamma;
}

/**
 * Calculate time dilation factor
 */
export function calculateTimeDilation(velocity: number): number {
  return 1 / calculateLorentzFactor(velocity);
}

/**
 * Calculate relativistic position for straight line motion
 */
export function calculateStraightTrajectory(
  time: number,
  velocity: number,
  startPosition: [number, number, number] = [0, 0, 0]
): [number, number, number] {
  return [
    startPosition[0] + velocity * time * 10, // Scale for visibility
    startPosition[1],
    startPosition[2]
  ];
}

/**
 * Calculate curved trajectory representing spacetime curvature
 */
export function calculateCurvedTrajectory(
  time: number,
  velocity: number,
  startPosition: [number, number, number] = [0, 0, 0]
): [number, number, number] {
  const t = time * 0.5; // Slow down for better visualization
  const radius = 15;
  
  return [
    startPosition[0] + Math.cos(t * velocity) * radius,
    startPosition[1] + Math.sin(t * velocity * 0.2) * 3, // Vertical oscillation
    startPosition[2] + Math.sin(t * velocity) * radius
  ];
}

/**
 * Calculate gravitational potential based on distance from mass
 * Simplified model: φ = -GM/r
 */
export function calculateGravitationalPotential(
  position: [number, number, number],
  massPosition: [number, number, number] = [0, 0, 0],
  mass: number = 10
): number {
  const dx = position[0] - massPosition[0];
  const dy = position[1] - massPosition[1];
  const dz = position[2] - massPosition[2];
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  // Avoid division by zero and extreme values
  const minDistance = 1;
  const safeDistance = Math.max(distance, minDistance);
  
  // Simplified gravitational potential (normalized for visualization)
  return -mass / safeDistance * 0.01; // Scale factor for reasonable effects
}

/**
 * Calculate gravitational time dilation
 * t_proper = t_coordinate * sqrt(1 + 2φ/c²)
 * For weak fields: t_proper ≈ t_coordinate * (1 + φ/c²)
 */
export function calculateGravitationalTimeDilation(
  coordinateTime: number,
  gravitationalPotential: number
): number {
  // Use weak field approximation for stability
  const c_squared = SPEED_OF_LIGHT * SPEED_OF_LIGHT;
  const factor = 1 + gravitationalPotential / c_squared;
  
  // Ensure factor is positive and reasonable
  const safeFactor = Math.max(0.1, Math.min(2.0, factor));
  return coordinateTime * safeFactor;
}

/**
 * Calculate combined relativistic effects (both special and general relativity)
 */
export function calculateCombinedRelativisticTime(
  coordinateTime: number,
  velocity: number,
  position: [number, number, number],
  massPosition: [number, number, number] = [0, 0, 0],
  mass: number = 10
): number {
  // Special relativity time dilation
  const specialRelativisticTime = calculateProperTime(coordinateTime, velocity);
  
  // Gravitational potential and time dilation
  const potential = calculateGravitationalPotential(position, massPosition, mass);
  const gravitationalFactor = 1 + potential / (SPEED_OF_LIGHT * SPEED_OF_LIGHT);
  
  // Combine both effects
  return specialRelativisticTime * Math.max(0.1, gravitationalFactor);
}

/**
 * Calculate spacetime curvature magnitude for visualization
 */
export function calculateSpacetimeCurvature(
  position: [number, number, number],
  massPosition: [number, number, number] = [0, 0, 0],
  mass: number = 10
): number {
  const dx = position[0] - massPosition[0];
  const dy = position[1] - massPosition[1];
  const dz = position[2] - massPosition[2];
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  // Avoid division by zero
  const minDistance = 1;
  const safeDistance = Math.max(distance, minDistance);
  
  // Curvature magnitude decreases with distance squared
  return mass / (safeDistance * safeDistance) * 0.1; // Scale for visualization
}

/**
 * Get physics information for display
 */
export function getPhysicsInfo(velocity: number) {
  const gamma = calculateLorentzFactor(velocity);
  const timeDilation = calculateTimeDilation(velocity);
  
  return {
    gamma: gamma,
    timeDilation: timeDilation,
    velocityPercent: (velocity * 100).toFixed(1),
    gammaFormatted: gamma.toFixed(3),
    timeDilationFormatted: timeDilation.toFixed(6)
  };
}
