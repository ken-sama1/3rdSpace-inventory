import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import pluginQuery from "@tanstack/eslint-plugin-query";

const apiBaseUrl = (process.env.VITE_API_URL ??
  "http://localhost:3000");

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    ...pluginQuery.configs["flat/recommended-strict"],
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/v1": {
        target: apiBaseUrl,
        changeOrigin: true,
      },
    },
  },
  envDir: "../../",
});
