import { findRoomBySlug } from "@/database/room";
import type { ExtendedError } from "socket.io";
import * as v from "valibot";
import type { ServerSocket } from "../types";

const schema = v.object({
  query: v.object({
    roomSlug: v.pipe(v.string(), v.nanoid(), v.length(10)),
  }),
  auth: v.object({
    userId: v.union([
      v.pipe(v.string(), v.regex(/^[a-fA-F0-9]{24}$/)),
      v.pipe(v.string(), v.uuid()),
    ]),
  }),
});

export async function auth(
  socket: ServerSocket,
  next: (error?: ExtendedError) => void,
) {
  const { success, issues, output } = await v.safeParseAsync(
    schema,
    socket.handshake,
  );

  if (!success) {
    next(new Error(issues[0].message));
    return;
  }

  const {
    query: { roomSlug },
    auth: { userId },
  } = output;

  const room = await findRoomBySlug(roomSlug);

  if (!room) {
    next(new Error(`Room ${roomSlug} does not exist`));
    return;
  }

  const user = room.users.find((user) => user.id === userId);

  if (!user) {
    next(new Error("You have not yet been admitted to this room"));
    return;
  }

  socket.join(roomSlug);

  socket.data = { room: roomSlug, user };
}
