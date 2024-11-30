import type { ClientToServerEvents } from "@/common/types";
import { removePlaylistEntry } from "@/database/room";
import type { Context } from "./types";

export async function handlePlaylistRemove(
  { io, socket }: Context,
  ...args: Parameters<ClientToServerEvents["playlist:remove"]>
) {
  const [event] = args;

  if (socket.data.user.role === "visitor") {
    return;
  }

  await removePlaylistEntry(socket.data.room, event.id);

  io.to(socket.data.room).emit("playlist:removed", event);
}
