import type { ClientToServerEvents } from "@/common/types";
import { upvotePlaylistEntry } from "@/database/room";
import type { Context } from "./types";

export async function handlePlaylistUpvote(
  { io, socket }: Context,
  ...args: Parameters<ClientToServerEvents["playlist:upvote"]>
) {
  const [event] = args;

  if (socket.data.user.role === "visitor") {
    return;
  }

  const newUpvotedUserIds = await upvotePlaylistEntry(socket.data.room, {
    playlistEntryId: event.id,
    user: socket.data.user,
  });

  if (!newUpvotedUserIds) {
    return;
  }

  io.to(socket.data.room).emit("playlist:upvoted", {
    ...event,
    upvotedUserIds: newUpvotedUserIds,
  });
}
