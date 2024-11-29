import compression from "compression";
import express from "express";
import { createServer as createHttpServer } from "node:http";
import { appServer } from "./build/server/index.js";
import { createServer as createSocketServer } from "./build/server/index2.js";

console.log(
  `${new Date().toLocaleTimeString()} [entry] starting production server`,
);

const expressServer = express();
const httpServer = createHttpServer(expressServer);
createSocketServer(httpServer);

expressServer.disable("x-powered-by");
expressServer.use(compression());
expressServer.use(
  "/assets",
  express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
);
expressServer.use(express.static("build/client", { maxAge: "1h" }));
expressServer.use(appServer);

const port = Number.parseInt(process.env.PORT ?? "3000");
httpServer.listen(port, () => {
  console.log(
    `${new Date().toLocaleTimeString()} [entry] server is running on port ${port}`,
  );
});
