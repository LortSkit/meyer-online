//Stolen from https://github.com/joeythelantern/Socket-IO-Basics

import http from "http";
import express from "express";
import { ServerSocket } from "./socket.ts";

const application = express();

/** Server Handling */
const httpServer = http.createServer(application);

/** Start Socket */
new ServerSocket(httpServer);

/** Listen */
httpServer.listen(1337, "localhost", () => {
  console.info(`Server is running`);
});
