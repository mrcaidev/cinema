import { nanoid } from "nanoid";
import type { Context } from "./types";

export function handleDisconnect({ socket }: Context) {
  socket.broadcast.to(socket.data.room).emit("user:left", {
    id: nanoid(),
    user: socket.data.user,
    leftTime: Date.now(),
  });
}
