import "@fontsource-variable/nunito";
import type { PropsWithChildren } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Toaster } from "./components/ui/toaster";
import "./global.css";

export function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta
          name="description"
          content="Watch videos together with your family and friends, share one playlist and chat in real time."
        />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe.
          dangerouslySetInnerHTML={{
            __html: `
              const storedTheme = localStorage.getItem("theme");
              const isDarkSystem = matchMedia("(prefers-color-scheme: dark)").matches;
              if (storedTheme === "dark" || (!storedTheme && isDarkSystem)) {
                document.documentElement.classList.add("dark");
              }
            `,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body className="bg-background text-foreground font-sans antialiased scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted">
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

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
