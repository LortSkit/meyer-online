//Stolen from https://github.com/joeythelantern/Socket-IO-Basics

import { Server as HttpServer } from "http";
import { Socket, Server } from "socket.io";
import { v4 } from "uuid";

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;

  /** Master list of all connected users */
  public users: { [uid: string]: string };

  constructor(server: HttpServer) {
    ServerSocket.instance = this;
    this.users = {};
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: "*", //TODO: Insecure, should be changed before production!!
      },
    });

    this.io.on("connect", this.StartListeners);

    console.info("Socket IO started.");
  }

  StartListeners = (socket: Socket) => {
    console.info("Message received from " + socket.id);

    /* HANDSHAKE */
    socket.on(
      "handshake",
      (callback: (uid: string, users: string[]) => void) => {
        console.info("Handshake received from: " + socket.id);

        /* Check if this is a reconnection */
        const reconnected = Object.values(this.users).includes(socket.id);

        if (reconnected) {
          console.info("This user has reconnected.");

          const uid = this.GetUidFromSocketID(socket.id);
          const users = Object.values(this.users);

          if (uid) {
            console.info("Sending callback for reconnect ...");
            callback(uid, users);
            return;
          }
        }

        /* Generate a new user */
        const uid = v4();
        this.users[uid] = socket.id;

        const users = Object.values(this.users);
        console.info("Sending callback for handshake ...");
        callback(uid, users);

        /* Send new user to all connected users */
        this.SendMessage(
          "user_connected",
          users.filter((id) => id !== socket.id),
          users
        );
      }
    );

    /* DISCONNECT */
    socket.on("disconnect", () => {
      console.info("Disconnect received from: " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);

      if (uid) {
        delete this.users[uid];

        const users = Object.values(this.users);

        this.SendMessage("user_disconnected", users, socket.id);
      }
    });
  };

  // StartListeners = (socket: Socket) => {
  GetUidFromSocketID = (id: string) => {
    return Object.keys(this.users).find((uid) => this.users[uid] === id);
  };

  /**
   * Sender a message through the socket
   * @param name The name of the event, ex: handshake
   * @param users List of socket id's
   * @param payload any information needed by the user for state updates
   */
  SendMessage = (name: string, users: string[], payload?: Object) => {
    console.info("Emitting event: " + name + " to", users);
    users.forEach((id) =>
      payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)
    );
  };
}
