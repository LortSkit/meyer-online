//Stolen basics from https://github.com/joeythelantern/Socket-IO-Basics

import { Server as HttpServer } from "http";
import { Socket, Server } from "socket.io";
import { v4 } from "uuid";
import { frontendURL, frontendWWWURL, socketURL } from "./environmentUtils";
import { Meyer } from "./Meyer/gameLogic";
import { Action } from "./Meyer/gameTypes";

type GameBase = {
  id: string;
  name: string;
  owner: string;
  maxNumberOfPlayers: number;
  healthRollRuleSet: number;
};

type GameDisplay = {
  id: string;
  name: string;
  numberOfPlayers: number;
  maxNumberOfPlayers: number;
  healthRollRuleSet: number;
};

type GameInfo = {
  id: string;
  name: string;
  owner: string;
  gamePlayers: string[];
  gamePlayersNames: string[];
  gamePlayersOrder: number[];
  gamePlayersTimeout: string[];
  maxNumberOfPlayers: number;
  healthRollRuleSet: number;
  isPublic: boolean;
  isInProgress: boolean;
};

type GameRequest = {
  name: string;
  maxNumberOfPlayers: number;
  healthRollRuleSet: number;
};

type Room = "Find" | "Create" | "Game";

function gameRequestToGameBase(gameRequest: GameRequest): GameBase {
  return {
    id: v4(),
    name: gameRequest.name,
    owner: "",
    maxNumberOfPlayers: gameRequest.maxNumberOfPlayers,
    healthRollRuleSet: gameRequest.healthRollRuleSet,
  };
}

function gameBaseToGameDisplay(gameBase: GameBase): GameDisplay {
  return {
    id: gameBase.id,
    name: gameBase.name,
    numberOfPlayers: 0,
    maxNumberOfPlayers: gameBase.maxNumberOfPlayers,
    healthRollRuleSet: gameBase.healthRollRuleSet,
  };
}

