import { isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/root";

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const details = getDetails(error);
  const stack = getStack(error);

  return (
    <main className="grid place-items-center min-h-screen">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium">Oops!</h1>
        <p className="text-muted-foreground">{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}

function getDetails(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`;
  }

  if (import.meta.env.DEV && error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

function getStack(error: unknown) {
  if (import.meta.env.DEV && error instanceof Error) {
    return error.stack;
  }

  return undefined;
}
