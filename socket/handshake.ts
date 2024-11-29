import {
  findAsAdmin,
  findAsHost,
  findAsMember,
  findAsVisitor,
} from "@/common/utils";
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

  const host = findAsHost(room, { id: userId });
  if (host) {
    socket.join(roomSlug);
    socket.data = { user: { ...host, role: "host" } };
    return;
  }

  const admin = findAsAdmin(room, { id: userId });
  if (admin) {
    socket.join(roomSlug);
    socket.data = { user: { ...admin, role: "admin" } };
    return;
  }

  const member = findAsMember(room, { id: userId });
  if (member) {
    socket.join(roomSlug);
    socket.data = { user: { ...member, role: "member" } };
    return;
  }

  const visitor = findAsVisitor(room, { id: userId });
  if (visitor) {
    socket.join(roomSlug);
    socket.data = { user: { ...visitor, role: "visitor" } };
    return;
  }

  socket.disconnect();
  return;
}
