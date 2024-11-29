import { nanoid } from "nanoid";
import type { Context } from "./types";
import { getRoom } from "./utils";

export function handleDisconnect({ io, socket }: Context) {
  const room = getRoom(socket);

  io.to(room).emit("user:left", {
    id: nanoid(),
    user: socket.data.user,
    leftTime: Date.now(),
  });
}
