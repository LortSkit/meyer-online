import { PropsWithChildren, useEffect, useReducer, useState } from "react";
import {
  defaultSocketContextState,
  Game,
  SocketContextProvider,
  SocketReducer,
} from "./SocketContext";
import { useSocket } from "../../hooks/useSocket";
import { useNavigate } from "react-router-dom";
import {
  translateLoading,
  translateReconnectFailure,
  translateRedirecting,
} from "../../utils/lang/langSocketComponents";
import { base } from "../../utils/hostSubDirectory";

export interface ISocketContextComponentProps extends PropsWithChildren {
  isDanish: boolean;
}

const SocketContextComponent: React.FunctionComponent<
  ISocketContextComponentProps
> = (props) => {
  const { children, isDanish } = props;

  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    defaultSocketContextState
  );
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const protocol = import.meta.env.VITE_PROTOCOL
    ? import.meta.env.VITE_PROTOCOL
    : "http";
  const hostName = import.meta.env.VITE_HOSTNAME
    ? import.meta.env.VITE_HOSTNAME
    : "localhost";
  const socketPort = import.meta.env.VITE_SOCKETPORT
    ? Number(import.meta.env.VITE_SOCKETPORT)
    : 1337;

  const socket = useSocket({
    uri: `${protocol}://${hostName}:${socketPort}`,
    opts: {
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
      autoConnect: false,
    },
  });

  useEffect(() => {
    /* Connect to the Web Socket */
    if (loading) {
      socket.connect();
    }
    /* Save the socket in context */
    SocketDispatch({ type: "update_socket", payload: socket });

    /* Start the event listeners */
    StartListeners();

    /* Send the handshake */
    if (loading) {
      SendHandshake();
    }
  }, []);

  const StartListeners = () => {
    /** Messages */
    socket.on("user_connected", (usersTotal: string) => {
      //console.info("User connected message received");
      SocketDispatch({ type: "update_usersTotal", payload: usersTotal });
    });

    /** Messages */
    socket.on("user_disconnected", (usersTotal: string) => {
      //console.info("User disconnected message received");
      SocketDispatch({ type: "update_usersTotal", payload: usersTotal });
    });

    /* Reconnect event */
    socket.io.on("reconnect", (attempt) => {
      //console.info("Reconnected on attempt: " + attempt);
      SendHandshake();
    });

    /* Reconnect attempt event */
    socket.io.on("reconnect_attempt", (attempt) => {
      //console.info("Reconnection attempt: " + attempt);
    });

    /* Reconnect error */
    socket.io.on("reconnect_error", (error) => {
      //console.info("Reconnected error: " + error);
    });

    /* Reconnect failed */
    socket.io.on("reconnect_failed", () => {
      //console.info("Reconnection failure");
      alert(translateReconnectFailure(isDanish));
    });

    /* Join find */
    socket.on("joined_find", (games: Game[]) => {
      SocketDispatch({ type: "update_games", payload: games });
    });

    /* Add game */
    socket.on("add_game", (game: Game) => {
      SocketDispatch({
        type: "add_game",
        payload: game,
      });
    });

    /* Remove game */
    socket.on("remove_game", (gameId: string) => {
      SocketDispatch({
        type: "remove_game",
        payload: gameId,
      });
    });

    /* Update game number of players*/
    socket.on("update_game_num_players", (payload: [string, number]) => {
      SocketDispatch({ type: "update_game_num_players", payload: payload });
    });

    /* Join game */
    socket.on("joined_game", (payload: string[][]) => {
      SocketDispatch({ type: "update_game_players", payload: payload });
    });

    /* Player joined */
    socket.on("player_joined", (payload: string[]) => {
      SocketDispatch({ type: "add_game_player", payload: payload });
    });

    /* Player left */
    socket.on("player_left", (playerUid: string) => {
      SocketDispatch({ type: "remove_game_player", payload: playerUid });
    });

    /* Player name changed */
    socket.on("player_name_changed", (payload: string[]) => {
      SocketDispatch({ type: "change_player_name", payload: payload });
      localStorage.setItem("playerName", payload[1]);
    });

    /* Owner left */
    socket.on("game_owner_left", () => {
      focus();
      confirm(translateRedirecting(isDanish));
      navigate(base + "/find");
    });
  };
  const SendHandshake = () => {
    //console.info("Sending handshake");

    socket.emit(
      "handshake",
      (reconnect: boolean, uid: string, usersTotal: number, gameId: string) => {
        //console.info("User handshake callback message received");
        if (!reconnect) {
          SocketDispatch({ type: "update_uid", payload: uid });
          SocketDispatch({ type: "update_usersTotal", payload: usersTotal });
        }
        if (gameId !== "") {
          SocketDispatch({ type: "remove_game", payload: gameId });
        }
        setLoading(false);
      }
    );
  };

  if (loading) return <p>{translateLoading(isDanish)}</p>;

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;
