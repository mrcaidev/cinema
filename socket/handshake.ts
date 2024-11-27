import { findRoomBySlug } from "@/database/room";
import type { Socket } from "socket.io";
import * as v from "valibot";

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

export async function handleHandshake(socket: Socket) {
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

  const { host, admins, members, visitors } = room;

  if (host.id === userId) {
    socket.join(roomSlug);
    return { role: "host" as const };
  }

  if (admins.some((admin) => admin.id === userId)) {
    socket.join(roomSlug);
    return { role: "admin" as const };
  }

  if (members.some((member) => member.id === userId)) {
    socket.join(roomSlug);
    return { role: "member" as const };
  }

  if (visitors.some((visitor) => visitor.id === userId)) {
    socket.join(roomSlug);
    return { role: "visitor" as const };
  }

  socket.disconnect();
  return;
}
