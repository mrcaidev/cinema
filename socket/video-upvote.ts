import type { ClientToServerEvents } from "@/common/types";
import type { Context } from "./types";

export function handleVideoUpvote(
  { io, socket }: Context,
  ...args: Parameters<ClientToServerEvents["video:upvote"]>
) {
  const [event] = args;

  io.to(socket.data.room).emit("video:upvoted", event);
}
