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

  const { host, admins, members, visitors } = room;

  if (host.id === userId) {
    socket.join(roomSlug);
    socket.data = { room: roomSlug, user: host };
    return { role: "host" as const };
  }

  const admin = admins.find((admin) => admin.id === userId);
  if (admin) {
    socket.join(roomSlug);
    socket.data = { room: roomSlug, user: admin };
    return { role: "admin" as const };
  }

  const member = members.find((member) => member.id === userId);
  if (member) {
    socket.join(roomSlug);
    socket.data = { room: roomSlug, user: member };
    return { role: "member" as const };
  }

  const visitor = visitors.find((visitor) => visitor.id === userId);
  if (visitor) {
    socket.join(roomSlug);
    socket.data = { room: roomSlug, user: visitor };
    return { role: "visitor" as const };
  }

  socket.disconnect();
  return;
}
