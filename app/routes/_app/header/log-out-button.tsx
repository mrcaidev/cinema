import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { action } from "@/routes/_auth.logout/route";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import { useFetcher } from "react-router";

export function LogOutButton() {
  const { submit, state } = useFetcher<typeof action>();

  return (
    <DropdownMenuItem asChild className="cursor-pointer">
      <button
        type="button"
        disabled={state === "submitting"}
        onClick={() => submit(null, { method: "POST", action: "/logout" })}
        className="w-full"
      >
        {state === "submitting" ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <LogOutIcon />
        )}
        Log out
      </button>
    </DropdownMenuItem>
  );
}
