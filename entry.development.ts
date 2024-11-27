import compression from "compression";
import express from "express";
import { createServer } from "node:http";
import { attachSocketServer } from "./socket/server";

console.log(
  `${new Date().toLocaleTimeString()} [entry] starting development server`,
);

const server = express();
const httpServer = createServer(server);
attachSocketServer(httpServer);

server.use(compression());
server.disable("x-powered-by");

const vite = await import("vite");
const viteServer = await vite.createServer({
  server: { middlewareMode: true },
});

server.use(viteServer.middlewares);
server.use(async (request, response, next) => {
  try {
    const { appServer } = await viteServer.ssrLoadModule("./app/server.ts");
    return await appServer(request, response, next);
  } catch (error) {
    if (typeof error === "object" && error instanceof Error) {
      viteServer.ssrFixStacktrace(error);
    }
    next(error);
  }
});

const port = Number.parseInt(process.env.PORT ?? "3000");

httpServer.listen(port, () => {
  console.log(
    `${new Date().toLocaleTimeString()} [entry] server is running on port ${port}`,
  );
});
