import type { ClientToServerEvents } from "@/common/types";
import type { Context } from "./types";
import { getRoom } from "./utils";

export function handleVideoUpvote(
  { io, socket }: Context,
  ...args: Parameters<ClientToServerEvents["video:upvote"]>
) {
  const [event] = args;

  const room = getRoom(socket);

  io.to(room).emit("video:upvoted", event);
}
