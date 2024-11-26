import {
  addMemberToRoomById,
  findRoomWithCredentialsBySlug,
} from "@/database/room";
import { loadMe } from "@/loaders/me";
import { hash } from "@/utils/salt";
import { data, redirect } from "react-router";
import * as v from "valibot";
import type { Route } from "./+types/route";

const schema = v.object({
  slug: v.pipe(v.string(), v.nanoid(), v.length(10)),
  password: v.nullable(v.pipe(v.string(), v.minLength(2), v.maxLength(20))),
});

export async function loader({ params, request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const { success, output } = await v.safeParseAsync(schema, {
    slug: params.slug,
    password: url.searchParams.get("pwd"),
  });

  if (!success) {
    return data(
      { error: "Make sure you pasted the correct invitation link!" },
      { status: 403 },
    );
  }

  const { slug, password } = output;

  const roomWithCredentials = await findRoomWithCredentialsBySlug(slug);

  if (!roomWithCredentials) {
    return data(
      { error: "Make sure you pasted the correct invitation link!" },
      { status: 403 },
    );
  }

  const {
    id: roomId,
    host,
    admins,
    members,
    passwordSalt,
    passwordHash,
  } = roomWithCredentials;

  const me = await loadMe(request);

  if (me && [host, ...admins, ...members].some((u) => u.id === me.id)) {
    return redirect(`/room/${slug}`) as never;
  }

  if (passwordSalt && passwordHash) {
    if (!password) {
      return data(
        {
          error: "Make sure you pasted the correct invitation link!",
        },
        { status: 403 },
      );
    }

    const attemptHash = await hash(password, passwordSalt);

    if (attemptHash !== passwordHash) {
      return data(
        { error: "Make sure you pasted the correct invitation link!" },
        { status: 403 },
      );
    }
  }

  if (!me) {
    return redirect(`/room/${slug}/welcome`) as never;
  }

  await addMemberToRoomById(roomId, me);

  return redirect(`/room/${slug}/welcome`) as never;
}

export function meta() {
  return [{ title: "Join Room | Cinema" }];
}

export default function RoomJoinPage({
  loaderData: { error },
}: Route.ComponentProps) {
  return (
    <div className="grid place-items-center min-h-screen">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium">Join failed 🥲</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    </div>
  );
}
