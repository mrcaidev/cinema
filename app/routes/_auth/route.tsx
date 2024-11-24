import { Outlet } from "react-router";
import bg from "./bg.webp";
import { loader } from "./loader";
import { meta } from "./meta";

export default function Layout() {
  return (
    <main className="grid lg:grid-cols-2 min-h-screen">
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

export { loader, meta };