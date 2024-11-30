import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { handleConnect } from "./handlers/connect";
import { handleDisconnect } from "./handlers/disconnect";
import { handleMessageSend } from "./handlers/message-send";
import { handlePing } from "./handlers/ping";
import { handlePlaylistImport } from "./handlers/playlist-import";
import { handlePlaylistRemove } from "./handlers/playlist-remove";
import { handlePlaylistUpvote } from "./handlers/playlist-upvote";
import { auth } from "./middleware/auth";
import type { Context, IO } from "./types";

export function createServer(httpServer: HttpServer) {
  const io: IO = new Server(httpServer);

  io.use(auth);

  io.on("connection", async (socket) => {
    const context: Context = { io, socket };

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
    socket.on("playlist:remove", (...args) => {
      handlePlaylistRemove(context, ...args);
    });
    socket.on("disconnect", () => {
      handleDisconnect(context);
    });
  });
}
