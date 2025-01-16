//Stolen from https://github.com/joeythelantern/Socket-IO-Basics

import { Server as HttpServer } from "http";
import { Socket, Server } from "socket.io";
import { v4 } from "uuid";

type Game = {
  id: string;
  name: string;
  numberOfPlayers: number;
  maxNumberOfPlayers: number;
};
export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;

  /** Master list of all connected users */
  public users: { [uid: string]: string };

  /** Master list of all public games */
  public games: { [uid: string]: Game };

  constructor(server: HttpServer) {
    ServerSocket.instance = this;
    this.users = {};
    this.games = {};
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
      (
        callback: (
          reconnect: boolean,
          uid: string,
          users: string[],
          gameId: string
        ) => void
      ) => {
        console.info("Handshake received from: " + socket.id);

        /* Check if this is a reconnection */
        const reconnected = Object.values(this.users).includes(socket.id);

        if (reconnected) {
          console.info("This user has reconnected.");

          const uid = this.GetUidFromSocketID(socket.id);
          const users = Object.values(this.users);

          if (uid) {
            console.info("Sending callback for reconnect ...");
            const game = this.games[uid];
            let gameId = "";
            if (game) {
              gameId = game.id;
            }
            callback(reconnected, "", [], gameId);
          }
          return;
        }

        /* Generate a new user */
        const uid = v4();
        this.users[uid] = socket.id;

        const users = Object.values(this.users);
        console.info("Sending callback for handshake ...");
        callback(reconnected, uid, users, "");

        /* Send new user to all connected users */
        this.SendMessage(
          "user_connected",
          users.filter((id) => id !== socket.id),
          socket.id
        );
      }
    );

    /* DISCONNECT */
    socket.on("disconnect", () => {
      console.info("Disconnect received from: " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);

      if (uid) {
        delete this.users[uid];
        const game = this.games[uid];
        delete this.games[uid];

        const users = Object.values(this.users);

        let gameId = "";
        if (game) {
          gameId = game.id;
        }

        this.SendMessage("user_disconnected", users, [socket.id, gameId]);
      }
    });

    /* LOBBY */
    socket.on("join_lobby", (uid: string) => {
      socket.join("Lobby");

      const games = Object.values(this.games);

      this.SendMessage("joined_lobby", [this.users[uid]], games);
    });

    /* NEW GAME */
    socket.on("create_game", (uid: string, game: Game) => {
      game.id = v4();
      const existingGame = this.games[uid];
      this.games[uid] = game;

      if (existingGame) {
        this.SendMessage("remove_game", ["Lobby"], existingGame.id);
      }

      this.SendMessage("add_game", ["Lobby"], game);
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
