import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

export function attachSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(socket.id, "connected");

    socket.emit("confirmation", "connected!");

    socket.on("event", (data) => {
      console.log(socket.id, data);
      socket.emit("event", "pong");
    });
  });

  return io;
}
