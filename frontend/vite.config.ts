import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
  proxy: {
    "/offer": { target: "http://localhost:8000", changeOrigin: true },
    "/ui_config": { target: "http://localhost:8000", changeOrigin: true },
      "/instrument_config": { target: "http://localhost:8000", changeOrigin: true },
      "/get_job": { target: "http://localhost:8000", changeOrigin: true },
      "/waste_emptied": { target: "http://localhost:8000", changeOrigin: true },
      "/set_fill_volume": { target: "http://localhost:8000", changeOrigin: true },
      "/set_drain_volume": { target: "http://localhost:8000", changeOrigin: true },
      "/fill_chamber": { target: "http://localhost:8000", changeOrigin: true },
      "/drain_chamber": { target: "http://localhost:8000", changeOrigin: true },
      "/start_run": { target: "http://localhost:8000", changeOrigin: true },
      "/pause_run": { target: "http://localhost:8000", changeOrigin: true },
      "/resume_run": { target: "http://localhost:8000", changeOrigin: true },
      "/stop_run": { target: "http://localhost:8000", changeOrigin: true },
      "/clear_run": { target: "http://localhost:8000", changeOrigin: true },
      "/save_job": { target: "http://localhost:8000", changeOrigin: true },
      "/set_email": { target: "http://localhost:8000", changeOrigin: true },
      "/set_job": { target: "http://localhost:8000", changeOrigin: true },
  },
},
});
