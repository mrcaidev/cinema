import type {
  ClientToServerEvents,
  RoomUser,
  ServerToClientEvents,
} from "@/common/types";
import type { DefaultEventsMap, Server, Socket } from "socket.io";

export type SocketData = {
  room: string;
  user: RoomUser;
};

export type IO = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketData
>;

export type ServerSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketData
>;

export type Context = {
  io: IO;
  socket: ServerSocket;
};
