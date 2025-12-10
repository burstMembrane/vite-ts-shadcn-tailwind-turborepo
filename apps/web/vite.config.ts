import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactCompiler from "babel-plugin-react-compiler";
import path from "path";

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // @ts-expect-error reactCompiler not typed
    react({
      babel: {
        plugins: [reactCompiler],
      },
    }),
  ],
  resolve: {
    alias: {
      "@repo/ui/styles": path.resolve(__dirname, "../../packages/ui/dist/styles.css"),
      "@repo/ui": path.resolve(__dirname, "../../packages/ui/dist"),
      "@repo/lib": path.resolve(__dirname, "../../packages/lib/dist"),
      "@repo/shared": path.resolve(__dirname, "../../packages/shared/dist"),
    },
  },
  base: "./",
  // if in development mode, enable sourcemaps and disable minification
  build: {
    minify: !IS_DEVELOPMENT,
    sourcemap: IS_DEVELOPMENT,
  },
  worker: {
    format: "es",
  },
});
