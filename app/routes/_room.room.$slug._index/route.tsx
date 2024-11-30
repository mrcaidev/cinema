import { loadMe } from "@/app/loaders/me";
import { getVisitorSession } from "@/app/utils/session";
import { findRoomBySlug } from "@/database/room";
import { redirect } from "react-router";
import * as v from "valibot";
import type { Route } from "./+types/route";
import { Chat } from "./chat";
import { Playlist } from "./playlist";
import { PlaylistProvider } from "./playlist-context";
import { RoomInfo } from "./room-info";
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
    const user = room.users.find((user) => user.id === me.id);

    if (!user) {
      return redirect(`/room/${slug}/join`) as never;
    }

    return { room, me: user, role: user.role };
  }

  const visitorSession = await getVisitorSession(request.headers.get("Cookie"));

  const visitorId = visitorSession.get("id");

  if (!visitorId) {
    return redirect(`/room/${slug}/join`) as never;
  }

  const visitor = room.users.find((user) => user.id === visitorId);

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
      <PlaylistProvider>
        <div className="flex flex-col xl:flex-row gap-4 min-h-screen p-4">
          <div className="grow-0 xl:grow space-y-4">
            <Video />
            <RoomInfo />
          </div>
          <div className="grow xl:grow-0 grid grid-rows-3 gap-4 xl:w-[420px] h-[calc(100vh-32px)]">
            <Playlist />
            <Chat />
          </div>
        </div>
      </PlaylistProvider>
    </SocketProvider>
  );
}
