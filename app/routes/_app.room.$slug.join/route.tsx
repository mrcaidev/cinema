import {
  admitMemberToRoomById,
  admitVisitorToRoomById,
  findRoomWithCredentialsBySlug,
} from "@/database/room";
import { loadMe } from "@/loaders/me";
import { hash } from "@/utils/salt";
import { commitVisitorSession, getVisitorSession } from "@/utils/session";
import { nanoid } from "nanoid";
import { data, redirect } from "react-router";
import * as v from "valibot";
import type { Route } from "./+types/route";

const schema = v.object({
  slug: v.pipe(v.string(), v.nanoid(), v.length(10)),
  password: v.nullable(v.pipe(v.string(), v.minLength(2), v.maxLength(20))),
});

export async function loader({ params, request }: Route.LoaderArgs) {
  // Validate data format.
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

  // Find the target room.
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
    visitors,
    passwordSalt,
    passwordHash,
  } = roomWithCredentials;

  // If the user has logged in, and has already been admitted to the room.
  const me = await loadMe(request);

  if (me && [host, ...admins, ...members].some((u) => u.id === me.id)) {
    return redirect(`/room/${slug}`) as never;
  }

  // If the user has not logged in, and has already been admitted to the room.
  const visitorSession = await getVisitorSession(request.headers.get("Cookie"));

  const visitorId = visitorSession.get("id");

  if (!me && visitorId && visitors.some((v) => v.id === visitorId)) {
    return redirect(`/room/${slug}`) as never;
  }

  // Now, these users, regardless of whether they have logged in or not,
  // have not been admitted to the room. If the room is protected by password,
  // make sure they pass the password check.
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

  // If the user has logged in, admit them to the room as member.
  if (me) {
    await admitMemberToRoomById(roomId, {
      id: me.id,
      nickname: me.nickname,
      avatarUrl: me.avatarUrl,
    });

    return redirect(`/room/${slug}`) as never;
  }

  // If the user has not logged in, and is not a new visitor,
  // admit them to the room as visitor.
  if (visitorId) {
    await admitVisitorToRoomById(roomId, visitorId);

    return redirect(`/room/${slug}`) as never;
  }

  // If the user has not logged in, and is a new visitor,
  // generate a new visitor ID and admit them to the room as visitor.
  const newVistorId = nanoid(10);

  await admitVisitorToRoomById(roomId, newVistorId);

  visitorSession.set("id", newVistorId);

  const visitorCookie = await commitVisitorSession(visitorSession);

  return redirect(`/room/${slug}`, {
    headers: { "Set-Cookie": visitorCookie },
  }) as never;
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
