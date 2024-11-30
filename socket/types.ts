import type {
  ClientToServerEvents,
  RoomUser,
  ServerToClientEvents,
} from "@/common/types";
import type { DefaultEventsMap, Server } from "socket.io";

export type IO = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  { room: string; user: RoomUser }
>;

export type Context = {
  io: IO;
  socket: IO["sockets"]["sockets"] extends Map<unknown, infer V> ? V : never;
};
