import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeftIcon, Loader2Icon, UsersRoundIcon } from "lucide-react";
import { useEffect } from "react";
import { data, Link, redirect, useFetcher } from "react-router";
import * as v from "valibot";
import type { Route } from "./+types/route";

const schema = v.pipe(
  v.object({
    room: v.pipe(v.string(), v.url()),
  }),
  v.transform(({ room }) => {
    const url = new URL(room);
    return {
      domain: url.hostname,
      slug: url.pathname.replace(/^\/room\//, ""),
      password: url.searchParams.get("pwd"),
    };
  }),
  v.object({
    domain: import.meta.env.DEV
      ? v.union([v.literal("localhost"), v.literal("cinema.mrcai.dev")])
      : v.literal("cinema.mrcai.dev"),
    slug: v.pipe(v.string(), v.nanoid(), v.length(10)),
    password: v.nullable(v.pipe(v.string(), v.minLength(2), v.maxLength(20))),
  }),
);

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  const { success, issues, output } = await v.safeParseAsync(
    schema,
    Object.fromEntries(formData),
  );

  if (!success) {
    return data({ error: issues[0].message }, { status: 400 });
  }

  const { slug, password } = output;

  return redirect(
    `/room/${slug}/join${password ? `?pwd=${password}` : ""}`,
  ) as never;
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
    <div className="grid place-items-center min-h-[calc(100vh-80px)]">
      <div className="-translate-y-16">
        <Card className="animate-in fade-in-0 zoom-in-95">
          <CardHeader>
            <CardTitle>Join Other's Room</CardTitle>
            <CardDescription>
              Paste the link that your friend has shared with you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="POST" id="join-room-form">
              <label htmlFor="room" className="sr-only">
                Room link
              </label>
              <Input
                type="url"
                name="room"
                placeholder="https://cinema.mrcai.dev/room/..."
                autoFocus
                required
                id="room"
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
    </div>
  );
}
