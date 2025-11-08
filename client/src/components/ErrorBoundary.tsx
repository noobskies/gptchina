import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ProductionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log detailed error information
    console.error('🔴 ERROR BOUNDARY CAUGHT:', {
      error: error.toString(),
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    // Check if it's the MenuButton invariant error
    if (error.message?.includes('Invariant failed')) {
      console.error('🔴 MENUBUTTON INVARIANT ERROR DETECTED!');
      console.error('Component Stack:', errorInfo.componentStack);

      // Try to extract component name from stack
      const stackLines = errorInfo.componentStack?.split('\n') || [];
      const componentLine = stackLines.find((line) => line.trim().startsWith('at '));
      if (componentLine) {
        console.error('🎯 Failed Component:', componentLine.trim());
      }
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left', marginTop: '20px' }}>
            <summary>Error Details (check console for more)</summary>
            <p>{this.state.error?.toString()}</p>
            <p>{this.state.errorInfo?.componentStack}</p>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ProductionErrorBoundary;
