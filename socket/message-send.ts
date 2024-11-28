import type { ClientToServerEvents } from "@/common/types";
import type { Context } from "./types";

export async function handleMessageSend(
  { socket }: Context,
  ...args: Parameters<ClientToServerEvents["message:send"]>
) {
  const [{ id, content, sentTime }, callback] = args;

  socket.broadcast.to(socket.data.room).emit("message:sent", {
    id,
    from: socket.data.user,
    content,
    sentTime,
  });

  callback();
}
