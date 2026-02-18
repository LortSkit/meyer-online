import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import { PropsWithChildren, useEffect, useReducer, useState } from "react";
import {
  defaultSocketContextState,
  Game,
  GameInfo,
  MeyerInfo,
  SocketContextProvider,
  SocketReducer,
} from "./SocketContext";
import { useSocket } from "../../hooks/useSocket";
import { useNavigate } from "react-router-dom";
import {
  translateKicked,
  translateLoading,
  translateReconnectFailure,
  translateDifferentTabJoined,
  translateReloadMessage,
  translateReload,
} from "../../utils/lang/langSocketComponents";
import { base } from "../../utils/hostSubDirectory";
import { Socket } from "socket.io-client";
export interface ISocketContextComponentProps extends PropsWithChildren {
  isDanish: boolean;
}

const SocketContextComponent: React.FunctionComponent<
  ISocketContextComponentProps
> = (props) => {
  const { children, isDanish } = props;

  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    defaultSocketContextState,
  );
  const [loading, setLoading] = useState(true);
  const [inactive, setInactive] = useState(document.visibilityState);

  const navigate = useNavigate();

  const protocol = import.meta.env.VITE_PROTOCOL
    ? import.meta.env.VITE_PROTOCOL
    : "http";
  const socketHost = import.meta.env.VITE_SOCKETHOST
    ? import.meta.env.VITE_SOCKETHOST
    : import.meta.env.VITE_HOSTNAME
      ? import.meta.env.VITE_HOSTNAME
      : "localhost";
  const socketPort = import.meta.env.VITE_SOCKETPORT
    ? Number(import.meta.env.VITE_SOCKETPORT)
    : 1337;

  const socket = useSocket({
    uri: `${protocol}://${socketHost}:${socketPort}`,
    opts: {
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
      autoConnect: false,
    },
  });

  function emitHandshake(socket: Socket) {
    socket.emit(
      "handshake",
      localStorage.getItem("storedUid"),
      localStorage.getItem("storedSocketId"),
      (reconnect: boolean, uid: string, usersTotal: number) => {
        //console.info("User handshake callback message received");
        if (!reconnect) {
          SocketDispatch({ type: "reset_state", payload: null });
        }
        SocketDispatch({ type: "update_uid", payload: uid });
        SocketDispatch({ type: "update_usersTotal", payload: usersTotal });

        setLoading(false);
        localStorage.setItem("storedUid", uid);
        localStorage.setItem("storedSocketId", socket.id as string);
      },
    );
  }

  function SendHandshake(s?: Socket): void {
    emitHandshake(s ? s : socket);
  }

  function onVisibilityChange() {
    setInactive(document.visibilityState);
  }

  useEffect(() => {
    /* Connect to the Web Socket */
    document.addEventListener("visibilitychange", onVisibilityChange, false);
    let s = undefined as unknown as Socket;
    if (loading) {
      s = socket.connect();
      /* Save the socket in context */
      SocketDispatch({ type: "update_socket", payload: s });
    }

    /* Start the event listeners */
    StartListeners();

    /* Send the handshake */
    if (loading) {
      if (s) {
        SendHandshake(s);
      }
    }
  }, []);

  const StartListeners = () => {
    ////////////////////////////////////////BUILT-IN////////////////////////////////////////
    /** Messages */
    /* For Room: (All) */
    socket.on("user_connected", (usersTotal: string) => {
      //console.info("User connected message received");
      SocketDispatch({ type: "update_usersTotal", payload: usersTotal });
    });

    /** Messages */
    /* For Room: (All) */
    socket.on("user_disconnected", (usersTotal: string) => {
      //console.info("User disconnected message received");
      SocketDispatch({ type: "update_usersTotal", payload: usersTotal });
    });

    /* Reconnect event */
    /* For Room: (All) */
    socket.io.on("reconnect", (attempt) => {
      //console.info("Reconnected on attempt: " + attempt);
      SendHandshake();
    });

    /* Reconnect attempt event */
    /* For Room: (All) */
    socket.io.on("reconnect_attempt", (attempt) => {
      //console.info("Reconnection attempt: " + attempt);
    });

    /* Reconnect error */
    /* For Room: (All) */
    socket.io.on("reconnect_error", (error) => {
      //console.info("Reconnected error: " + error);
    });

    /* Reconnect failed */
    /* For Room: (All) */
    socket.io.on("reconnect_failed", () => {
      //console.info("Reconnection failure");
      alert(translateReconnectFailure(isDanish));
    });

    /* Reset socket - Another browser joined with your info */
    /* For Room: (User) */
    socket.on("reset_socket", () => {
      navigate(base + "/");
      confirm(translateDifferentTabJoined(isDanish));
      SocketDispatch({ type: "reset_state", payload: null });
    });
    ////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////FIND//////////////////////////////////////////
    /* Join find */
    /* For Room: (User) */
    socket.on("joined_find", (games: Game[]) => {
      SocketDispatch({ type: "update_games", payload: games });
    });

    /* Add game */
    /* For Room: Find */
    socket.on("add_game", (game: Game) => {
      SocketDispatch({
        type: "add_game",
        payload: game,
      });
    });

    /* Remove game */
    /* For Room: Find */
    socket.on("remove_game", (gameId: string) => {
      SocketDispatch({
        type: "remove_game",
        payload: gameId,
      });
    });

    /* Update game name */
    /* For Room: Find */
    socket.on("update_game_name", (payload: string[]) => {
      SocketDispatch({ type: "update_game_name", payload: payload });
    });

    /* Update max number of players */
    /* For Room: Find */
    socket.on("update_max_players", (payload: [string, number]) => {
      SocketDispatch({ type: "update_max_players", payload: payload });
    });

    /* Update game number of players*/
    /* For Room: Find */
    socket.on("update_game_num_players", (payload: [string, number]) => {
      SocketDispatch({ type: "update_game_num_players", payload: payload });
    });

    /* Update health roll rule set*/
    /* For Room: Find */
    socket.on("update_healthroll_rule_set", (payload: [string, number]) => {
      SocketDispatch({ type: "update_healthroll_rule_set", payload: payload });
    });

    /* Game in progress - no longer joinable so remove */
    /* For Room: Find */
    socket.on("game_in_progress", (gameId: string) => {
      SocketDispatch({
        type: "remove_game",
        payload: gameId,
      });
    });
    ////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////GAME//////////////////////////////////////////
    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%LOBBY%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
    /* Join game */
    /* For Room: (User) */
    socket.on("joined_game", (payload: GameInfo) => {
      SocketDispatch({ type: "set_this_game", payload: payload });
    });

    /* Player joined */
    /* For Room: Game */
    socket.on("player_joined", (payload: string[]) => {
      SocketDispatch({ type: "add_game_player", payload: payload });
    });

    /* Player name changed */
    /* For Room: Game */
    socket.on("player_name_changed", (payload: string[]) => {
      SocketDispatch({ type: "update_player_name", payload: payload });
    });

    /* Lobby name changed */
    /* For Room: Game */
    socket.on("lobby_name_changed", (newLobbyName: string) => {
      SocketDispatch({ type: "update_lobby_name", payload: newLobbyName });
    });

    /* Max number of players changed */
    /* For Room: Game */
    socket.on("max_players_changed", (newMaxNumberOfPlayers: number) => {
      SocketDispatch({
        type: "update_this_max_players",
        payload: newMaxNumberOfPlayers,
      });
    });

    /* Game changed to public */
    /* For Room: Game */
    socket.on("change_game_public", () => {
      SocketDispatch({ type: "change_game_public", payload: null });
    });

    /* Game changed to private */
    /* For Room: Game */
    socket.on("change_game_private", () => {
      SocketDispatch({ type: "change_game_private", payload: null });
    });
    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%IN GAME%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
    /* Game started */
    /* For Room: (User) */
    socket.on("game_started", (meyerInfo: MeyerInfo) => {
      SocketDispatch({ type: "game_in_progress", payload: meyerInfo });
    });

    /* Update all meyer info */
    socket.on("update_meyer_info", (meyerInfo: MeyerInfo) => {
      SocketDispatch({ type: "update_meyer_info", payload: meyerInfo });
    });

    /* Reopening lobby */
    /* For Room: Game */
    socket.on("reopened_lobby", () => {
      SocketDispatch({ type: "reopened_lobby", payload: null });
    });
    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

    /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%MIXED%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
    /* Health roll rule set changed */
    /* For Room: Game */
    socket.on("healthroll_rule_set_changed", (selectedRuleSet: number[]) => {
      SocketDispatch({
        type: "change_healthroll_rule_set",
        payload: selectedRuleSet[0],
      });
    });

    /* Owner changed */
    /* For Room: Game */
    socket.on("owner_changed", (payload: GameInfo) => {
      SocketDispatch({ type: "set_this_game", payload: payload });
    });

    /* When getting kicked */
    /* For Room: Game */
    socket.on("been_kicked", () => {
      navigate(base + "/find");
      confirm(translateKicked(isDanish));
      setTimeout(function () {
        window.location.reload();
      });
    });

    /* Player left */
    /* For Room: Game */
    socket.on("player_left", (playerUid: string) => {
      SocketDispatch({ type: "remove_game_player", payload: playerUid });
    });

    /* When user disconnected - though is given a 2 min grace period */
    /* For Room: Game */
    socket.on("add_user_timeout", (uid: string) => {
      SocketDispatch({ type: "add_user_timeout", payload: uid });
    });

    /* When user came back from grace period */
    /* For Room: Game */
    socket.on("remove_user_timeout", (uid: string) => {
      if (uid === SocketState.uid) {
        setTimeout(function () {
          window.location.reload();
        });
      }
      SocketDispatch({ type: "remove_user_timeout", payload: uid });
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
  else if (inactive === "hidden") {
    return (
      <Box display="flex" justifyContent="center" flexBasis="100%">
        <Box display="flex" justifyContent="center" flexDirection="column">
          {translateReloadMessage(isDanish)}
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setTimeout(function () {
                  window.location.reload();
                });
              }}
            >
              <CachedOutlinedIcon />
              {translateReload(isDanish)}
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;
