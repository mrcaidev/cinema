import { Button } from "@/components/ui/button";
import { getMeSession } from "@/utils/session";
import { ChevronLeftIcon } from "lucide-react";
import { Link, Outlet, redirect } from "react-router";
import type { Route } from "./+types/route";
import bg from "./bg.webp";

export async function loader({ request }: Route.LoaderArgs) {
  const meSession = await getMeSession(request.headers.get("Cookie"));

  const isLoggedIn = meSession.has("id");

  if (isLoggedIn) {
    return redirect("/");
  }

  return;
}

export default function AuthLayout() {
  return (
    <main className="grid lg:grid-cols-2 relative min-h-screen">
      <Button
        variant="ghost"
        asChild
        className="absolute left-8 sm:left-20 top-20"
      >
        <Link to="/">
          <ChevronLeftIcon />
          Home
        </Link>
      </Button>
      <div className="place-self-center">
        <Outlet />
      </div>
      <div className="hidden lg:block relative h-screen">
        <img
          src={bg}
          alt="White film strip"
          sizes="(max-width: 1024px) 0, 50vw"
          className="size-full object-cover"
        />
        <span className="absolute right-2 bottom-2 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">
          From&nbsp;
          <a
            href="https://unsplash.com/photos/white-film-strip-dWYjy9zIiF8"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            Unsplash
          </a>
          &nbsp;by&nbsp;
          <a
            href="https://unsplash.com/@anikamikkelson"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            Anika De Klerk
          </a>
        </span>
      </div>
    </main>
  );
}
