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
        <Avatar>
          <AvatarImage src={me.avatarUrl ?? undefined} alt="" />
          <AvatarFallback className="uppercase">
            {me.nickname?.[0] ?? me.email[0]}
          </AvatarFallback>
        </Avatar>
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
