//Stolen from https://github.com/joeythelantern/Socket-IO-Basics

import http from "http";
import express from "express";
import { ServerSocket } from "./socket.ts";
import { AddressInfo } from "net";

const application = express();

/** Server Handling */
const httpServer = http.createServer(application);

/** Start Socket */
new ServerSocket(httpServer);

/** Listen */
httpServer.listen(1337, "localhost", () => {
  let address = httpServer.address() as AddressInfo;
  console.info(`Server is running at ${address.address}:${address.port}`);
});
