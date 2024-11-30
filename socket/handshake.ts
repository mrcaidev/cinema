import { findRoomBySlug } from "@/database/room";
import * as v from "valibot";
import type { Context } from "./types";

const schema = v.object({
  query: v.object({
    roomSlug: v.pipe(v.string(), v.nanoid(), v.length(10)),
  }),
  auth: v.object({
    userId: v.union([
      v.pipe(v.string(), v.regex(/^[a-fA-F0-9]{24}$/)),
      v.pipe(v.string(), v.nanoid(), v.length(10)),
    ]),
  }),
});

export async function handleHandshake({ socket }: Context) {
  const { success, output } = await v.safeParseAsync(schema, socket.handshake);

  if (!success) {
    socket.disconnect();
    return;
  }

  const {
    query: { roomSlug },
    auth: { userId },
  } = output;

  const room = await findRoomBySlug(roomSlug);

  if (!room) {
    socket.disconnect();
    return;
  }

  const user = room.users.find((user) => user.id === userId);

  if (!user) {
    socket.disconnect();
    return;
  }

  socket.join(roomSlug);

  socket.data = { room: roomSlug, user };
}
