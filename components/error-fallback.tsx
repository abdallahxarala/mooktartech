"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div
      className="min-h-[400px] flex items-center justify-center p-8 animate-fade-in-up"
    >
      <div className="text-center max-w-md animate-fade-in-up">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4 animate-fade-in-up" />
        <h2 className="text-2xl font-bold mb-2 animate-fade-in-up">Une erreur est survenue</h2>
        <Alert variant="destructive" className="mb-4 animate-fade-in-up">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
        <Button
          onClick={resetErrorBoundary}
          className="bg-primary-orange hover:bg-primary-orange/90 animate-fade-in-up"
        >
          <RefreshCw className="h-4 w-4 mr-2 animate-fade-in-up" />
          Réessayer
        </Button>
      </div>
    </div>
  );
}
