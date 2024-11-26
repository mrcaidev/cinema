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
  const { success, issues, output } = await v.safeParseAsync(schema, {
    slug: params.slug,
    password: new URL(request.url).searchParams.get("pwd"),
  });

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
    passwordSalt,
    passwordHash,
  } = roomWithCredentials;

  const me = await loadMe(request);

  if (me && [host, ...admins, ...members].some((u) => u.id === me.id)) {
    return redirect(`/room/${slug}`) as never;
  }

  if (!passwordSalt || !passwordHash) {
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

  const attemptHash = await hash(password, passwordSalt);

  if (attemptHash !== passwordHash) {
    return data({ error: "Password is incorrect" }, { status: 403 });
  }

  if (!me) {
    return redirect(`/room/${slug}/welcome`) as never;
  }

  await addMemberToRoomById(roomId, me);

  return redirect(`/room/${slug}/welcome`) as never;
}

export default function RoomJoinPage({
  loaderData: { error },
}: Route.ComponentProps) {
  return (
    <div className="grid place-items-center min-h-screen">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium">Join failed</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    </div>
  );
}
