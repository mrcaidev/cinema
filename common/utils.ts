import type { Room } from "./types";

export function findAsHost(room: Room, user: { id: string }) {
  return room.host.id === user.id ? room.host : undefined;
}

export function findAsAdmin(room: Room, user: { id: string }) {
  return room.admins.find((admin) => admin.id === user.id);
}

export function findAsMember(room: Room, user: { id: string }) {
  return room.members.find((member) => member.id === user.id);
}

export function findAsVisitor(room: Room, user: { id: string }) {
  return room.visitors.find((visitor) => visitor.id === user.id);
}
