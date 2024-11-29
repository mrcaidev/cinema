import type { ClientToServerEvents } from "@/common/types";
import type { Context } from "./types";
import { getRoom } from "./utils";

export async function handleMessageSend(
  { socket }: Context,
  ...args: Parameters<ClientToServerEvents["message:send"]>
) {
  const [event, callback] = args;

  const room = getRoom(socket);

  socket.broadcast.to(room).emit("message:sent", {
    ...event,
    fromUser: socket.data.user,
  });

  callback();
}
