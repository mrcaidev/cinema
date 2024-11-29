import { nanoid } from "nanoid";
import type { Context } from "./types";

export async function handleConnect({ io, socket }: Context) {
  io.to(socket.data.room).emit("user:joined", {
    id: nanoid(),
    user: socket.data.user,
    joinedTime: Date.now(),
  });
}
