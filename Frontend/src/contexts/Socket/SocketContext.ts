import { Games } from "@mui/icons-material";
import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

export type Game = {
  id: string;
  name: string;
  numberOfPlayers: number;
  maxNumberOfPlayers: number;
};

export interface ISocketContextState {
  socket: Socket | undefined;
  uid: string;
  users: string[];
  games: Game[];
}

export const defaultSocketContextState: ISocketContextState = {
  socket: undefined,
  uid: "",
  users: [],
  games: [],
};

export type TSocketContextActions =
  | "update_socket"
  | "update_uid"
  | "update_user"
  | "update_users"
  | "remove_user"
  | "update_game"
  | "update_games"
  | "remove_game";

export type TSocketContextPayload = string | string[] | Socket | Game | Game[];

export interface ISocketContextActions {
  type: TSocketContextActions;
  payload: TSocketContextPayload;
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

    case "update_user":
      if (!state.users.includes(action.payload as string)) {
        return {
          ...state,
          users: state.users.concat([action.payload as string]),
        };
      }
      return state;

    case "update_users":
      return { ...state, users: action.payload as string[] };

    case "remove_user":
      return {
        ...state,
        users: state.users.filter(
          (uid: string) => uid !== (action.payload as string)
        ),
      };

    case "update_game":
      if (!state.games.includes(action.payload as Game)) {
        return {
          ...state,
          games: state.games.concat([action.payload as Game]),
        };
      }

      return state;

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
