import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import { useFetcher } from "react-router";

export function LogOutButton() {
  const { submit, state } = useFetcher();

  const handleClick = async () => {
    await submit(null, { method: "POST", action: "/logout" });
  };

  return (
    <DropdownMenuItem asChild className="cursor-pointer">
      <button
        type="button"
        disabled={state === "submitting"}
        onClick={handleClick}
        className="w-full"
      >
        {state === "submitting" ? <Loader2Icon /> : <LogOutIcon />}
        Log out
      </button>
    </DropdownMenuItem>
  );
}
