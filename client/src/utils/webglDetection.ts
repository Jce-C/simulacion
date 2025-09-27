/**
 * Utility functions to detect WebGL support
 */

export function isWebGLSupported(): boolean {
  try {
    // Create a temporary canvas element
    const canvas = document.createElement('canvas');
    
    // Try to get WebGL context
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return false;
    }

    // Additional check for essential WebGL features
    return typeof (gl as WebGLRenderingContext).getExtension === 'function';
  } catch (error) {
    console.warn('WebGL detection failed:', error);
    return false;
  }
}

export function getWebGLErrorInfo(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return 'WebGL context could not be created. This may be due to browser settings, hardware limitations, or driver issues.';
    }
    
    return 'WebGL is supported but failed to initialize properly.';
  } catch (error) {
    return `WebGL detection error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}