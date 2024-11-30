import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/cn";
import { Input } from "@/app/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import {
  CopyCheckIcon,
  CopyIcon,
  CopyXIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import type { loader } from "../route";

export function InviteButton() {
  const { room } = useLoaderData<typeof loader>();

  const [invitationLink, setInvitationLink] = useState("");
  useEffect(() => {
    setInvitationLink(
      `${window.location.origin}/room/${room.slug}/join${room.password ? `?pwd=${room.password}` : ""}`,
    );
  }, [room.slug, room.password]);

  const [copyState, setCopyState] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [shouldShowSuccessToast, setShouldShowSuccessToast] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);

      setCopyState("success");

      setShouldShowSuccessToast(true);
      setTimeout(() => setShouldShowSuccessToast(false), 2000);
    } catch {
      setCopyState("error");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="w-10 sm:w-auto">
          <UserRoundPlusIcon />
          <span className="sr-only sm:not-sr-only">Invite</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-2">
        <p className="font-medium">Invite your friends here 🤝</p>
        <div className="flex items-center">
          <Input
            defaultValue={invitationLink}
            readOnly
            className="rounded-r-none text-sm focus-visible:ring-transparent"
          />
          <div className="shrink-0 relative">
            <Button
              variant="outline"
              size="icon"
              onClick={copy}
              className={cn(
                "rounded-l-none",
                copyState === "error" && "text-destructive-foreground",
              )}
            >
              {copyState === "success" ? (
                <CopyCheckIcon />
              ) : copyState === "error" ? (
                <CopyXIcon />
              ) : (
                <CopyIcon />
              )}
            </Button>
            {shouldShowSuccessToast && (
              <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 rounded bg-muted text-sm">
                Copied!
              </div>
            )}
          </div>
        </div>
        <p className="text-muted-foreground text-xs leading-tight">
          Share the link above with your friends. They can directly paste it
          into their browser&apos;s address bar, or click the "Join room" button
          on this app's homepage.
        </p>
      </PopoverContent>
    </Popover>
  );
}
