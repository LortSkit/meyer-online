import { PropsWithChildren, useEffect, useReducer, useState } from "react";
import {
  defaultSocketContextState,
  Game,
  GameInfo,
  SocketContextProvider,
  SocketReducer,
} from "./SocketContext";
import { useSocket } from "../../hooks/useSocket";
import { useNavigate } from "react-router-dom";
import {
  translateKicked,
  translateLoading,
  translateReconnectFailure,
  translateRedirecting,
} from "../../utils/lang/langSocketComponents";
import { base } from "../../utils/hostSubDirectory";
import { Box } from "@mui/material";

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

  const SendHandshake = () => {
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
    ////////////////////////////////////////BUILT-IN////////////////////////////////////////
    /** Messages */
    /* From Room: (All) */
    socket.on("user_connected", (usersTotal: string) => {
      //console.info("User connected message received");
      SocketDispatch({ type: "update_usersTotal", payload: usersTotal });
    });

    /** Messages */
    /* From Room: (All) */
    socket.on("user_disconnected", (usersTotal: string) => {
      //console.info("User disconnected message received");
      SocketDispatch({ type: "update_usersTotal", payload: usersTotal });
    });

    /* Reconnect event */
    /* From Room: (All) */
    socket.io.on("reconnect", (attempt) => {
      //console.info("Reconnected on attempt: " + attempt);
      SendHandshake();
    });

    /* Reconnect attempt event */
    /* From Room: (All) */
    socket.io.on("reconnect_attempt", (attempt) => {
      //console.info("Reconnection attempt: " + attempt);
    });

    /* Reconnect error */
    /* From Room: (All) */
    socket.io.on("reconnect_error", (error) => {
      //console.info("Reconnected error: " + error);
    });

    /* Reconnect failed */
    /* From Room: (All) */
    socket.io.on("reconnect_failed", () => {
      //console.info("Reconnection failure");
      alert(translateReconnectFailure(isDanish));
    });
    ////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////FIND//////////////////////////////////////////
    /* Join find */
    /* From Room: (User) */
    socket.on("joined_find", (games: Game[]) => {
      SocketDispatch({ type: "update_games", payload: games });
    });

    /* Add game */
    /* From Room: Find */
    socket.on("add_game", (game: Game) => {
      SocketDispatch({
        type: "add_game",
        payload: game,
      });
    });

    /* Remove game */
    /* From Room: Find */
    socket.on("remove_game", (gameId: string) => {
      SocketDispatch({
        type: "remove_game",
        payload: gameId,
      });
    });

    /* Update game name */
    /* From Room: Find */
    socket.on("update_game_name", (payload: string[]) => {
      SocketDispatch({ type: "update_game_name", payload: payload });
    });

    /* Update max number of players */
    /* From Room: Find */
    socket.on("update_max_players", (payload: [string, number]) => {
      SocketDispatch({ type: "update_max_players", payload: payload });
    });

    /* Update game number of players*/
    /* From Room: Find */
    socket.on("update_game_num_players", (payload: [string, number]) => {
      SocketDispatch({ type: "update_game_num_players", payload: payload });
    });
    ////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////GAME//////////////////////////////////////////
    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%LOBBY%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
    /* Join game */
    /* From Room: (User) */
    socket.on("joined_game", (payload: [GameInfo, string[], string[]]) => {
      SocketDispatch({ type: "set_this_game", payload: payload });
    });

    /* Player joined */
    /* From Room: Game */
    socket.on("player_joined", (payload: string[]) => {
      SocketDispatch({ type: "add_game_player", payload: payload });
    });

    /* Player left */
    /* From Room: Game */
    socket.on("player_left", (playerUid: string) => {
      SocketDispatch({ type: "remove_game_player", payload: playerUid });
    });

    /* Player name changed */
    /* From Room: Game */
    socket.on("player_name_changed", (payload: string[]) => {
      SocketDispatch({ type: "update_player_name", payload: payload });
      localStorage.setItem("playerName", payload[1]);
    });

    /* Lobby name changed */
    /* From Room: Game */
    socket.on("lobby_name_changed", (newLobbyName: string) => {
      SocketDispatch({ type: "update_lobby_name", payload: newLobbyName });
    });

    /* Max number of players changed */
    /* From Room: Game */
    socket.on("max_players_changed", (newMaxNumberOfPlayers: number) => {
      SocketDispatch({
        type: "update_this_max_players",
        payload: newMaxNumberOfPlayers,
      });
    });

    /* Game changed to public */
    /* From Room: Game */
    socket.on("change_game_public", () => {
      SocketDispatch({ type: "change_game_public", payload: null });
    });

    /* Game changed to private */
    /* From Room: Game */
    socket.on("change_game_private", () => {
      SocketDispatch({ type: "change_game_private", payload: null });
    });

    /* Owner left */
    /* From Room: Game */
    socket.on("game_owner_left", () => {
      focus();
      confirm(translateRedirecting(isDanish));
      navigate(base + "/find");
    });
    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%IN GAME%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%MIXED%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
    /* When getting kicked */
    /* From Room: Game */
    socket.on("been_kicked", () => {
      confirm(translateKicked(isDanish));
      navigate(base + "/find");
    });
    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
    ////////////////////////////////////////////////////////////////////////////////////////
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" flexBasis="100%">
        <Box display="flex" justifyContent="center" flexDirection="column">
          {translateLoading(isDanish)}
        </Box>
      </Box>
    );

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;
