import { createRequestHandler } from "@react-router/express";
import express from "express";
import "react-router";

export const appServer = express();

appServer.use(
  createRequestHandler({
    // @ts-ignore Provided by React Router at build time.
    build: () => import("virtual:react-router/server-build"),
  }),
);
