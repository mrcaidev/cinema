import type { ClientToServerEvents } from "@/common/types";
import { addPlaylistEntryToRoomBySlug } from "@/database/room";
import type { Context } from "../types";

export async function handlePlaylistImport(
  { io, socket }: Context,
  ...args: Parameters<ClientToServerEvents["playlist:import"]>
) {
  const [event, callback] = args;

  if (socket.data.user.role === "visitor") {
    return;
  }

  const entry = await addPlaylistEntryToRoomBySlug(socket.data.room, {
    ...event,
    fromUser: socket.data.user,
  });

  io.to(socket.data.room).emit("playlist:imported", entry);

  callback();
}
