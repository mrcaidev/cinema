import type { ClientToServerEvents } from "@/common/types";
import { upvotePlaylistVideo } from "@/database/room";
import type { Context } from "../types";

export async function handlePlaylistUpvote(
  { io, socket }: Context,
  ...args: Parameters<ClientToServerEvents["playlist:upvote"]>
) {
  const [event] = args;

  if (socket.data.user.role === "visitor") {
    return;
  }

  const newUpvotedUserIds = await upvotePlaylistVideo(
    socket.data.room,
    event.id,
    socket.data.user,
  );

  if (!newUpvotedUserIds) {
    return;
  }

  io.to(socket.data.room).emit("playlist:upvoted", {
    ...event,
    upvotedUserIds: newUpvotedUserIds,
  });
}
