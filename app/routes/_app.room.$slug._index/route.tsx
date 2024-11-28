import { loadMe } from "@/app/loaders/me";
import { getVisitorSession } from "@/app/utils/session";
import {
  findAsAdmin,
  findAsHost,
  findAsMember,
  findAsVisitor,
} from "@/common/utils";
import { findRoomBySlug } from "@/database/room";
import { redirect } from "react-router";
import * as v from "valibot";
import type { Route } from "./+types/route";
import { Chat } from "./chat";
import { Control } from "./control";
import { SocketProvider } from "./socket-context";
import { Video } from "./video";

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

  const me = await loadMe(request);

  if (me) {
    if (findAsHost(room, me)) {
      return { room, me, role: "host" as const };
    }

    if (findAsAdmin(room, me)) {
      return { room, me, role: "admin" as const };
    }

    if (findAsMember(room, me)) {
      return { room, me, role: "member" as const };
    }

    return redirect(`/room/${slug}/join`) as never;
  }

  const visitorSession = await getVisitorSession(request.headers.get("Cookie"));

  const visitorId = visitorSession.get("id");

  if (!visitorId) {
    return redirect(`/room/${slug}/join`) as never;
  }

  const visitor = findAsVisitor(room, { id: visitorId });

  if (visitor) {
    return { room, me: visitor, role: "visitor" as const };
  }

  return redirect(`/room/${slug}/join`) as never;
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: `${data.room.name} | Cinema` }];
}

export default function RoomPage() {
  return (
    <SocketProvider>
      <div className="flex flex-col xl:flex-row gap-6 min-h-screen pt-20 pb-8">
        <div className="grow-0 xl:grow space-y-4">
          <Video />
          <Control />
        </div>
        <Chat />
      </div>
    </SocketProvider>
  );
}
