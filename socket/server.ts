import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { handleHandshake } from "./handshake";

export function attachSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer);

  io.on("connection", async (socket) => {
    await handleHandshake(socket);

    socket.on("ping", (callback) => callback());
  });
}
