import type { Context } from "../types";

export async function handleConnect({ io, socket }: Context) {
  io.to(socket.data.room).emit("user:joined", {
    id: crypto.randomUUID(),
    user: socket.data.user,
    joinedTime: Date.now(),
  });
}
