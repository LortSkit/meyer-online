import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

export type Game = {
  id: string;
  name: string;
  numberOfPlayers: number;
  maxNumberOfPlayers: number;
};

export type GameInfo = {
  id: string;
  name: string;
  gamePlayers: string[];
  gamePlayersNames: string[];
  maxNumberOfPlayers: number;
  isPublic: boolean;
  isInProgress: boolean;
};

export type GameRequest = {
  name: string;
  maxNumberOfPlayers: number;
};

export interface ISocketContextState {
  socket: Socket | undefined;
  uid: string;
  usersTotal: number;
  thisGame: GameInfo;
  games: Game[];
}

export const defaultSocketContextState: ISocketContextState = {
  socket: undefined,
  uid: "",
  usersTotal: 0,
  thisGame: null as unknown as GameInfo,
  games: [],
};

export type TSocketContextActions =
  | "update_socket"
  | "update_uid"
  | "update_usersTotal"
  | "add_game"
  | "update_game_num_players"
  | "update_games"
  | "remove_game"
  | "update_game_name"
  | "update_max_players"
  | "set_this_game"
  | "add_game_player"
  | "remove_game_player"
  | "update_player_name"
  | "update_lobby_name"
  | "update_this_max_players"
  | "change_game_public"
  | "change_game_private";

export type TSocketContextPayload =
  | null
  | string
  | string[]
  | [GameInfo, string[], string[]]
  | Socket
  | Game
  | Game[]
  | GameInfo
  | number
  | [string, number];

export interface ISocketContextActions {
  type: TSocketContextActions;
  payload?: TSocketContextPayload;
}

export const SocketReducer = (
  state: ISocketContextState,
  action: ISocketContextActions
) => {
  let gameIndex;
  switch (action.type) {
    case "update_socket":
      return { ...state, socket: action.payload as Socket };

    case "update_uid":
      return { ...state, uid: action.payload as string };

    case "update_usersTotal":
      return { ...state, usersTotal: action.payload as number };

    case "add_game":
      if (!state.games.includes(action.payload as Game)) {
        return {
          ...state,
          games: state.games.concat([action.payload as Game]),
        };
      }

      return state;

    case "update_game_num_players":
      let index = state.games.findIndex(
        (value: Game) => value.id === (action.payload as [string, number])[0]
      );
      state.games[index].numberOfPlayers = (
        action.payload as [string, number]
      )[1];
      return { ...state, games: state.games };

    case "update_games":
      return { ...state, games: action.payload as Game[] };

    case "remove_game":
      return {
        ...state,
        games: state.games.filter(
          (game: Game) => game.id !== (action.payload as string)
        ),
      };

    case "update_game_name":
      gameIndex = state.games.findIndex(
        (game) => game.id === (action.payload as string[])[0]
      );
      state.games[gameIndex].name = (action.payload as string[])[1];
      return { ...state, games: state.games };

    case "update_max_players":
      gameIndex = state.games.findIndex(
        (game) => game.id === (action.payload as [string, number])[0]
      );
      state.games[gameIndex].maxNumberOfPlayers = (
        action.payload as [string, number]
      )[1];
      return { ...state, games: state.games };

    case "set_this_game":
      const newThisGame = (action.payload as [GameInfo, string[], string[]])[0];
      const newGamePlayers = (
        action.payload as [GameInfo, string[], string[]]
      )[1];
      const newGamePlayersNames = (
        action.payload as [GameInfo, string[], string[]]
      )[2];

      return {
        ...state,
        thisGame: {
          ...newThisGame,
          gamePlayers: newGamePlayers,
          gamePlayersNames: newGamePlayersNames,
        },
      };

    case "add_game_player": {
      const uid = (action.payload as string[])[0];
      const playerName = (action.payload as string[])[1];
      return {
        ...state,
        thisGame: {
          ...state.thisGame,
          gamePlayers: state.thisGame.gamePlayers.includes(uid)
            ? state.thisGame.gamePlayers
            : state.thisGame.gamePlayers.concat([uid]),
          gamePlayersNames: state.thisGame.gamePlayers.includes(uid)
            ? state.thisGame.gamePlayersNames
            : state.thisGame.gamePlayersNames.concat([playerName]),
        },
      };
    }

    case "remove_game_player": {
      let playerIndex = state.thisGame.gamePlayers.findIndex(
        (value) => value === (action.payload as string)
      );
      return {
        ...state,
        thisGame: {
          ...state.thisGame,
          gamePlayers: state.thisGame.gamePlayers.filter(
            (value, index) => index !== playerIndex
          ),
          gamePlayersNames: state.thisGame.gamePlayersNames.filter(
            (value, index) => index !== playerIndex
          ),
        },
      };
    }

    case "update_player_name":
      const uid = (action.payload as string[])[0];
      const givenPlayerName = (action.payload as string[])[1];

      const playerIndex = state.thisGame.gamePlayers.findIndex(
        (value) => value === uid
      );
      state.thisGame.gamePlayersNames[playerIndex] = givenPlayerName;
      return {
        ...state,
        thisGame: {
          ...state.thisGame,
          gamePlayersNames: state.thisGame.gamePlayersNames,
        },
      };

    case "update_lobby_name":
      return {
        ...state,
        thisGame: { ...state.thisGame, name: action.payload as string },
      };

    case "update_this_max_players":
      return {
        ...state,
        thisGame: {
          ...state.thisGame,
          maxNumberOfPlayers: action.payload as number,
        },
      };

    case "change_game_public":
      return {
        ...state,
        thisGame: { ...state.thisGame, isPublic: true },
      };

    case "change_game_private":
      return {
        ...state,
        thisGame: { ...state.thisGame, isPublic: false },
      };
  }
};

export interface ISocketContextProps {
  SocketState: ISocketContextState;
  SocketDispatch: React.Dispatch<ISocketContextActions>;
}

const SocketContext = createContext<ISocketContextProps>({
  SocketState: defaultSocketContextState,
  SocketDispatch: () => {},
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export const useGlobalContext = () => {
  return useContext(SocketContext);
};

export default SocketContext;
