import { nanoid } from "nanoid";
import type { Context } from "./types";
import { getRoom } from "./utils";

export async function handleConnect({ io, socket }: Context) {
  const room = getRoom(socket);

  io.to(room).emit("user:joined", {
    id: nanoid(),
    user: socket.data.user,
    joinedTime: Date.now(),
  });
}
