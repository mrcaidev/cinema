import type { ClientToServerEvents } from "@/common/types";
import { nanoid } from "nanoid";
import type { Context } from "./types";

export async function handlePlaylistImport(
  { io, socket }: Context,
  ...args: Parameters<ClientToServerEvents["playlist:import"]>
) {
  const [event, callback] = args;

  io.to(socket.data.room).emit("playlist:imported", {
    ...event,
    id: nanoid(),
    fromUser: socket.data.user,
    upvotedUserIds: [],
  });

  callback();
}
