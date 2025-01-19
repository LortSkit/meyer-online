import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";
import mkcert from "vite-plugin-mkcert";
config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: process.env.PROTOCOL === "https",
    host: process.env.VITE_HOSTNAME,
    port: Number(process.env.VITE_HOSTPORT),
  },
  preview: {
    port: 80,
  },
});
