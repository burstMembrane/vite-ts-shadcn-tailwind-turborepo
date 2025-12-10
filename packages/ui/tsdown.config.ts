import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/**/*.{ts,tsx}"],
  format: ["es"],
  platform: "neutral",
  outDir: "dist",
  dts: true,
  unbundle: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    /^@radix-ui\//,
    "class-variance-authority",
    "clsx",
    "lucide-react",
    "tailwind-merge",
  ],
});
