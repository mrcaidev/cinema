import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { useToast } from "@/app/components/ui/use-toast";
import { ChevronLeftIcon, Loader2Icon, UsersRoundIcon } from "lucide-react";
import { useEffect } from "react";
import { Link, useFetcher } from "react-router";
import type { Route } from "./+types/route";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  const url = new URL(formData.get("invitationLink")?.toString() ?? "");

  if (!/^\/room\/[\w-]{10}\/join$/.test(url.pathname)) {
    return {
      error:
        "This invitation link is invalid. Please make sure you pasted the full correct link",
    };
  }

  window.location.href = `${url.pathname}?${url.searchParams}`;

  return undefined as never;
}

export function meta() {
  return [{ title: "Join Room | Cinema" }];
}

export default function JoinRoomPage() {
  const { Form, data, state } = useFetcher<typeof clientAction>();

  const { toast } = useToast();

  useEffect(() => {
    if (data?.error) {
      toast({ variant: "destructive", description: data.error });
    }
  }, [data, toast]);

  return (
    <div className="grid place-items-center min-h-screen">
      <Card className="animate-in fade-in-0 zoom-in-95">
        <CardHeader>
          <CardTitle>Join Other's Room</CardTitle>
          <CardDescription>
            Paste the invitation link that your friend has shared with you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="POST" id="join-room-form">
            <label htmlFor="invitationLink" className="sr-only">
              Invitation link
            </label>
            <Input
              type="url"
              name="invitationLink"
              autoComplete="off"
              autoFocus
              placeholder="https://cinema.mrcai.dev/room/..."
              required
              id="invitationLink"
            />
          </Form>
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="outline" asChild>
            <Link to="/">
              <ChevronLeftIcon />
              Back
            </Link>
          </Button>
          <Button form="join-room-form" disabled={state === "submitting"}>
            {state === "submitting" ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <UsersRoundIcon />
            )}
            Join
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
