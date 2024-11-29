import type { ClientToServerEvents } from "@/common/types";
import type { Context } from "./types";

export async function handleMessageSend(
  { socket }: Context,
  ...args: Parameters<ClientToServerEvents["message:send"]>
) {
  const [event, callback] = args;

  socket.broadcast.to(socket.data.room).emit("message:sent", {
    ...event,
    fromUser: socket.data.user,
  });

  callback();
}
