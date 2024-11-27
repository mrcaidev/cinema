import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [reactRouter(), tsconfigPaths()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  build: {
    rollupOptions: isSsrBuild
      ? { input: ["./app/server.ts", "./socket/server.ts"] }
      : undefined,
  },
}));
