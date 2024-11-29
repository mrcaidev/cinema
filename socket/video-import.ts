import type { ClientToServerEvents } from "@/common/types";
import { nanoid } from "nanoid";
import type { Context } from "./types";
import { getRoom } from "./utils";

export async function handleVideoImport(
  { io, socket }: Context,
  ...args: Parameters<ClientToServerEvents["video:import"]>
) {
  const [event, callback] = args;

  const room = getRoom(socket);

  io.to(room).emit("video:imported", {
    ...event,
    id: nanoid(),
    fromUser: socket.data.user,
    upvotedUserIds: [],
  });

  callback();
}
