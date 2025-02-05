//Stolen basics from https://github.com/joeythelantern/Socket-IO-Basics

import { Server as HttpServer } from "http";
import { Socket, Server } from "socket.io";
import { v4 } from "uuid";
import { frontendURL } from "./environmentUtils";
import { Meyer } from "./Meyer/gameLogic";
import { Action, TurnInfo } from "./Meyer/gameTypes";

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

type GameInfo = {
  id: string;
  name: string;
  gamePlayers: string[];
  gamePlayersNames: string[];
  maxNumberOfPlayers: number;
  isPublic: boolean;
  isInProgress: boolean;
};

type GameRequest = {
  name: string;
  maxNumberOfPlayers: number;
};

type MeyerInfo = {
  round: number;
  turn: number;
  isGameOver: boolean;
  healths: number[];
  currentPlayer: string;
  roll: number;
  actionChoices: Action[];
  bluffChoices: number[];
  turnInformation: TurnInfo[];
};

const MeyerInfoDefault: MeyerInfo = {
  round: 1,
  turn: 1,
  isGameOver: false,
  healths: [],
  currentPlayer: "",
  roll: -1,
  actionChoices: [],
  bluffChoices: [],
  turnInformation: [],
};

type Room = "Find" | "Create" | "Game";

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

function gameBaseToGameInfo(gameBase: GameBase): GameInfo {
  return {
    id: gameBase.id,
    name: gameBase.name,
    gamePlayers: [],
    gamePlayersNames: [],
    maxNumberOfPlayers: gameBase.maxNumberOfPlayers,
    isPublic: false,
    isInProgress: false,
  };
}

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;

  public users: { [uid: string]: string }; // uid -> socket.id

  public gameBases: { [uid: string]: GameBase }; // uid -> GameBase
  public gamesIdIndex: { [gameId: string]: string }; // gameId -> uid
  public gamePlayers: { [gameId: string]: string[] }; // gameId -> uid[]
  public gamePlayersNames: { [gameId: string]: string[] }; // gameId -> string[]
  public playerInGame: { [uid: string]: string }; // uid -> gameId
  public publicGames: { [uid: string]: string }; // uid -> gameId
  public gameMeyer: { [gameId: string]: Meyer }; //gameId -> Meyer

  public inRoom: { [uid: string]: Room }; //uid -> Room

  constructor(server: HttpServer) {
    ServerSocket.instance = this;
    this.users = {};
    this.gameBases = {};
    this.gamesIdIndex = {};
    this.gamePlayers = {};
    this.gamePlayersNames = {};
    this.playerInGame = {};
    this.publicGames = {};
    this.gameMeyer = {};

    this.inRoom = {};

    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: frontendURL,
        allowedHeaders: "*:*",
        credentials: true,
        optionsSuccessStatus: 200,
        preflightContinue: true,
      },
    });

    this.io.on("connect", this.StartListeners);

    console.info("Socket IO started.");
  }

  ////////////////////////////////////HELPER FUNCTIONS////////////////////////////////////
  GetUidFromSocketID = (id: string) => {
    return Object.keys(this.users).find((uid) => this.users[uid] === id);
  };

  SendMessage = (name: string, users: string[], payload?: Object) => {
    if (!payload) {
      console.info("Emitting event: " + name + " to", users);
    } else {
      console.info(
        "Emitting event: " + name + " to " + users + " with with payload",
        payload
      );
    }
    users.forEach((id) =>
      payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)
    );
  };

  public removeUserFromGamesAndRoom(uid: string): void {
    const game = this.gameBases[uid];
    const inGameId = this.playerInGame[uid];
    const inGameOwnerUid = this.gamesIdIndex[inGameId];

    if (inGameId) {
      let playerIndex = this.gamePlayers[inGameId].findIndex(
        (value) => value === uid
      );

      this.gamePlayers[inGameId] = this.gamePlayers[inGameId].filter(
        (value, index) => index !== playerIndex
      );
      this.gamePlayersNames[inGameId] = this.gamePlayersNames[inGameId].filter(
        (value, index) => index !== playerIndex
      );

      if (inGameOwnerUid === uid) {
        /* Game */
        this.SendMessage("game_owner_left", [inGameId]);
        if (this.gameIsPublic(inGameId)) {
          /* Find */
          this.SendMessage("remove_game", ["Find"], inGameId);
        }
      } else if (this.gameIsPublic(inGameId)) {
        /* Find */
        this.SendMessage(
          "update_game_num_players",
          ["Find"],
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

  public gameIsInProgress(gameId: string): boolean {
    if (!this.gameExists(gameId)) {
      return false;
    }

    if (this.gameMeyer[gameId]) {
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
          /* Game */
          this.SendMessage("game_owner_left", [gameToLeave]);
        } else {
          /* Game */
          this.SendMessage("player_left", [gameToLeave], uid);
        }
      } else {
        socket.leave(previousRoom);
      }
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////

  StartListeners = (socket: Socket) => {
    console.info("Message received from " + socket.id);

    ////////////////////////////////////////BUILT-IN////////////////////////////////////////
    /* HANDSHAKE - Happens on socket contact */
    /* From Room: (All) */
    /* Sends to: (All) */
    socket.on(
      "handshake",
      (
        callback: (reconnect: boolean, uid: string, userstotal: number) => void
      ) => {
        console.info("Handshake received from: " + socket.id);

        /* Check if this is a reconnection */
        const reconnected = Object.values(this.users).includes(socket.id);

        if (reconnected) {
          console.info("This user has reconnected.");

          const uid = this.GetUidFromSocketID(socket.id);
          socket.join(uid);

          if (uid) {
            console.info("Sending callback for reconnect ...");
            const gameBase = this.gameBases[uid];
            let gameId = "";
            if (gameBase) {
              gameId = gameBase.id;
            }
            const users = Object.values(this.users);
            callback(reconnected, uid, users.length);
          }
          return;
        }

        /* Generate a new user */
        const uid = v4();
        this.users[uid] = socket.id;

        socket.join(uid);

        const users = Object.values(this.users);
        console.info("Sending callback for handshake ...");
        callback(reconnected, uid, users.length);

        /* Send new user to all connected users */
        /* (ALL) */
        this.SendMessage(
          "user_connected",
          users.filter((id) => id !== socket.id),
          users.length
        );
      }
    );

    /* DISCONNECT - Happens on socket disconnect*/
    /* From Room: (All) */
    /* Sends to: Game, (All) */
    socket.on("disconnect", () => {
      console.info("Disconnect received from: " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);

      if (uid) {
        const gameToLeave = this.playerInGame[uid];
        this.removeUserFromGamesAndRoom(uid);
        delete this.users[uid];

        const users = Object.values(this.users);

        if (gameToLeave) {
          /* Game */
          this.SendMessage("player_left", [gameToLeave], uid);
        }

        /* (All) */
        this.SendMessage("user_disconnected", users, users.length);
      }
    });
    ////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////FIND//////////////////////////////////////////
    /* FIND - Happens when user goes to /find */
    /* From Room: Find */
    /* Sends to: (User)
       Through leavePreviousRoom call: Game, Find
    */
    socket.on("join_find", () => {
      console.info("Received event: join_find from " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);
      if (uid) {
        this.leavePreviousRoom(socket, uid); //Make sure we are always only in one new room

        socket.join("Find");
        this.inRoom[uid] = "Find";

        /* (User) */
        this.SendMessage(
          "joined_find",
          [this.users[uid]],
          this.getPublicGameDisplays()
        );
      }
    });
    ////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////CREATE/////////////////////////////////////////
    /* CREATE - Happens when user goes to /create/online */
    /* From Room: Create */
    /* Sends to: (None)
       Through leavePreviousRoom call: Game, Find
    */
    socket.on("join_create", () => {
      console.info("Received event: join_create from " + socket.id);
      const uid = this.GetUidFromSocketID(socket.id);
      if (uid) {
        this.leavePreviousRoom(socket, uid); //Make sure we are always only in one new room

        socket.join("Create");
        this.inRoom[uid] = "Create";
      }
    });

    /* NEW GAME - Happens when user creates game from /create/online */
    /* From Room: Create */
    /* Sends to: Find */
    socket.on(
      "create_game",
      (
        gameRequest: GameRequest,
        isPublic: boolean,
        callback: (gameId: string) => void
      ) => {
        console.info("Received event: create_game from " + socket.id);

        const uid = this.GetUidFromSocketID(socket.id);
        if (uid) {
          const gameBase = gameRequestToGameBase(gameRequest);
          const game = gameBaseToGame(gameBase);
          const existingGame = this.gameBases[uid];
          const existingGameIsPublic = this.gameIsPublic(existingGame?.id);

          const currentRoom = this.inRoom[uid];

          if (
            currentRoom === "Create" &&
            0 < gameRequest.name.length &&
            gameRequest.name.length <= 25
          ) {
            this.gameBases[uid] = game;
            this.gamesIdIndex[game.id] = uid;
            this.gamePlayers[game.id] = [];
            this.gamePlayersNames[game.id] = [];
          }

          if (existingGameIsPublic) {
            /* Find */
            this.SendMessage("remove_game", ["Find"], existingGame?.id);
            delete this.publicGames[uid];
          }

          if (isPublic) {
            const gameDisplay = gameBaseToGameDisplay(gameBase);
            this.publicGames[uid] = game.id;

            if (currentRoom === "Create") {
              /* Find */
              this.SendMessage("add_game", ["Find"], gameDisplay);
            }
          }

          if (
            currentRoom === "Create" &&
            0 < gameRequest.name.length &&
            gameRequest.name.length <= 25
          ) {
            callback(game.id);
          } else {
            callback("");
          }
        }
      }
    );
    ////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////GAME//////////////////////////////////////////
    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%LOBBY%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
    /* JOIN GAME - Happens when user joins game link */
    /* From Room: Game */
    /* Sends to: Game, (User), Find
       Through leavePreviousRoom call: Game, Find
    */
    socket.on(
      "join_game",
      (
        gameId: string,
        chosenPlayerName: string,
        callback: (
          exists: boolean,
          inProgress: boolean,
          enoughSpace: boolean
        ) => void
      ) => {
        console.info("Received event: join_game from " + socket.id);

        const joiningUid = this.GetUidFromSocketID(socket.id);
        if (joiningUid) {
          const uid = this.gamesIdIndex[gameId];
          let exists = false;
          if (uid) {
            exists = true;

            if (!this.gamePlayers[gameId].includes(joiningUid)) {
              const hasEnoughSpace =
                this.gamePlayers[gameId].length <
                this.gameBases[uid].maxNumberOfPlayers;

              if (this.gameIsInProgress(gameId)) {
                callback(exists, true, false);
              } else if (!hasEnoughSpace) {
                callback(exists, false, false);
                return;
              }
              const playerName =
                chosenPlayerName.length === 0 || chosenPlayerName.length > 12
                  ? ""
                  : chosenPlayerName;

              /* Game */
              this.SendMessage(
                "player_joined",
                [gameId],
                [joiningUid, playerName]
              );

              this.leavePreviousRoom(socket, joiningUid);
              socket.join(gameId);
              this.inRoom[joiningUid] = "Game";

              this.playerInGame[joiningUid] = gameId;
              this.gamePlayers[gameId].push(joiningUid);
              this.gamePlayersNames[gameId].push(playerName);

              callback(exists, false, hasEnoughSpace);

              /* (User) */
              this.SendMessage(
                "joined_game",
                [joiningUid],
                [
                  {
                    ...gameBaseToGameInfo(
                      this.gameBases[this.gamesIdIndex[gameId]]
                    ),
                    gamePlayers: this.gamePlayers[gameId],
                    gamePlayersNames: this.gamePlayersNames[gameId],
                    isPublic: this.gameIsPublic(gameId),
                    isInProgress: this.gameIsInProgress(gameId),
                  } as GameInfo,
                  this.gamePlayers[gameId],
                  this.gamePlayersNames[gameId],
                ]
              );

              if (this.gameIsPublic(gameId)) {
                /* Find */
                this.SendMessage(
                  "update_game_num_players",
                  ["Find"],
                  [gameId, this.gamePlayers[gameId].length]
                );
              }
            }

            return;
          }
          callback(false, true, false);
        }
      }
    );

    /* CHANGE NAME - Happens when a player edits their name and presses 'enter' */
    /* From Room: Game */
    /* Sends to: Game */
    socket.on("change_player_name", (chosenPlayerName: string) => {
      console.info("Received event: change_player_name from " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);
      if (uid) {
        const playerName =
          chosenPlayerName.length === 0 || chosenPlayerName.length > 12
            ? ""
            : chosenPlayerName;

        const inGameId = this.playerInGame[uid];
        if (inGameId && !this.gameIsInProgress(inGameId)) {
          if (playerName === "" || !inGameId) {
            return;
          }

          const playerIndex = this.gamePlayers[inGameId].findIndex(
            (value) => value === uid
          );

          this.gamePlayersNames[inGameId][playerIndex] = playerName;

          /* Game */
          this.SendMessage(
            "player_name_changed",
            [inGameId],
            [uid, playerName]
          );
        }
      }
    });

    /* CHANGE LOBBY NAME - Happens when the lobby owner edits the lobby name and presses 'enter' */
    /* From Room: Game */
    /* Sends to: Game, Find */
    socket.on("change_lobby_name", (newLobbyName: string) => {
      console.info("Received event: change_lobby_name from " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);
      if (uid) {
        const owningGame = this.gameBases[uid];
        if (
          owningGame &&
          !this.gameIsInProgress(owningGame.id) &&
          0 < newLobbyName.length &&
          newLobbyName.length <= 25
        ) {
          this.gameBases[uid].name = newLobbyName;

          /* Game */
          this.SendMessage("lobby_name_changed", [owningGame.id], newLobbyName);
          if (this.gameIsPublic(owningGame.id)) {
            /* Find */
            this.SendMessage(
              "update_game_name",
              ["Find"],
              [owningGame.id, newLobbyName]
            );
          }
        }
      }
    });

    /* CHANGE MAX NUMBER OF PLAYERS - Happens when the lobby owner edits the number of max players */
    /* From Room: Game */
    /* Sends to: (User), Game, Find 
       Through leavePreviousRoom call: Game, Find
    */
    socket.on("change_max_players", (newMaxNumberOfPlayers) => {
      console.info("Received event: change_max_players from " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);
      if (uid) {
        const owningGame = this.gameBases[uid];
        if (
          owningGame &&
          !this.gameIsInProgress(owningGame.id) &&
          1 < newMaxNumberOfPlayers &&
          newMaxNumberOfPlayers <= 20
        ) {
          this.gameBases[uid].maxNumberOfPlayers = newMaxNumberOfPlayers;

          if (this.gamePlayers[owningGame.id].length > newMaxNumberOfPlayers) {
            const playersToKick = this.gamePlayers[owningGame.id].slice(
              newMaxNumberOfPlayers,
              this.gamePlayers[owningGame.id].length
            );
            playersToKick.forEach((uid) => {
              this.leavePreviousRoom(socket, uid);
            }); //kicks them

            /* (User) */
            this.SendMessage("been_kicked", playersToKick); //Informs them they've been kicked

            if (this.gameIsPublic(owningGame.id)) {
              /* Find */
              this.SendMessage(
                "update_game_num_players",
                ["Find"],
                [owningGame.id, this.gamePlayers[owningGame.id].length]
              );
            }
          }

          /* Game */
          this.SendMessage(
            "max_players_changed",
            [owningGame.id],
            newMaxNumberOfPlayers
          );
          if (this.gameIsPublic(owningGame.id)) {
            /* Find */
            this.SendMessage(
              "update_max_players",
              ["Find"],
              [owningGame.id, newMaxNumberOfPlayers]
            );
          }
        }
      }
    });

    /* TOGGLE PUBLIC/PRIVATE - Happens when the lobby owner clicks the public/private button */
    /* From Room: Game */
    /* Sends to: Find, Game */
    socket.on("toggle_public_private", () => {
      console.info("Received event: toggle_public_private from " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);
      if (uid) {
        const owningGame = this.gameBases[uid];
        if (owningGame && !this.gameIsInProgress(owningGame.id)) {
          if (this.gameIsPublic(owningGame.id)) {
            delete this.publicGames[uid];

            /* Find */
            this.SendMessage("remove_game", ["Find"], owningGame.id);

            /* Game */
            this.SendMessage("change_game_private", [owningGame.id]);
          } else {
            this.publicGames[uid] = owningGame.id;

            const gameDisplay = gameBaseToGameDisplay(owningGame);
            gameDisplay.numberOfPlayers =
              this.gamePlayers[owningGame.id].length;

            /* Find */
            this.SendMessage("add_game", ["Find"], gameDisplay);

            /* Game */
            this.SendMessage("change_game_public", [owningGame.id]);
          }
        }
      }
    });

    /* START GAME */
    /* From Room: Game */
    /* Sends to: (User), Find */
    socket.on("start_game", () => {
      console.info("Received event: start_game from " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);
      if (uid) {
        const owningGame = this.gameBases[uid];
        if (
          owningGame &&
          !this.gameIsInProgress(owningGame.id) &&
          this.gamePlayers[owningGame.id].length > 1
        ) {
          this.gameMeyer[owningGame.id] = new Meyer(
            this.gamePlayers[owningGame.id]
          );
          const currentPlayer =
            this.gameMeyer[owningGame.id].getCurrentPlayerUid();
          const restPlayers = this.gamePlayers[owningGame.id].filter(
            (value) => value !== currentPlayer
          );
          /* (User) */
          this.SendMessage("game_started", [currentPlayer], {
            ...MeyerInfoDefault,
            healths: this.gameMeyer[owningGame.id].getCurrentHealths(),
            currentPlayer: currentPlayer,
            actionChoices: this.gameMeyer[owningGame.id].getActionChoices(),
          });

          /* (User) */
          this.SendMessage("game_started", restPlayers, {
            ...MeyerInfoDefault,
            healths: this.gameMeyer[owningGame.id].getCurrentHealths(),
            currentPlayer: currentPlayer,
          });

          if (this.gameIsPublic(owningGame.id)) {
            delete this.publicGames[uid];
            /* Find */
            this.SendMessage("game_in_progress", ["Find"], owningGame.id);
          }
        }
      }
    });

    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%IN GAME%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%MIXED%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

    /* KICK PLAYER - Happens when lobby owner presses the x-button next to a player's name */
    /* From Room: Game */
    /* Sends to: (User), Game */
    socket.on("kick_player", (kickingUid: string) => {
      console.info("Received event: kick_player from " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);
      if (uid) {
        const owningGame = this.gameBases[uid];
        if (owningGame) {
          this.removeUserFromGamesAndRoom(kickingUid);

          if (this.gameIsInProgress(owningGame.id)) {
            this.gameMeyer[owningGame.id].playerLeft(kickingUid);
          }

          /* (User) */
          this.SendMessage("been_kicked", [kickingUid]); //Informs them they've been kicked

          /* Game */
          this.SendMessage("player_left", [owningGame.id], kickingUid);
        }
      }
    });
    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
    ////////////////////////////////////////////////////////////////////////////////////////
  };
}
