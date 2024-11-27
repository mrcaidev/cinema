// @ts-check

import compression from "compression";
import express from "express";
import { createServer } from "node:http";

// @ts-ignore Build output.
import { appServer } from "./build/server/index.js";

// @ts-ignore Build output.
import { attachSocketServer } from "./build/server/index2.js";

console.log(
  `${new Date().toLocaleTimeString()} [entry] starting production server`,
);

const server = express();
const httpServer = createServer(server);
attachSocketServer(httpServer);

server.use(compression());
server.disable("x-powered-by");

server.use(
  "/assets",
  express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
);
server.use(express.static("build/client", { maxAge: "1h" }));
server.use(appServer);

const port = Number.parseInt(process.env.PORT ?? "3000");

httpServer.listen(port, () => {
  console.log(
    `${new Date().toLocaleTimeString()} [entry] server is running on port ${port}`,
  );
});
