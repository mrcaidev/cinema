import type { ClientToServerEvents } from "@/common/types";
import type { Context } from "./types";
import { getRoom } from "./utils";

export async function handleMessageSend(
  { socket }: Context,
  ...args: Parameters<ClientToServerEvents["message:send"]>
) {
  const [{ id, content, sentTime }, callback] = args;

  const room = getRoom(socket);

  socket.broadcast.to(room).emit("message:sent", {
    id,
    from: socket.data.user,
    content,
    sentTime,
  });

  callback();
}
