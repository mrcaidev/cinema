import type { Room, RoomUser } from "./types";

export function isHost(room: Room, user: RoomUser) {
  return room.host.id === user.id ? user : undefined;
}

export function isAdmin(room: Room, user: RoomUser) {
  return room.admins.find((admin) => admin.id === user.id);
}

export function isMember(room: Room, user: RoomUser) {
  return room.members.find((member) => member.id === user.id);
}

export function isVisitor(room: Room, user: RoomUser) {
  return room.visitors.find((visitor) => visitor.id === user.id);
}
