import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import useErrorHandler from "@/hooks/useErrorHandler";

export function withErrorHandling<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  return function WithErrorHandling(props: P) {
    const { error, isLoading, handleError, clearError, setLoading } =
      useErrorHandler();

    if (isLoading) {
      return <div>Loading...</div>; // You might want to replace this with a proper loading component
    }

    if (error.hasError) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || "An unknown error occurred"}
            <Button onClick={clearError} variant="outline" className="mt-2">
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <WrappedComponent
        {...props}
        handleError={handleError}
        setLoading={setLoading}
      />
    );
  };
}
