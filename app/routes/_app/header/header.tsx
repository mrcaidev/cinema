import { useLoaderData } from "react-router";
import type { loader } from "../loader";
import { AuthLinks } from "./auth-links";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function Header() {
  const user = useLoaderData<typeof loader>();

  return (
    <header className="fixed inset-x-0 top-0 z-10 flex items-center gap-3 px-8 py-4 bg-background">
      <Logo />
      <div className="grow" />
      <ThemeToggle />
      {user ? <UserMenu user={user} /> : <AuthLinks />}
    </header>
  );
}
