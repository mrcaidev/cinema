import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";

export function ThemeToggle() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          className="[&_svg]:size-5"
        >
          <SunIcon className="inline dark:hidden" />
          <MoonIcon className="hidden dark:inline" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={setLight} className="cursor-pointer">
          <SunIcon />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={setDark} className="cursor-pointer">
          <MoonIcon />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={setSystem} className="cursor-pointer">
          <LaptopIcon />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function setLight() {
  localStorage.setItem("theme", "light");

  document.documentElement.classList.remove("dark");

  suspendTransitions();
}

function setDark() {
  localStorage.setItem("theme", "dark");

  document.documentElement.classList.add("dark");

  suspendTransitions();
}

function setSystem() {
  localStorage.removeItem("theme");

  if (matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  suspendTransitions();
}

function suspendTransitions() {
  document.documentElement.classList.add("disable-transition");

  setTimeout(() => {
    document.documentElement.classList.remove("disable-transition");
  }, 1);
}
