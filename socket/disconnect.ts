import { nanoid } from "nanoid";
import type { Context } from "./types";

export function handleDisconnect({ io, socket }: Context) {
  io.to(socket.data.room).emit("user:left", {
    id: nanoid(),
    user: socket.data.user,
    leftTime: Date.now(),
  });
}
