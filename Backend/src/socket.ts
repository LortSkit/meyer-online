//Stolen from https://github.com/joeythelantern/Socket-IO-Basics

import { Server as HttpServer } from "http";
import { Socket, Server } from "socket.io";
import { v4 } from "uuid";
import { frontendURL } from "./environmentUtils";

type Game = {
  id: string;
  name: string;
  players: string[];
  maxNumberOfPlayers: number;
};

type GameBase = {
  id: string;
  name: string;
  maxNumberOfPlayers: number;
};

type GameDisplay = {
  id: string;
  name: string;
  numberOfPlayers: number;
  maxNumberOfPlayers: number;
};

type GameRequest = {
  name: string;
  maxNumberOfPlayers: number;
};

type Room = "Lobby" | "Create" | "Game";

function gameRequestToGameBase(gameRequest: GameRequest): GameBase {
  return {
    id: v4(),
    name: gameRequest.name,
    maxNumberOfPlayers: gameRequest.maxNumberOfPlayers,
  };
}

function gameBaseToGame(gameBase: GameBase): Game {
  return {
    id: gameBase.id,
    name: gameBase.name,
    players: [],
    maxNumberOfPlayers: gameBase.maxNumberOfPlayers,
  };
}

function gameBaseToGameDisplay(gameBase: GameBase): GameDisplay {
  return {
    id: gameBase.id,
    name: gameBase.name,
    numberOfPlayers: 0,
    maxNumberOfPlayers: gameBase.maxNumberOfPlayers,
  };
}

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;

  public users: { [uid: string]: string };

  public gameBases: { [uid: string]: GameBase };
  public gamesIdIndex: { [gameId: string]: string }; //gameId -> uid
  public gamePlayers: { [gameId: string]: string[] }; //gameId -> uid[]
  public playerInGame: { [uid: string]: string }; // uid -> gameId
  public publicGames: { [uid: string]: string }; // uid -> gameId

  public inRoom: { [uid: string]: Room };

  constructor(server: HttpServer) {
    ServerSocket.instance = this;
    this.users = {};
    this.gameBases = {};
    this.gamesIdIndex = {};
    this.gamePlayers = {};
    this.playerInGame = {};
    this.publicGames = {};

    this.inRoom = {};

    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: frontendURL,
      },
    });

    this.io.on("connect", this.StartListeners);

    console.info("Socket IO started.");
  }

  public removeUserFromGamesAndRoom(uid: string): void {
    const game = this.gameBases[uid];
    const inGameId = this.playerInGame[uid];
    const inGameOwnerUid = this.gamesIdIndex[inGameId];

    if (inGameId) {
      this.gamePlayers[inGameId] = this.gamePlayers[inGameId].filter(
        (value: string) => value !== uid
      );

      if (inGameOwnerUid === uid) {
        this.SendMessage("game_owner_left", [inGameId]);
        if (this.gameIsPublic(inGameId)) {
          this.SendMessage("remove_game", ["Lobby"], inGameId);
        }
      } else if (this.gameIsPublic(inGameId)) {
        this.SendMessage(
          "update_game_num_players",
          ["Lobby"],
          [inGameId, this.gamePlayers[inGameId].length]
        );
      }
    }

    delete this.gameBases[uid];
    delete this.gamesIdIndex[game?.id];
    delete this.publicGames[uid];
    delete this.playerInGame[uid];
    delete this.inRoom[uid];
  }

  public getPublicGameDisplays(): GameDisplay[] {
    const publicGamesFiltered: [string, GameBase][] = Object.entries(
      this.gameBases
    ).filter(([uid, game]) => {
      return this.publicGames[uid] === game.id;
    });

    const publicGamesDict: { [uid: string]: GameBase } =
      Object.fromEntries(publicGamesFiltered);

    const publicGamesBases: GameBase[] = Object.values(publicGamesDict);

    const publicGames = publicGamesBases.map((value: GameBase) => {
      let gameDisplay = gameBaseToGameDisplay(value);
      gameDisplay.numberOfPlayers = this.gamePlayers[gameDisplay.id].length;
      return gameDisplay;
    });

    return publicGames;
  }

  public gameExists(gameId: string): boolean {
    if (this.gamesIdIndex[gameId]) {
      return true;
    }

    return false;
  }

  public gameIsPublic(gameId: string): boolean {
    if (!this.gameExists(gameId)) {
      return false;
    }

    if (this.publicGames[this.gamesIdIndex[gameId]]) {
      return true;
    }

    return false;
  }

  public leavePreviousRoom(socket: Socket, uid: string): void {
    const previousRoom = this.inRoom[uid];

    if (previousRoom) {
      if (previousRoom === "Game") {
        const gameToLeave = this.playerInGame[uid];
        socket.leave(gameToLeave);
        this.removeUserFromGamesAndRoom(uid);
        if (this.gamesIdIndex[gameToLeave] === uid) {
          this.SendMessage("game_owner_left", [gameToLeave]);
        } else {
          //TODO: tell other party member you've left
        }
      } else {
        socket.leave(previousRoom);
      }
    }
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
            const gameBase = this.gameBases[uid];
            let gameId = "";
            if (gameBase) {
              gameId = gameBase.id;
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
        this.removeUserFromGamesAndRoom(uid);
        delete this.users[uid];

        const users = Object.values(this.users);

        this.SendMessage("user_disconnected", users, [users.length]);
      }
    });

    /* LOBBY */
    socket.on("join_lobby", (uid: string) => {
      console.info("Received event: join_lobby from " + socket.id);

      this.leavePreviousRoom(socket, uid); //Make sure we are always only in one new room

      socket.join("Lobby");
      this.inRoom[uid] = "Lobby";

      this.SendMessage(
        "joined_lobby",
        [this.users[uid]],
        this.getPublicGameDisplays()
      );
    });

    /* CREATE */
    socket.on("join_create", (uid: string) => {
      console.info("Received event: join_create from " + socket.id);
      this.leavePreviousRoom(socket, uid); //Make sure we are always only in one new room

      socket.join("Create");
      this.inRoom[uid] = "Create";
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
        console.info("Received event: create_game from " + socket.id);

        const gameBase = gameRequestToGameBase(gameRequest);
        const game = gameBaseToGame(gameBase);
        const existingGame = this.gameBases[uid];
        const existingGameIsPublic = this.gameIsPublic(existingGame?.id);

        const currentRoom = this.inRoom[uid];

        if (currentRoom === "Create") {
          this.gameBases[uid] = game;
          this.gamesIdIndex[game.id] = uid;
          this.gamePlayers[game.id] = [];
        }

        if (existingGameIsPublic) {
          this.SendMessage("remove_game", ["Lobby"], existingGame?.id);
          delete this.publicGames[uid];
        }

        if (isPublic) {
          const gameDisplay = gameBaseToGameDisplay(gameBase);
          this.publicGames[uid] = game.id;

          if (currentRoom === "Create") {
            this.SendMessage("add_game", ["Lobby"], gameDisplay);
          }
        }

        if (currentRoom === "Create") {
          callback(game.id);
        } else {
          callback("");
        }
      }
    );

    /* JOIN GAME */
    socket.on(
      "join_game",
      (
        joiningUid: string,
        gameId: string,
        callback: (exists: boolean, enoughSpace: boolean) => void
      ) => {
        console.info("Received event: join_game from " + socket.id);

        const uid = this.gamesIdIndex[gameId];
        let exists = false;
        if (uid) {
          exists = true;

          if (!this.gamePlayers[gameId].includes(joiningUid)) {
            const hasEnoughSpace =
              this.gamePlayers[gameId].length <
              this.gameBases[uid].maxNumberOfPlayers;

            if (!hasEnoughSpace) {
              callback(exists, hasEnoughSpace);
              return;
            }
            this.leavePreviousRoom(socket, joiningUid);
            socket.join(gameId);
            this.inRoom[joiningUid] = "Game";

            callback(exists, hasEnoughSpace);

            this.playerInGame[joiningUid] = gameId;
            this.gamePlayers[gameId].push(joiningUid);

            if (this.gameIsPublic(gameId)) {
              this.SendMessage(
                "update_game_num_players",
                ["Lobby"],
                [gameId, this.gamePlayers[gameId].length]
              );
            }
          }

          return;
        }
        callback(false, false);
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
