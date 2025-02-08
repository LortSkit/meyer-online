import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";
import mkcert from "vite-plugin-mkcert";
config();

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 100,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
    },
  },
  plugins: [
    react(),
    mkcert({
      savePath: process.env.VITE_CERTS_FOLDER
        ? process.env.VITE_CERTS_FOLDER.endsWith("/") ||
          process.env.VITE_CERTS_FOLDER.endsWith("\\")
          ? process.env.VITE_CERTS_FOLDER
          : process.env.VITE_CERTS_FOLDER + "/"
        : "./certs/",
      keyFileName: process.env.VITE_KEYFILENAME
        ? process.env.VITE_KEYFILENAME
        : "key.pem",
      certFileName: process.env.VITE_CERTFILENAME
        ? process.env.VITE_CERTFILENAME
        : "cert.pem",
    }),
  ],
  server: {
    https: process.env.VITE_PROTOCOL === "https",
    host: process.env.VITE_HOSTNAME ? process.env.VITE_HOSTNAME : "localhost",
    port: process.env.VITE_HOSTPORT ? Number(process.env.VITE_HOSTPORT) : 3000,
  },
  preview: {
    port: process.env.VITE_PROTOCOL === "https" ? 443 : 80,
  },
  base: process.env.VITE_BASE
    ? process.env.VITE_BASE.startsWith("/") ||
      process.env.VITE_BASE.startsWith("\\")
      ? process.env.VITE_BASE
      : "/" + process.env.VITE_BASE
    : undefined,
});
