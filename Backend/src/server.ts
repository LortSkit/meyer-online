//Stolen from https://github.com/joeythelantern/Socket-IO-Basics

import http from "http";
import https from "https";
import fs from "fs";
import express from "express";
import { ServerSocket } from "./socket.ts";
import { config } from "dotenv";
import { serverStartupMessage } from "./environmentUtils.ts";
config();

const application = express();

/** Server Handling */
const server =
  process.env.PROTOCOL === "https" // stole some code from https://medium.com/@nirbhay0299/enable-https-in-your-typescript-express-app-using-the-pkcs12-file-f86e53535ca
    ? https.createServer(
        {
          cert: fs.readFileSync("../certs/cert.pem"),
          key: fs.readFileSync("../certs/key.pem"),
        },
        application
      )
    : http.createServer(application);

/** Start Socket */
new ServerSocket(server);

/** Listen */
server.listen(Number(process.env.SOCKETPORT), process.env.HOSTNAME, () => {
  console.info(serverStartupMessage);
});
