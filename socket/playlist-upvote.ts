import type { ClientToServerEvents } from "@/common/types";
import { updateUpvotedUserIdsInRoomBySlug } from "@/database/room";
import type { Context } from "./types";

export async function handlePlaylistUpvote(
  { io, socket }: Context,
  ...args: Parameters<ClientToServerEvents["playlist:upvote"]>
) {
  const [event] = args;

  if (socket.data.user.role === "visitor") {
    return;
  }

  await updateUpvotedUserIdsInRoomBySlug(socket.data.room, event);

  io.to(socket.data.room).emit("playlist:upvoted", event);
}
