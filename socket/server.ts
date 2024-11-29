import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/common/types";
import type { Server as HttpServer } from "node:http";
import { Server, type DefaultEventsMap } from "socket.io";
import { handleConnect } from "./connect";
import { handleDisconnect } from "./disconnect";
import { handleHandshake } from "./handshake";
import { handleMessageSend } from "./message-send";
import { handlePing } from "./ping";
import type { Context, SocketData } from "./types";
import { handleVideoImport } from "./video-import";

export function createServer(httpServer: HttpServer) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    DefaultEventsMap,
    SocketData
  >(httpServer);

  io.on("connection", async (socket) => {
    const context: Context = { io, socket };

    await handleHandshake(context);
    await handleConnect(context);

    socket.on("ping", (...args) => {
      handlePing(context, ...args);
    });
    socket.on("message:send", (...args) => {
      handleMessageSend(context, ...args);
    });
    socket.on("video:import", (...args) => {
      handleVideoImport(context, ...args);
    });
    socket.on("disconnect", () => {
      handleDisconnect(context);
    });
  });
}
