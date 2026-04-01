import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  define: {
    global: "window",
  },
  server: {
    proxy: {
      "/api": "http://localhost:8082",
      "/login": "http://localhost:8082",
    },
  },
});
