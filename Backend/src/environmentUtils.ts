import { config } from "dotenv";
config();

export const frontendURL = `${process.env.PROTOCOL}://${process.env.HOSTNAME}${
  process.env.MODE == "production" ? "" : ":" + process.env.HOSTPORT
}`;

const socketURL = `${process.env.PROTOCOL}://${process.env.HOSTNAME}:${process.env.SOCKETPORT}`;

export const serverStartupMessage = `Server is running.\nExpecting Frontend at ${frontendURL}\nListening for socket messages at ${socketURL}`;
