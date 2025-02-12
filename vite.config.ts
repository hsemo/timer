import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: "@src", replacement: path.resolve(__dirname, "src") },
      { find: "@assets", replacement: path.resolve(__dirname, "src/assets") },
      {
        find: "@constants",
        replacement: path.resolve(__dirname, "src/constants"),
      },
      { find: "@hooks", replacement: path.resolve(__dirname, "src/hooks") },
      { find: "@utils", replacement: path.resolve(__dirname, "src/utils") },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "src/components"),
      },
      {
        find: "@contexts",
        replacement: path.resolve(__dirname, "src/contexts"),
      },
    ],
  },
  plugins: [
    react(),
    VitePWA({
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "beep1.mp3",
        "beep2.mp3",
      ],
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: { enabled: true },
      manifest: {
        name: "Timer",
        short_name: "otimer",
        description:
          "A timer that only plays beep sound once so that you do not get distracted.",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
