import { loadMe } from "@/app/loaders/me";
import { getVisitorSession } from "@/app/utils/session";
import { findRoomBySlug } from "@/database/room";
import { redirect } from "react-router";
import * as v from "valibot";
import type { Route } from "./+types/route";
import { Latency } from "./latency";
import { SocketProvider } from "./socket-context";

const schema = v.object({
  slug: v.pipe(v.string(), v.nanoid(), v.length(10)),
});

export async function loader({ params, request }: Route.LoaderArgs) {
  const { success, output } = await v.safeParseAsync(schema, params);

  if (!success) {
    return redirect(`/room/${params.slug}/join`) as never;
  }

  const { slug } = output;

  const room = await findRoomBySlug(slug);

  if (!room) {
    return redirect(`/room/${slug}/join`) as never;
  }

  const { host, admins, members, visitors } = room;

  const me = await loadMe(request);

  if (me) {
    if (host.id === me.id) {
      return { room, me, role: "host" as const };
    }

    if (admins.some((admin) => admin.id === me.id)) {
      return { room, me, role: "admin" as const };
    }

    if (members.some((member) => member.id === me.id)) {
      return { room, me, role: "member" as const };
    }

    return redirect(`/room/${slug}/join`) as never;
  }

  const visitorSession = await getVisitorSession(request.headers.get("Cookie"));

  const visitorId = visitorSession.get("id");

  const visitor = visitors.find((v) => v.id === visitorId);

  if (visitor) {
    return { room, me: visitor, role: "visitor" as const };
  }

  return redirect(`/room/${slug}/join`) as never;
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: `${data.room.name} | Cinema` }];
}

export default function RoomPage({
  loaderData: { room, me, role },
}: Route.ComponentProps) {
  return (
    <SocketProvider>
      <div className="pt-20">
        <h1>Room {room.name}</h1>
        <p>My nickname: {me.nickname}</p>
        <p>My role: {role}</p>
        <Latency />
      </div>
    </SocketProvider>
  );
}
