import type { ServerSocket } from "./types";

/**
 * Every socket joins **one and only one** room, which means `socket.rooms`
 * is always `Set { <socket.id>, <room.slug> }`
 */
export function getRoom(socket: ServerSocket) {
  for (const room of socket.rooms) {
    if (room !== socket.id) {
      return room;
    }
  }
  throw new Error(`Socket <${socket.id}> did not join any room`);
}
