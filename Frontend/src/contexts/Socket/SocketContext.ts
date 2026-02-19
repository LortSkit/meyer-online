import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
import { Action, TurnInfo } from "../../utils/gameTypes";

export type Game = {
  id: string;
  name: string;
  numberOfPlayers: number;
  maxNumberOfPlayers: number;
  healthRollRuleSet: number;
};

export type GameInfo = {
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

export type GameRequest = {
  name: string;
  maxNumberOfPlayers: number;
  healthRollRuleSet: number;
};

export type MeyerInfo = {
  round: number;
  turn: number;
  turnTotal: number;
  isGameOver: boolean;
  healths: number[];
  currentPlayer: string;
  roll: number;
  actionChoices: Action[];
  bluffChoices: number[];
  turnInformation: TurnInfo[];
};

export interface ISocketContextState {
  socket: Socket | undefined;
  uid: string;
  usersTotal: number;
  games: Game[];
  thisGame: GameInfo;
  meyerInfo: MeyerInfo;
}

export const defaultSocketContextState: ISocketContextState = {
  socket: undefined,
  uid: "",
  usersTotal: 0,
  games: [],
  thisGame: null as unknown as GameInfo,
  meyerInfo: null as unknown as MeyerInfo,
};

export type TSocketContextActions =
  ////BUILT-IN///
  | "update_socket"
  | "update_uid"
  | "update_usersTotal"
  | "reset_state"
  /////FIND//////
  | "update_games"
  | "add_game"
  | "remove_game"
  | "update_game_name"
  | "update_max_players"
  | "update_game_num_players"
  | "update_healthroll_rule_set"
  /////GAME//////
  /* %%LOBBY%% */
  | "set_this_game"
  | "add_game_player"
  | "update_player_name"
  | "update_lobby_name"
  | "update_this_max_players"
  | "change_game_public"
  | "change_game_private"
  /* %IN GAME% */
  | "game_in_progress"
  | "update_meyer_info"
  | "reopened_lobby"
  /* %%MIXED%% */
  | "change_healthroll_rule_set"
  | "remove_game_player"
  //| "owner_change"
  //| "order_change"
  | "add_user_timeout"
  | "remove_user_timeout";

export type TSocketContextPayload =
  | null
  | Socket
  | string
  | string[]
  | number
  | [string, number]
  | Game
  | Game[]
  | GameInfo
  | [GameInfo, string[], string[]]
  | MeyerInfo;

export interface ISocketContextActions {
  type: TSocketContextActions;
  payload?: TSocketContextPayload;
}

function subtract1ToOrders(order: number[], cutoff: number) {
  for (let i = 0; i < order.length; i++) {
    if (
      (cutoff > 0 && order[i] > cutoff) ||
      (cutoff < 0 && order[i] < cutoff)
    ) {
      order[i] -= 1;
    }
  }
  return order;
}

export const SocketReducer = (
  state: ISocketContextState,
  action: ISocketContextActions,
) => {
  let gameIndex;
  let index;
  switch (action.type) {
    ////////////////////////////////////////BUILT-IN////////////////////////////////////////
    case "update_socket":
      return { ...state, socket: action.payload as Socket };

    case "update_uid":
      return { ...state, uid: action.payload as string };

    case "update_usersTotal":
      return { ...state, usersTotal: action.payload as number };

    case "reset_state":
      return { ...defaultSocketContextState, socket: state.socket };
    ////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////FIND//////////////////////////////////////////
    case "update_games":
      return { ...state, games: action.payload as Game[] };

    case "add_game":
      if (!state.games.includes(action.payload as Game)) {
        return {
          ...state,
          games: state.games.concat([action.payload as Game]),
        };
      }

      return state;

    case "remove_game":
      return {
        ...state,
        games: state.games.filter(
          (game: Game) => game.id !== (action.payload as string),
        ),
      };

    case "update_game_name":
      gameIndex = state.games.findIndex(
        (game) => game.id === (action.payload as string[])[0],
      );
      state.games[gameIndex].name = (action.payload as string[])[1];
      return { ...state, games: state.games };

    case "update_max_players":
      gameIndex = state.games.findIndex(
        (game) => game.id === (action.payload as [string, number])[0],
      );
      state.games[gameIndex].maxNumberOfPlayers = (
        action.payload as [string, number]
      )[1];
      return { ...state, games: state.games };

    case "update_game_num_players":
      index = state.games.findIndex(
        (value: Game) => value.id === (action.payload as [string, number])[0],
      );
      state.games[index].numberOfPlayers = (
        action.payload as [string, number]
      )[1];
      return { ...state, games: state.games };

    case "update_healthroll_rule_set":
      index = state.games.findIndex(
        (value: Game) => value.id === (action.payload as [string, number])[0],
      );
      state.games[index].healthRollRuleSet = (
        action.payload as [string, number]
      )[1];
      return { ...state, games: state.games };

    ////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////GAME//////////////////////////////////////////
    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%LOBBY%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
    case "set_this_game":
      return {
        ...state,
        thisGame: action.payload as GameInfo,
      };

    case "add_game_player": {
      const uid = (action.payload as string[])[0];
      const playerName = (action.payload as string[])[1];
      const order = (action.payload as string[])[2];

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
          gamePlayersOrder: state.thisGame.gamePlayers.includes(uid)
            ? state.thisGame.gamePlayersOrder
            : state.thisGame.gamePlayersOrder.concat([parseInt(order)]),
        },
      };
    }

    case "update_player_name":
      const uid = (action.payload as string[])[0];
      const givenPlayerName = (action.payload as string[])[1];

      const playerIndex = state.thisGame.gamePlayers.findIndex(
        (value) => value === uid,
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
    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%IN GAME%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
    case "game_in_progress":
      return {
        ...state,
        thisGame: { ...state.thisGame, isInProgress: true },
        meyerInfo: action.payload as MeyerInfo,
      };

    case "update_meyer_info":
      return { ...state, meyerInfo: action.payload as MeyerInfo };

    case "reopened_lobby":
      return {
        ...state,
        thisGame: { ...state.thisGame, isInProgress: false, isPublic: false },
        meyerInfo: null as unknown as MeyerInfo,
      };
    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%MIXED%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
    case "change_healthroll_rule_set":
      return {
        ...state,
        thisGame: {
          ...state.thisGame,
          healthRollRuleSet: action.payload as number,
        },
      };

    case "remove_game_player": {
      let playerIndex = state.thisGame.gamePlayers.findIndex(
        (value) => value === (action.payload as string),
      );
      let newOrder = subtract1ToOrders(
        state.thisGame.gamePlayersOrder.filter(
          (value, index) => index !== playerIndex,
        ),
        state.thisGame.gamePlayersOrder[playerIndex],
      );
      return {
        ...state,
        thisGame: {
          ...state.thisGame,
          gamePlayers: state.thisGame.gamePlayers.filter(
            (value, index) => index !== playerIndex,
          ),
          gamePlayersNames: state.thisGame.gamePlayersNames.filter(
            (value, index) => index !== playerIndex,
          ),
          gamePlayersOrder: newOrder,
        },
      };
    }
    case "add_user_timeout":
      return {
        ...state,
        thisGame: {
          ...state.thisGame,
          gamePlayersTimeout: state.thisGame.gamePlayersTimeout.concat([
            action.payload as string,
          ]),
        },
      };

    case "remove_user_timeout":
      if (state.thisGame?.gamePlayersTimeout) {
        return {
          ...state,
          thisGame: {
            ...state.thisGame,
            gamePlayersTimeout: state.thisGame.gamePlayersTimeout.filter(
              (value) => value !== (action.payload as string),
            ),
          },
        };
      }
      return state;
    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
    ////////////////////////////////////////////////////////////////////////////////////////
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
