// import React from "react";
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import useErrorHandler from "@/hooks/useErrorHandler";

// export function withErrorHandling<P extends object>(
//   WrappedComponent: React.ComponentType<P>
// ): React.FC<P> {
//   return function WithErrorHandling(props: P) {
//     const { error, isLoading, handleError, clearError, setLoading } =
//       useErrorHandler();

//     if (isLoading) {
//       return <div>Loading...</div>; // You might want to replace this with a proper loading component
//     }

//     if (error.hasError) {
//       return (
//         <Alert variant="destructive">
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>
//             {error.message || "An unknown error occurred"}
//             <Button onClick={clearError} variant="outline" className="mt-2">
//               Dismiss
//             </Button>
//           </AlertDescription>
//         </Alert>
//       );
//     }

//     return (
//       <WrappedComponent
//         {...props}
//         handleError={handleError}
//         setLoading={setLoading}
//       />
//     );
//   };
// }

import React, { useState, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import ErrorBoundary from "./TelegramError";

export function withErrorHandling<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithErrorHandlingWrapper(props: P) {
    const [error, setError] = useState<Error | null>(null);

    const handleError = useCallback((error: Error) => {
      console.error("Error caught by error handler:", error);
      setError(error);
    }, []);

    const handleRetry = useCallback(() => {
      setError(null);
    }, []);

    if (error) {
      return (
        <div className="p-4 max-w-xl mx-auto">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle className="mb-2">Runtime Error</AlertTitle>
            <AlertDescription className="space-y-4">
              <p>An error occurred while running the application:</p>
              <p className="text-sm font-mono bg-destructive/10 p-2 rounded">
                {error.message}
              </p>
              <Button
                onClick={handleRetry}
                variant="outline"
                className="w-full mt-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      <ErrorBoundary>
        <WrappedComponent {...props} onError={handleError} />
      </ErrorBoundary>
    );
  };
}
