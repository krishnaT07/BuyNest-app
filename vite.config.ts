import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Removed lovable-tagger to remove Lovable branding

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: ".",
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist",
  },
  publicDir: "./client/public",
  css: {
    // Ensure Vite uses the Tailwind/PostCSS config located under client/
    postcss: "./client/postcss.config.js",
  },
  plugins: [
    react(),
    // Removed componentTagger() to remove Lovable logo overlay
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
}));