function gameBaseToGameInfo(gameBase: GameBase): GameInfo {
  return {
    id: gameBase.id,
    name: gameBase.name,
    owner: gameBase.owner,
    gamePlayers: [],
    gamePlayersNames: [],
    gamePlayersOrder: [],
    gamePlayersTimeout: [],
    maxNumberOfPlayers: gameBase.maxNumberOfPlayers,
    healthRollRuleSet: gameBase.healthRollRuleSet,
    isPublic: false,
    isInProgress: false,
  };
}

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;

  public users: { [uid: string]: string }; // uid -> socket.id
  public userTimeout: { [uid: string]: NodeJS.Timeout }; // uid -> timer

  public gameBases: { [uid: string]: GameBase }; // uid -> GameBase
  public gamesIdIndex: { [gameId: string]: string }; // gameId -> uid
  public gamePlayers: { [gameId: string]: string[] }; // gameId -> uid[]
  public gamePlayersNames: { [gameId: string]: string[] }; // gameId -> string[]
  public gamePlayersOrder: { [gameId: string]: number[] }; // gameId -> number[]
  public playerInGame: { [uid: string]: string }; // uid -> gameId
  public publicGames: { [uid: string]: string }; // uid -> gameId
  public gameMeyer: { [gameId: string]: Meyer }; //gameId -> Meyer

  public inRoom: { [uid: string]: Room }; //uid -> Room

  constructor(server: HttpServer) {
    ServerSocket.instance = this;
    this.users = {};
    this.userTimeout = {};
    this.gameBases = {};
    this.gamesIdIndex = {};
    this.gamePlayers = {};
    this.gamePlayersNames = {};
    this.gamePlayersOrder = {};
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
        origin: [frontendURL, frontendWWWURL, socketURL],
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
    if (!payload && payload !== 0) {
      console.info("Emitting event: " + name + " to", users);
    } else {
      console.info(
        "Emitting event: " + name + " to " + users + " with payload",
        payload,
      );
    }
    users.forEach((id) =>
      payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name),
    );
  };

  public deleteErroneousSocketUser(socketId: string): void {
    const erroneousEntry = Object.entries(this.users).find(
      (value) => value[1] === socketId,
    );

    if (erroneousEntry) {
      delete this.users[erroneousEntry[0]];
    }
  }

  public removeUserFromGamesAndRoom(uid: string): void {
    const game = this.gameBases[uid];
    const inGameId = this.playerInGame[uid];
    const inGameOwnerUid = this.gamesIdIndex[inGameId];

    if (inGameId) {
      const playerIndex = this.gamePlayers[inGameId].findIndex(
        (value) => value === uid,
      );

      this.gamePlayers[inGameId] = this.gamePlayers[inGameId].filter(
        (value, index) => index !== playerIndex,
      );
      this.gamePlayersNames[inGameId] = this.gamePlayersNames[inGameId].filter(
        (value, index) => index !== playerIndex,
      );
      this.subtract1ToOrders(
        inGameId,
        this.gamePlayersOrder[inGameId][playerIndex],
      );
      this.gamePlayersOrder[inGameId] = this.gamePlayersOrder[inGameId].filter(
        (value, index) => index !== playerIndex,
      );

      if (inGameOwnerUid === uid && this.gamePlayers[inGameId].length > 0) {
        const restPlayers = this.gamePlayers[inGameId].filter(
          (value) => value !== inGameOwnerUid,
        );
        /* Game */
        const newOwner = this.gamePlayers[inGameId][0];
        console.info(
          "Owner with uid " + uid + " left, changing ownership to " + newOwner,
        );
        this.changeOwner(game, uid, newOwner);
      } else {
        /* Game */
        this.gamePlayers[inGameId] = this.gamePlayers[inGameId].filter(
          (value, index) => index !== playerIndex,
        );
        this.gamePlayersNames[inGameId] = this.gamePlayersNames[
          inGameId
        ].filter((value, index) => index !== playerIndex);

        delete this.gamesIdIndex[game?.id];
        delete this.gameMeyer[game?.id];
        delete this.playerInGame[game?.id];
      }
      if (this.gameIsInProgress(inGameId)) {
        this.gameMeyer[inGameId].playerLeft(uid);
        this.updateMeyerInfo(inGameId, true, false);
      }
      this.SendMessage("player_left", [inGameId], uid);
      if (this.gameIsPublic(inGameId)) {
        /* Find */
        this.SendMessage(
          "update_game_num_players",
          ["Find"],
          [inGameId, this.gamePlayers[inGameId].length],
        );
      }
    }

    delete this.gameBases[uid];
    delete this.publicGames[uid];
    delete this.playerInGame[uid];
    delete this.inRoom[uid];
  }

  public leavePreviousRoom(socket: Socket, uid: string): void {
    const previousRoom = this.inRoom[uid];

    if (previousRoom) {
      if (previousRoom === "Game") {
        const gameToLeave = this.playerInGame[uid];
        socket.leave(gameToLeave);
        this.removeUserFromGamesAndRoom(uid);
      } else {
        socket.leave(previousRoom);
      }
    }
  }

  public getPublicGameDisplays(): GameDisplay[] {
    const publicGamesFiltered: [string, GameBase][] = Object.entries(
      this.gameBases,
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

  public gameIsOver(gameId: string): boolean {
    if (!this.gameExists(gameId)) {
      return false;
    }

    if (this.gameMeyer[gameId] && this.gameMeyer[gameId].isGameOver()) {
      return true;
    }

    return false;
  }

  public getTimedOutUsers(uids: string[]): string[] {
    return uids.filter((value) =>
      Object.keys(this.userTimeout).includes(value),
    );
  }

  public disconnectUser(uid: string): void {
    if (this.users[uid]) {
      this.removeUserFromGamesAndRoom(uid);
      delete this.users[uid];

      const users = Object.values(this.users);

      /* (All) */
      this.SendMessage("user_disconnected", users, users.length);
    }
  }

  public updateMeyerInfo(
    gameId: string,
    updateEveryone: boolean,
    gameStarted: boolean,
  ): void {
    const currentPlayer = this.gameMeyer[gameId].getCurrentPlayerUid();
    const restPlayers = this.gamePlayers[gameId].filter(
      (value) => value !== currentPlayer,
    );
    /* (User) */
    this.SendMessage(
      gameStarted ? "game_started" : "update_meyer_info",
      [currentPlayer],
      this.gameMeyer[gameId].getMeyerInfo(currentPlayer),
    );

    if (updateEveryone) {
      /* (User) */
      this.SendMessage(
        gameStarted ? "game_started" : "update_meyer_info",
        restPlayers,
        this.gameMeyer[gameId].getMeyerInfo(),
      );
    }
    this.gameMeyer[gameId].deleteTurnInformation();
  }

  public changeOwner(owningGame, uid, playerUid) {
    if (
      this.gamePlayers[owningGame?.id].filter(
        (value, index) => value == playerUid,
      ).length === 1
    ) {
      const isPublic = this.gameIsPublic(owningGame.id);
      this.gameBases[playerUid] = {
        ...this.gameBases[uid],
        owner: playerUid,
      };
      this.gamesIdIndex[owningGame.id] = playerUid;
      if (isPublic) {
        this.publicGames[playerUid] = this.publicGames[uid];
        delete this.publicGames[uid];
      }
      delete this.gameBases[uid];
      delete this.gamesIdIndex[uid];

      /* Game */
      this.SendMessage("owner_changed", [owningGame.id], {
        // same as joined_game
        ...gameBaseToGameInfo(this.gameBases[this.gamesIdIndex[owningGame.id]]),
        gamePlayers: this.gamePlayers[owningGame.id],
        gamePlayersNames: this.gamePlayersNames[owningGame.id],
        gamePlayersOrder: this.gamePlayersOrder[owningGame.id],
        gamePlayersTimeout: this.getTimedOutUsers(
          this.gamePlayers[owningGame.id],
        ),
        isPublic: this.gameIsPublic(owningGame.id),
        isInProgress: this.gameIsInProgress(owningGame.id),
      } as GameInfo);
    }
  }

  private changeAllNumber(gameId: string, amount: number, cutoff: number) {
    for (let i = 0; i < this.gamePlayersOrder[gameId].length; i++) {
      if (
        (cutoff > 0 && this.gamePlayersOrder[gameId][i] > cutoff) ||
        (cutoff < 0 && this.gamePlayersOrder[gameId][i] < cutoff)
      ) {
        this.gamePlayersOrder[gameId][i] += amount;
      }
    }
  }

  public add1ToOrders(gameId: string, cutoff: number) {
    this.changeAllNumber(gameId, 1, cutoff);
  }

  public subtract1ToOrders(gameId: string, cutoff: number) {
    console.info(
      "Subtracting 1 from [" +
        this.gamePlayersOrder[gameId] +
        "] above " +
        cutoff,
    );
    this.changeAllNumber(gameId, -1, cutoff);
    console.info("We now have [" + this.gamePlayersOrder[gameId] + "]");
  }
  ////////////////////////////////////////////////////////////////////////////////////////

  StartListeners = (socket: Socket) => {
    console.info("Message received from " + socket.id);

    ////////////////////////////////////////BUILT-IN////////////////////////////////////////
    /* HANDSHAKE - Happens on socket contact */
    /* From Room: (All) */
    /* Sends to: (All), Game */
    socket.on(
      "handshake",
      (
        storedUid: string,
        storedSocketId: string,
        callback: (reconnect: boolean, uid: string, userstotal: number) => void,
      ) => {
        console.info("Handshake received from: " + socket.id);

        /* Check if this is a reconnection */
        const reconnected =
          Object.values(this.users).includes(socket.id) ||
          (this.users[storedUid] && this.users[storedUid] === storedSocketId) ||
          socket.id === storedSocketId;

        if (reconnected) {
          console.info("This user has reconnected.");

          let uid: string;
          if (
            !(
              (this.users[storedUid] &&
                this.users[storedUid] === storedSocketId) ||
              socket.id === storedSocketId
            )
          ) {
            if (
              !(
                this.users[storedUid] &&
                this.users[storedUid] === storedSocketId
              ) &&
              socket.id === storedSocketId
            ) {
              this.deleteErroneousSocketUser(storedSocketId);
              /* (User) */
              this.SendMessage("reset_socket", [storedUid]);
            } else {
              /* (User) */
              this.SendMessage("reset_socket", [storedSocketId]);
            }

            uid = this.GetUidFromSocketID(socket.id);
            if (storedUid !== uid) {
              this.disconnectUser(storedUid);
            }
          } else {
            uid = storedUid;
            this.users[uid] = socket.id;
          }
          socket.join(uid);

          if (uid) {
            console.info("Sending callback for reconnect ...");

            if (this.userTimeout[uid]) {
              clearTimeout(this.userTimeout[uid]);
              delete this.userTimeout[uid];
              socket.join(this.playerInGame[uid]);

              /* Game */
              this.SendMessage(
                "remove_user_timeout",
                [this.playerInGame[uid]],
                uid,
              );
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
          users.length,
        );
      },
    );

    /* DISCONNECT - Happens on socket disconnect*/
    /* From Room: (All) */
    /* Sends to: Game 
       Through disconnectUser call: Game, (All), (User)
    */
    socket.on("disconnect", () => {
      console.info("Disconnect received from: " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);

      if (uid) {
        const gameToLeave = this.playerInGame[uid];

        if (gameToLeave) {
          /* Game */
          this.SendMessage("add_user_timeout", [gameToLeave], uid);
          this.userTimeout[uid] = setTimeout(() => {
            this.disconnectUser(uid);
            delete this.userTimeout[uid];
          }, 120000);
        } else {
          this.disconnectUser(uid);
        }
      }
    });
    ////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////FIND//////////////////////////////////////////
    /* FIND - Happens when user goes to /find */
    /* From Room: Find */
    /* Sends to: (User)
       Through leavePreviousRoom call: (User), Game, Find
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
          this.getPublicGameDisplays(),
        );
      }
    });
    ////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////CREATE/////////////////////////////////////////
    /* CREATE - Happens when user goes to /create/online */
    /* From Room: Create */
    /* Sends to: (None)
       Through leavePreviousRoom call: (User), Game, Find
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
        callback: (gameId: string) => void,
      ) => {
        console.info("Received event: create_game from " + socket.id);

        const uid = this.GetUidFromSocketID(socket.id);
        if (uid) {
          const gameBase = {
            ...gameRequestToGameBase(gameRequest),
            owner: uid,
          };
          const existingGame = this.gameBases[uid];
          const existingGameIsPublic = this.gameIsPublic(existingGame?.id);

          const currentRoom = this.inRoom[uid];

          if (
            currentRoom === "Create" &&
            0 < gameRequest.name.length &&
            gameRequest.name.length <= 25
          ) {
            this.gameBases[uid] = gameBase;
            this.gamesIdIndex[gameBase.id] = uid;
            this.gamePlayers[gameBase.id] = [];
            this.gamePlayersNames[gameBase.id] = [];
            this.gamePlayersOrder[gameBase.id] = [];
          }

          if (existingGameIsPublic) {
            /* Find */
            this.SendMessage("remove_game", ["Find"], existingGame?.id);
            delete this.publicGames[uid];
          }

          if (isPublic) {
            const gameDisplay = gameBaseToGameDisplay(gameBase);
            this.publicGames[uid] = gameBase.id;

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
            callback(gameBase.id);
          } else {
            callback("");
          }
        }
      },
    );
    ////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////GAME//////////////////////////////////////////
    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%LOBBY%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
    /* JOIN GAME - Happens when user joins game link */
    /* From Room: Game */
    /* Sends to: Game, (User), Find
       Through leavePreviousRoom call: (User), Game, Find
    */
    socket.on(
      "join_game",
      (
        gameId: string,
        chosenPlayerName: string,
        callback: (
          exists: boolean,
          inProgress: boolean,
          enoughSpace: boolean,
          givenPlayerName: string,
        ) => void,
      ) => {
        console.info("Received event: join_game from " + socket.id);

        const joiningUid = this.GetUidFromSocketID(socket.id);
        const givenPlayerName =
          chosenPlayerName.length === 0 || chosenPlayerName.length > 12
            ? ""
            : chosenPlayerName;
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
                callback(exists, true, false, givenPlayerName);
                return;
              } else if (!hasEnoughSpace) {
                callback(exists, false, false, givenPlayerName);
                return;
              }

              /* Game */
              this.SendMessage(
                "player_joined",
                [gameId],
                [joiningUid, givenPlayerName],
              );

              this.leavePreviousRoom(socket, joiningUid);
              socket.join(gameId);
              this.inRoom[joiningUid] = "Game";

              this.playerInGame[joiningUid] = gameId;
              this.gamePlayers[gameId].push(joiningUid);
              this.gamePlayersNames[gameId].push(givenPlayerName);
              this.gamePlayersOrder[gameId].push(
                this.gamePlayersNames[gameId].length,
              );

              callback(exists, false, hasEnoughSpace, givenPlayerName);

              /* (User) */
              this.SendMessage(
                "joined_game",
                [joiningUid],

                {
                  ...gameBaseToGameInfo(
                    this.gameBases[this.gamesIdIndex[gameId]],
                  ),
                  gamePlayers: this.gamePlayers[gameId],
                  gamePlayersNames: this.gamePlayersNames[gameId],
                  gamePlayersOrder: this.gamePlayersOrder[gameId],
                  gamePlayersTimeout: this.getTimedOutUsers(
                    this.gamePlayers[gameId],
                  ),
                  isPublic: this.gameIsPublic(gameId),
                  isInProgress: this.gameIsInProgress(gameId),
                } as GameInfo,
              );

              if (this.gameIsPublic(gameId)) {
                /* Find */
                this.SendMessage(
                  "update_game_num_players",
                  ["Find"],
                  [gameId, this.gamePlayers[gameId].length],
                );
              }
            } else {
              //User rejoined game
              callback(true, false, true, givenPlayerName);

              socket.join(gameId);

              /* (User) */
              this.SendMessage(
                "joined_game",
                [joiningUid],

                {
                  ...gameBaseToGameInfo(
                    this.gameBases[this.gamesIdIndex[gameId]],
                  ),
                  gamePlayers: this.gamePlayers[gameId],
                  gamePlayersNames: this.gamePlayersNames[gameId],
                  gamePlayersOrder: this.gamePlayersOrder[gameId],
                  gamePlayersTimeout: this.getTimedOutUsers(
                    this.gamePlayers[gameId],
                  ),
                  isPublic: this.gameIsPublic(gameId),
                  isInProgress: this.gameIsInProgress(gameId),
                } as GameInfo,
              );

              if (this.gameIsInProgress(gameId)) {
                /* (User) */
                this.SendMessage(
                  "update_meyer_info",
                  [joiningUid],
                  this.gameMeyer[gameId].getMeyerInfo(joiningUid),
                );
              }
            }

            return;
          }
          callback(false, true, false, givenPlayerName);
        }
      },
    );

    /* CHANGE NAME - Happens when a player edits their name and presses 'enter' */
    /* From Room: Game */
    /* Sends to: Game */
    socket.on(
      "change_player_name",
      (
        chosenPlayerName: string,
        callback: (givenPlayerName: string) => void,
      ) => {
        console.info("Received event: change_player_name from " + socket.id);

        const uid = this.GetUidFromSocketID(socket.id);
        if (uid) {
          const givenPlayerName =
            chosenPlayerName.length === 0 || chosenPlayerName.length > 12
              ? ""
              : chosenPlayerName;

          const inGameId = this.playerInGame[uid];
          if (inGameId && !this.gameIsInProgress(inGameId)) {
            if (givenPlayerName === "" || !inGameId) {
              return;
            }

            const playerIndex = this.gamePlayers[inGameId].findIndex(
              (value) => value === uid,
            );

            this.gamePlayersNames[inGameId][playerIndex] = givenPlayerName;

            callback(givenPlayerName);

            /* Game */
            this.SendMessage(
              "player_name_changed",
              [inGameId],
              [uid, givenPlayerName],
            );
          }
        }
      },
    );

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
              [owningGame.id, newLobbyName],
            );
          }
        }
      }
    });

    /* CHANGE MAX NUMBER OF PLAYERS - Happens when the lobby owner edits the number of max players */
    /* From Room: Game */
    /* Sends to: (User), Game, Find 
       Through leavePreviousRoom call: (User), Game, Find
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
              this.gamePlayers[owningGame.id].length,
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
                [owningGame.id, this.gamePlayers[owningGame.id].length],
              );
            }
          }

          /* Game */
          this.SendMessage(
            "max_players_changed",
            [owningGame.id],
            newMaxNumberOfPlayers,
          );
          if (this.gameIsPublic(owningGame.id)) {
            /* Find */
            this.SendMessage(
              "update_max_players",
              ["Find"],
              [owningGame.id, newMaxNumberOfPlayers],
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
    /* Sends to: Find 
    Through updateMeyerInfo call: (User)
    */
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
            this.gamePlayers[owningGame.id], //TODO: set according to order
            this.gameBases[uid].healthRollRuleSet,
          );
          this.updateMeyerInfo(owningGame.id, true, true);

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
    /* START GAME */
    /* From Room: Game */
    /* Sends to: Game */
    socket.on("reopen_lobby", () => {
      console.info("Received event: reopen_lobby from " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);
      if (uid) {
        const owningGame = this.gameBases[uid];
        if (
          owningGame &&
          this.gameIsInProgress(owningGame.id) &&
          this.gameMeyer[owningGame.id].isGameOver()
        ) {
          delete this.gameMeyer[owningGame.id];
          /* Game */
          this.SendMessage("reopened_lobby", [owningGame.id]);
        }
      }
    });

    /* Take action or bluff */
    /* From Room: Game  */
    /* Sends to: (User) */
    socket.on("take_action_bluff", (action: Action, bluff: number) => {
      console.info("Received event: take_action_bluff from " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);
      if (uid) {
        const inGameId = this.playerInGame[uid];
        if (
          inGameId &&
          this.gameIsInProgress(inGameId) &&
          this.gameMeyer[inGameId].getCurrentPlayerUid() === uid
        ) {
          if (this.gameMeyer[inGameId].getCurrentAction() !== "Bluff") {
            //Take action
            try {
              this.gameMeyer[inGameId].takeAction(action);
            } catch (e) {
              console.info(
                "Failed on taking action",
                action,
                "got error:",
                e.message,
              );
              return;
            }

            if (this.gameMeyer[inGameId].getCanAdvanceTurn()) {
              //Advance turn
              try {
                this.gameMeyer[inGameId].advanceTurn();
              } catch (e) {
                console.info(
                  "Failed on advancing turn",
                  action,
                  "got error:",
                  e.message,
                );
                return;
              }
              //Update everyone
              this.updateMeyerInfo(inGameId, true, false);
            } else {
              //Update only player to show him bluff choices
              this.updateMeyerInfo(inGameId, false, false);
            }
          } else {
            //Undo bluff
            if (action === "Error" && bluff === -1) {
              this.gameMeyer[inGameId].undoBluff();
              //Update only player to show him action choices again
              this.updateMeyerInfo(inGameId, false, false);
              return;
            }

            //Choose bluff
            try {
              this.gameMeyer[inGameId].chooseBluff(bluff);
            } catch (e) {
              console.info(
                "Failed on choosing bluff",
                action,
                "got error:",
                e.message,
              );
              return;
            }

            //Advance turn
            try {
              this.gameMeyer[inGameId].advanceTurn();
            } catch (e) {
              console.info(
                "Failed on advancing turn",
                action,
                "got error:",
                e.message,
              );
              return;
            }

            //Update everyone
            this.updateMeyerInfo(inGameId, true, false);
          }
        }
      }
    });

    /* RESTART GAME */
    /* From Room: Game */
    /* Sends to:  */
    socket.on("restart_game", () => {
      console.info("Received event: restart_game from " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);
      if (uid) {
        const owningGame = this.gameBases[uid];
        if (
          owningGame &&
          this.gameIsInProgress(owningGame.id) &&
          this.gameMeyer[owningGame.id].isGameOver() &&
          1 < this.gamePlayers[owningGame.id].length &&
          this.gamePlayers[owningGame.id].length <= 20
        ) {
          this.gameMeyer[owningGame.id].resetGame(
            this.gamePlayers[owningGame.id],
            this.gameBases[uid].healthRollRuleSet,
          );
          this.updateMeyerInfo(owningGame.id, true, true);
        }
      }
    });
    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%MIXED%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
    /* CHANGE HEALTH ROLL RULE SET */
    /* From Room: Game */
    /* Sends to: Find, Game */
    socket.on("change_healthroll_rule_set", (selectedRuleSet: number) => {
      console.info(
        "Received event: change_healthroll_rule_set from " + socket.id,
      );

      const uid = this.GetUidFromSocketID(socket.id);
      if (uid) {
        const owningGame = this.gameBases[uid];
        if (
          owningGame &&
          (!this.gameIsInProgress(owningGame.id) ||
            this.gameIsOver(owningGame.id))
        ) {
          this.gameBases[uid].healthRollRuleSet = selectedRuleSet;

          /* Game */
          this.SendMessage(
            "healthroll_rule_set_changed",
            [owningGame.id],
            [selectedRuleSet],
          );

          /* Find */
          this.SendMessage(
            "update_healthroll_rule_set",
            ["Find"],
            [owningGame.id, selectedRuleSet],
          );
        }
      }
    });

    /* CHANGE OWNER */
    /* From Room: Game */
    /* Sends to:  
    Through updateMeyerInfo call: Game*/
    socket.on("change_owner", (playerUid: string) => {
      console.info("Received event: change_owner from " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);
      if (uid && uid !== playerUid) {
        const owningGame = this.gameBases[uid];
        if (owningGame) {
          console.info("Owner changed from " + uid + " to " + playerUid);
          this.changeOwner(owningGame, uid, playerUid);
        }
      }
    });

    /* KICK PLAYER - Happens when lobby owner presses the x-button next to a player's name */
    /* From Room: Game */
    /* Sends to: (User), Game
    Through leavePreviousRoom call: (User), Game, Find
    Through disconnectUser call: (User), Find, Game, (All)
    */
    socket.on("kick_player", (kickingUid: string) => {
      console.info("Received event: kick_player from " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);
      if (uid && uid !== kickingUid) {
        const owningGame = this.gameBases[uid];
        if (owningGame) {
          /* (User) */
          this.SendMessage("been_kicked", [kickingUid]); //Informs them they've been kicked

          this.disconnectUser(kickingUid);
        }
      }
    });

    /* LEAVE GAME */
    /* From Room: Game */
    /* Sends to: Game
       Through leavePreviousRoom call: (User), Game, Find
       Through disconnectUser call: (User), Find, Game, (All)
       */
    socket.on("leave_game", () => {
      console.info("Received event: leave_game from " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);
      if (uid) {
        const inGameId = this.playerInGame[uid];
        if (inGameId) {
          this.disconnectUser(uid);
          this.leavePreviousRoom(socket, uid);
        }
      }
    });
    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
    ////////////////////////////////////////////////////////////////////////////////////////
  };
}
