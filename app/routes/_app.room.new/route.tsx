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
import { Label } from "@/app/components/ui/label";
import { useToast } from "@/app/components/ui/use-toast";
import { createRoom } from "@/app/database/room";
import { loadMe } from "@/app/loaders/me";
import { generateSalt, hash } from "@/app/utils/salt";
import { ChevronLeftIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { data, Link, redirect, useFetcher } from "react-router";
import * as v from "valibot";
import type { Route } from "./+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  return await loadMe(request, { strict: true });
}

const schema = v.object({
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(30)),
  password: v.union([
    v.pipe(v.string(), v.minLength(2), v.maxLength(20)),
    v.pipe(
      v.literal(""),
      v.transform(() => null),
    ),
  ]),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const { success, issues, output } = await v.safeParseAsync(
    schema,
    Object.fromEntries(formData),
  );

  if (!success) {
    return data({ error: issues[0].message }, { status: 400 });
  }

  const { name, password } = output;

  const me = await loadMe(request, { strict: true });

  let passwordSalt: string | null = null;
  let passwordHash: string | null = null;

  if (password) {
    passwordSalt = generateSalt();
    passwordHash = await hash(password, passwordSalt);
  }

  const room = await createRoom({
    name,
    host: {
      id: me.id,
      nickname: me.nickname,
      avatarUrl: me.avatarUrl,
    },
    passwordSalt,
    passwordHash,
  });

  return redirect(`/room/${room.slug}`) as never;
}

export function meta() {
  return [{ title: "New Room | Cinema" }];
}

export default function NewRoomPage({ loaderData: me }: Route.ComponentProps) {
  const { Form, data, state } = useFetcher<typeof action>();

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
          <CardTitle>Create a Room</CardTitle>
          <CardDescription>
            Host a cinema room and invite your family and friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="POST" className="space-y-4" id="new-room-form">
            <div className="space-y-1">
              <Label htmlFor="name" required>
                Name
              </Label>
              <Input
                name="name"
                defaultValue={me.nickname ? `${me.nickname}'s Room` : "My Room"}
                placeholder="1-30 characters"
                required
                minLength={1}
                maxLength={30}
                id="name"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                placeholder="Optional, 2-20 characters"
                minLength={2}
                maxLength={20}
                id="password"
              />
            </div>
          </Form>
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="outline" asChild>
            <Link to="/">
              <ChevronLeftIcon />
              Back
            </Link>
          </Button>
          <Button form="new-room-form" disabled={state === "submitting"}>
            {state === "submitting" ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <PlusIcon />
            )}
            Create
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
