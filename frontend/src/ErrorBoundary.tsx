import React, { PropsWithChildren } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<PropsWithChildren, ErrorBoundaryState> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console or external service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    // Optionally send to external logging service
    // fetch('/api/log', { method: 'POST', body: JSON.stringify({ error, errorInfo }) });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: "red", padding: "2em" }}>
          <h2>Something went wrong.</h2>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
