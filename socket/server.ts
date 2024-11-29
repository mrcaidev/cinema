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
import { handlePlaylistImport } from "./playlist-import";
import { handlePlaylistUpvote } from "./playlist-upvote";
import type { Context, SocketData } from "./types";

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
    socket.on("playlist:import", (...args) => {
      handlePlaylistImport(context, ...args);
    });
    socket.on("playlist:upvote", (...args) => {
      handlePlaylistUpvote(context, ...args);
    });
    socket.on("disconnect", () => {
      handleDisconnect(context);
    });
  });
}
