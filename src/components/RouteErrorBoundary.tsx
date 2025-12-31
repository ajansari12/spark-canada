import React, { Component, ErrorInfo, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, ArrowLeft, MessageCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  routeName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`Route error in ${this.props.routeName || "unknown"}:`, error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="w-14 h-14 rounded-xl bg-warning/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-warning" />
              </div>
              <CardTitle>Page Error</CardTitle>
              <CardDescription>
                This page encountered an issue. You can try again or navigate elsewhere.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={this.handleRetry} className="w-full gap-2">
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" asChild className="gap-2">
                  <Link to="/app/dashboard">
                    <ArrowLeft className="w-4 h-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" asChild className="gap-2">
                  <Link to="/">
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                </Button>
              </div>
              <div className="pt-2 text-center">
                <a
                  href="https://github.com/anthropics/claude-code/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  Report this issue
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
