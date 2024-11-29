import type { ClientToServerEvents } from "@/common/types";
import type { Context } from "./types";

export function handlePlaylistUpvote(
  { io, socket }: Context,
  ...args: Parameters<ClientToServerEvents["playlist:upvote"]>
) {
  const [event] = args;

  if (socket.data.user.role === "visitor") {
    return;
  }

  io.to(socket.data.room).emit("playlist:upvoted", event);
}