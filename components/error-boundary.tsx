"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { logError } from "@/lib/utils/error-logger";

interface Props {
  children: ReactNode;
  componentName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error) {
    logError(error, this.props.componentName);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Une erreur est survenue</h2>
            <p className="text-gray-600 mb-4">
              Nous nous excusons pour la gêne occasionnée
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-primary-orange hover:bg-primary-orange/90"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recharger la page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
