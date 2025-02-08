//Stolen from https://github.com/joeythelantern/Socket-IO-Basics

import http from "http";
import https from "https";
import fs from "fs";
import express from "express";
import { ServerSocket } from "./socket.ts";
import {
  certFileName,
  certsLocation,
  keyFileName,
  protocol,
  serverStartupMessage,
  socketHost,
  socketPort,
} from "./environmentUtils.ts";

const application = express();

/** Server Handling */
const server =
  protocol === "https" // stole some code from https://medium.com/@nirbhay0299/enable-https-in-your-typescript-express-app-using-the-pkcs12-file-f86e53535ca
    ? https.createServer(
        {
          key: fs.readFileSync(certsLocation + keyFileName),
          cert: fs.readFileSync(certsLocation + certFileName),
        },
        application
      )
    : http.createServer(application);

/** Start Socket */
new ServerSocket(server);

/** Listen */
server.listen(socketPort, socketHost, () => {
  console.info(serverStartupMessage);
});
