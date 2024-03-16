import { defineConfig } from "vite";
import { presetAttributify, presetIcons, presetUno } from "unocss";
import UnoCSS from "unocss/vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    UnoCSS({
      presets: [presetUno(), presetAttributify(), presetIcons()],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        charset: false,
      },
    },
    modules: {
      localsConvention: "camelCase",
      scopeBehaviour: "local",
      generateScopedName: "[name]_[local]_[hash:5]",
    },
  },
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
