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
import {
  addMemberToRoomById,
  findRoomWithCredentialsBySlug,
} from "@/database/room";
import { loadMe } from "@/loaders/me";
import { compare } from "bcrypt";
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
    password: v.nullable(v.pipe(v.string(), v.minLength(1), v.maxLength(20))),
  }),
);

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const { success, issues, output } = await v.safeParseAsync(
    schema,
    Object.fromEntries(formData),
  );

  if (!success) {
    return data({ error: issues[0].message }, { status: 400 });
  }

  const { slug, password } = output;

  const roomWithCredentials = await findRoomWithCredentialsBySlug(slug);

  if (!roomWithCredentials) {
    return data({ error: "This room does not exist" }, { status: 404 });
  }

  const {
    id: roomId,
    host,
    admins,
    members,
    passwordHash,
  } = roomWithCredentials;

  const me = await loadMe(request);

  if (me && [host, ...admins, ...members].some((u) => u.id === me.id)) {
    return redirect(`/room/${slug}`) as never;
  }

  if (!passwordHash) {
    return redirect(`/room/${slug}/welcome`) as never;
  }

  if (!password) {
    return data(
      {
        error:
          "This room is protected with password. Did you copy the full link?",
      },
      { status: 403 },
    );
  }

  const isCorrectPassword = await compare(password, passwordHash);

  if (!isCorrectPassword) {
    return data({ error: "Password is incorrect" }, { status: 403 });
  }

  if (!me) {
    return redirect(`/room/${slug}/welcome`) as never;
  }

  await addMemberToRoomById(roomId, me);

  return redirect(`/room/${slug}/welcome`) as never;
}

export default function JoinRoomPage() {
  const { Form, data, state } = useFetcher<typeof action>();

  const { toast } = useToast();

  useEffect(() => {
    if (data?.error) {
      toast({ variant: "destructive", description: data.error });
    }
  }, [data, toast]);

  return (
    <div className="grid place-items-center min-h-[calc(100vh-80px)]">
      <Card className="-translate-y-16 animate-zoom-in">
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
            {state === "submitting" ? <Loader2Icon /> : <UsersRoundIcon />}
            Join
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
