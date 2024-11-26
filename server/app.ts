import { createRequestHandler } from "@react-router/express";
import express from "express";
import "react-router";

export const app = express();

app.use(
  createRequestHandler({
    // @ts-expect-error Provided by React Router at build time.
    build: () => import("virtual:react-router/server-build"),
  }),
);
