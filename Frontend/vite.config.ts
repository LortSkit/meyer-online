import { defineConfig } from "vite";
import { ServerOptions as HttpsServerOptions } from "node:https";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";
import basicSsl from "@vitejs/plugin-basic-ssl";
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
    basicSsl({
      /** name of certification */
      name: "test",
      /** custom trust domains */
      domains: [
        "https://" + process.env.VITE_HOSTNAME
          ? process.env.VITE_HOSTNAME
          : "localhost",
        "https://" + process.env.VITE_HOSTNAME
          ? process.env.VITE_HOSTNAME
          : "localhost" + process.env.VITE_HOSTPORT,
      ],
      /** custom certification directory */
      certDir: process.env.VITE_CERTS_FOLDER
        ? process.env.VITE_CERTS_FOLDER.endsWith("/") ||
          process.env.VITE_CERTS_FOLDER.endsWith("\\")
          ? process.env.VITE_CERTS_FOLDER
          : process.env.VITE_CERTS_FOLDER + "/"
        : "./certs/",
    }),
  ],
  server: {
    https: (process.env.VITE_PROTOCOL === "https") as any as HttpsServerOptions,
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
