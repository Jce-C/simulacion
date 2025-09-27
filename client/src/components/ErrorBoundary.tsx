import React, { Component, ErrorInfo, ReactNode } from 'react';
import FallbackSimulation from './FallbackSimulation';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WebGL/Three.js Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Fall back to 2D simulation if 3D fails
      return <FallbackSimulation />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;