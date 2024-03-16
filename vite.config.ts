import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:9000",
      "/sse": "http://127.0.0.1:9000",
      "/wss": {
        target: "ws://127.0.0.1:9000",
        ws: true,
      },
    },
  },
});
