import compression from "compression";
import express from "express";
import morgan from "morgan";
import { createServer as createHttpServer } from "node:http";
import { createServer as createViteServer } from "vite";
import { createServer as createSocketServer } from "./socket/server";

console.log(
  `${new Date().toLocaleTimeString()} [entry] starting development server`,
);

const expressServer = express();
const httpServer = createHttpServer(expressServer);
createSocketServer(httpServer);

const viteServer = await createViteServer({ server: { middlewareMode: true } });
const { appServer } = await viteServer.ssrLoadModule("./app/server");

expressServer.disable("x-powered-by");
expressServer.use(compression());
expressServer.use(morgan("dev"));
expressServer.use(viteServer.middlewares);
expressServer.use(async (request, response, next) => {
  try {
    return await appServer(request, response, next);
  } catch (error) {
    if (error instanceof Error) {
      viteServer.ssrFixStacktrace(error);
    }
    next(error);
  }
});

const port = Number.parseInt(process.env.PORT || "3000");
httpServer.listen(port, () => {
  console.log(
    `${new Date().toLocaleTimeString()} [entry] server is running on http://localhost:${port}`,
  );
});
