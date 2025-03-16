import { config } from "dotenv";
config();

export const certsLocation = process.env.CERTS_FOLDER
  ? process.env.CERTS_FOLDER.endsWith("/") ||
    process.env.CERTS_FOLDER.endsWith("\\")
    ? process.env.CERTS_FOLDER
    : process.env.CERTS_FOLDER + "/"
  : "./certs/";

export const keyFileName = process.env.KEYFILENAME
  ? process.env.KEYFILENAME
  : "key.pem";

export const certFileName = process.env.CERTFILENAME
  ? process.env.CERTFILENAME
  : "cert.pem";

export const protocol = process.env.PROTOCOL ? process.env.PROTOCOL : "http";
export const socketPort = process.env.SOCKETPORT
  ? Number(process.env.SOCKETPORT)
  : 1337;
export const hostName = process.env.HOSTNAME
  ? process.env.HOSTNAME
  : "localhost";

export const socketHost = process.env.SOCKETHOST
  ? process.env.SOCKETHOST
  : hostName;

export const mode = process.env.MODE ? process.env.MODE : "development";

export const hostPort =
  mode === "production"
    ? protocol === "https"
      ? 443
      : 80
    : process.env.HOSTPORT
    ? process.env.HOSTPORT
    : 3000;

export const frontendURL = process.env.OVERRIDE
  ? process.env.OVERRIDE
  : `${protocol}://${hostName}${mode == "production" ? "" : ":" + hostPort}`;

export const frontendWWWURL = process.env.OVERRIDE
  ? process.env.OVERRIDE
  : `${protocol}://www.${hostName}${
      mode == "production" ? "" : ":" + hostPort
    }`;

export const socketURL = `${protocol}://${socketHost}:${socketPort}`;

export const serverStartupMessage = `Server is running.\nExpecting Frontend at ${frontendURL}\nListening for socket messages at ${socketURL}`;
