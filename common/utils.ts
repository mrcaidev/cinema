import type { Room } from "./types";

export function findHostById(room: Room, userId: string) {
  return room.host.id === userId ? room.host : undefined;
}

export function findAdminById(room: Room, userId: string) {
  return room.admins.find((admin) => admin.id === userId);
}

export function findMemberById(room: Room, userId: string) {
  return room.members.find((member) => member.id === userId);
}

export function findVisitorById(room: Room, userId: string) {
  return room.visitors.find((visitor) => visitor.id === userId);
}
