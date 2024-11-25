import type { PropsWithChildren } from "react";
import { Links, Meta, Scripts, ScrollRestoration } from "react-router";
import { Toaster } from "./components/ui/toaster";

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
