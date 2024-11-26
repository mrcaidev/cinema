// @ts-check

import compression from "compression";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(socket.id, "connected");

  socket.emit("confirmation", "connected!");

  socket.on("event", (data) => {
    console.log(socket.id, data);
    socket.emit("event", "pong");
  });
});

app.use(compression());

app.disable("x-powered-by");

if (process.env.NODE_ENV === "development") {
  console.log("Starting development server...");

  const vite = await import("vite");

  const viteServer = await vite.createServer({
    server: { middlewareMode: true },
  });

  app.use(viteServer.middlewares);

  app.use(async (request, response, next) => {
    try {
      const source = await viteServer.ssrLoadModule("server/app.ts");

      return await source.app(request, response, next);
    } catch (error) {
      if (typeof error === "object" && error instanceof Error) {
        viteServer.ssrFixStacktrace(error);
      }

      next(error);
    }
  });
} else {
  console.log("Starting production server...");

  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
  );

  app.use(express.static("build/client", { maxAge: "1h" }));

  app.use(await import("build/server/index.js").then((mod) => mod.app));
}

const port = Number.parseInt(process.env.PORT ?? "3000");

httpServer.listen(port, () => console.log(`Server is running on port ${port}`));
