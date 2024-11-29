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
import type { SocketData } from "./types";
import { handleVideoImport } from "./video-import";

export function createServer(httpServer: HttpServer) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    DefaultEventsMap,
    SocketData
  >(httpServer);

  io.on("connection", async (socket) => {
    await handleHandshake({ io, socket });

    await handleConnect({ io, socket });

    socket.on("ping", (callback) => callback());
    socket.on("message:send", (...args) =>
      handleMessageSend({ io, socket }, ...args),
    );
    socket.on("video:import", (...args) =>
      handleVideoImport({ io, socket }, ...args),
    );

    socket.on("disconnect", () => handleDisconnect({ io, socket }));
  });
}
