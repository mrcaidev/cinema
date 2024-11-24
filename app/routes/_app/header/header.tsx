import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-10 flex items-center px-8 py-4 bg-background">
      <Logo />
      <div className="grow" />
      <ThemeToggle />
    </header>
  );
}
