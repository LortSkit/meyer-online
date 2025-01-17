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

export type GameRequest = {
  name: string;
  maxNumberOfPlayers: number;
};

function gameRequestToGame(gameRequest: GameRequest): Game {
  return {
    id: v4(),
    name: gameRequest.name,
    numberOfPlayers: 0,
    maxNumberOfPlayers: gameRequest.maxNumberOfPlayers,
  };
}

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;

  public users: { [uid: string]: string };

  public games: { [uid: string]: Game };
  public gamesIdIndex: { [gameId: string]: string };
  public publicGames: { [uid: string]: string };

  constructor(server: HttpServer) {
    ServerSocket.instance = this;
    this.users = {};
    this.games = {};
    this.gamesIdIndex = {};
    this.publicGames = {};
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
          userstotal: number,
          gameId: string
        ) => void
      ) => {
        console.info("Handshake received from: " + socket.id);

        /* Check if this is a reconnection */
        const reconnected = Object.values(this.users).includes(socket.id);

        if (reconnected) {
          console.info("This user has reconnected.");

          const uid = this.GetUidFromSocketID(socket.id);

          if (uid) {
            console.info("Sending callback for reconnect ...");
            const game = this.games[uid];
            let gameId = "";
            if (game) {
              gameId = game.id;
            }
            callback(reconnected, "", -1, gameId);
          }
          return;
        }

        /* Generate a new user */
        const uid = v4();
        this.users[uid] = socket.id;

        const users = Object.values(this.users);
        console.info("Sending callback for handshake ...");
        callback(reconnected, uid, users.length, "");

        /* Send new user to all connected users */
        this.SendMessage(
          "user_connected",
          users.filter((id) => id !== socket.id),
          users.length
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
        const publicGame = this.publicGames[uid];

        delete this.games[uid];
        delete this.publicGames[uid];

        if (game) {
          delete this.gamesIdIndex[game.id];
        }

        const users = Object.values(this.users);

        let gameId = "";
        if (publicGame) {
          gameId = game.id;
        }

        this.SendMessage("user_disconnected", users, [users.length, gameId]);
      }
    });

    /* LOBBY */
    socket.on("join_lobby", (uid: string) => {
      socket.join("Lobby");

      const publicGamesFiltered: [string, Game][] = Object.entries(
        this.games
      ).filter(([uid, game]) => {
        return this.publicGames[uid] === game.id;
      });

      const publicGamesDict: { [uid: string]: Game } =
        Object.fromEntries(publicGamesFiltered);

      const publicGames: Game[] = Object.values(publicGamesDict);

      this.SendMessage("joined_lobby", [this.users[uid]], publicGames);
    });

    /* NEW GAME */
    socket.on(
      "create_game",
      (
        uid: string,
        gameRequest: GameRequest,
        isPublic: boolean,
        callback: (gameId: string) => void
      ) => {
        const game = gameRequestToGame(gameRequest);
        const existingGame = this.games[uid];
        this.games[uid] = game;
        this.gamesIdIndex[game.id] = uid;

        if (existingGame) {
          this.SendMessage("remove_game", ["Lobby"], existingGame.id);
        }

        if (isPublic) {
          this.publicGames[uid] = game.id;
          this.SendMessage("add_game", ["Lobby"], game);
        }
        callback(game.id);
      }
    );

    /* JOIN GAME */
    socket.on(
      "join_game",
      (gameId: string, callback: (exists: boolean) => void) => {
        const uid = this.gamesIdIndex[gameId];
        let exists = false;
        if (uid) {
          exists = true;
          socket.join(gameId);
          callback(exists);
          return;
        }
        callback(false);
      }
    );
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
