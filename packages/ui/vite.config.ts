import { defineConfig } from "vite";
import { glob } from "glob";
import { fileURLToPath } from "url";

export default defineConfig({
  build: {
    lib: {
      entry: Object.fromEntries(
        glob
          .sync("src/**/*.{ts,tsx}", {
            ignore: ["**/*.d.ts", "**/*.test.{ts,tsx}", "**/*.stories.{ts,tsx}"],
          })
          .map((file) => [
            file.slice(4, file.length - (file.endsWith(".tsx") ? 4 : 3)),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-slot",
        "class-variance-authority",
        "clsx",
        "lucide-react",
        "tailwind-merge",
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        assetFileNames: "styles/[name].[ext]",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
});
