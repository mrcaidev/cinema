import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LifeBuoyIcon, LogInIcon, SettingsIcon } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import type { loader } from "../loader";
import { LogOutButton } from "./log-out-button";

export function UserMenu() {
  const user = useLoaderData<typeof loader>();

  if (!user) {
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
        <Avatar>
          <AvatarImage src={user.avatarUrl ?? undefined} alt="" />
          <AvatarFallback className="uppercase">
            {user.nickname?.[0] ?? user.email[0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <div className="space-y-0.5 px-2 py-1">
          <p className="font-medium">{user.nickname ?? "User"}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/settings">
            <SettingsIcon />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <a href="/support" target="_blank" rel="noreferrer">
            <LifeBuoyIcon />
            Support
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
