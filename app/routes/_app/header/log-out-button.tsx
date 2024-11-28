import { cn } from "@/app/components/ui/cn";
import type { action } from "@/app/routes/_auth.logout/route";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import { forwardRef, type HTMLAttributes } from "react";
import { useFetcher } from "react-router";

export const LogOutButton = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { Form, state } = useFetcher<typeof action>();

  return (
    <Form method="POST" action="/logout">
      <button
        ref={ref}
        type="submit"
        disabled={state === "submitting"}
        className={cn("w-full", className)}
        {...props}
      >
        {state === "submitting" ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <LogOutIcon />
        )}
        Log out
      </button>
    </Form>
  );
});

LogOutButton.displayName = "LogOutButton";
