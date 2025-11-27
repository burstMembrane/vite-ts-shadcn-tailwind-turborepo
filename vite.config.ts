import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import reactCompiler from 'babel-plugin-react-compiler'
import tailwindcss from '@tailwindcss/vite'

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // @ts-expect-error reactCompiler not typed
     react({
      babel: {
        plugins: [reactCompiler]
      }
    }),
    tailwindcss(),
  ],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // if in development mode, enable sourcemaps and disable minification
  build: {
    minify: !IS_DEVELOPMENT,
    sourcemap: IS_DEVELOPMENT,
  },
  worker: {
    format: 'es',
  },
})
