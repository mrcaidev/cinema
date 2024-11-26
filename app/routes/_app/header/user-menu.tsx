import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { LifeBuoyIcon, LogInIcon, SettingsIcon } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import type { loader } from "../route";
import { LogOutButton } from "./log-out-button";

export function UserMenu() {
  const me = useLoaderData<typeof loader>();

  if (!me) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Log in"
        asChild
        className="[&_svg]:size-5"
      >
        <Link to="/login">
          <LogInIcon />
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={me} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <div className="space-y-0.5 px-2 py-1">
          <p className="font-medium">{me.nickname ?? "User"}</p>
          <p className="text-sm text-muted-foreground">{me.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/settings">
            <SettingsIcon />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/support">
            <LifeBuoyIcon />
            Support
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <LogOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
