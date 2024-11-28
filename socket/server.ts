import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/common/types";
import type { Server as HttpServer } from "node:http";
import { Server, type DefaultEventsMap } from "socket.io";
import { handleHandshake } from "./handshake";
import type { SocketData } from "./types";

export function attachSocketServer(httpServer: HttpServer) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    DefaultEventsMap,
    SocketData
  >(httpServer);

  io.on("connection", async (socket) => {
    await handleHandshake({ io, socket });

    socket.on("ping", (callback) => callback());
  });
}
