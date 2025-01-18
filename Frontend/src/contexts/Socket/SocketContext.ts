import { Games } from "@mui/icons-material";
import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

export type Game = {
  id: string;
  name: string;
  numberOfPlayers: number;
  maxNumberOfPlayers: number;
};

export type GameRequest = {
  name: string;
  maxNumberOfPlayers: number;
};

export interface ISocketContextState {
  socket: Socket | undefined;
  uid: string;
  usersTotal: number;
  games: Game[];
}

export const defaultSocketContextState: ISocketContextState = {
  socket: undefined,
  uid: "",
  usersTotal: 0,
  games: [],
};

export type TSocketContextActions =
  | "update_socket"
  | "update_uid"
  | "update_usersTotal"
  | "add_game"
  | "update_game_num_players"
  | "update_games"
  | "remove_game";

export type TSocketContextPayload =
  | string
  | string[]
  | Socket
  | Game
  | Game[]
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
  console.log(
    `Message received - Action: ${action.type} - Payload: `,
    action.payload
  );

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
