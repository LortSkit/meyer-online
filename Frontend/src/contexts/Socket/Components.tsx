import { PropsWithChildren, useEffect, useReducer, useState } from "react";
import {
  defaultSocketContextState,
  SocketContextProvider,
  SocketReducer,
} from "./SocketContext";
import { useSocket } from "../../hooks/useSocket";

export interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<
  ISocketContextComponentProps
> = (props) => {
  const { children } = props;

  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    defaultSocketContextState
  );
  const [loading, setLoading] = useState(true);

  const socket = useSocket({
    uri: "ws://localhost:1337/",
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
    socket.on("user_connected", (user: string) => {
      console.info("User connected message received");
      SocketDispatch({ type: "update_user", payload: user });
    });

    /** Messages */
    socket.on("user_disconnected", (payload: string[]) => {
      console.info("User disconnected message received");
      SocketDispatch({ type: "remove_user", payload: payload[0] });
      if (payload[1] !== "") {
        SocketDispatch({ type: "remove_game", payload: payload[1] });
      }
    });

    /* Reconnect event */
    socket.io.on("reconnect", (attempt) => {
      console.info("Reconnected on attempt: " + attempt);
      SendHandshake();
    });

    /* Reconnect attempt event */
    socket.io.on("reconnect_attempt", (attempt) => {
      console.info("Reconnection attempt: " + attempt);
    });

    /* Reconnect error */
    socket.io.on("reconnect_error", (error) => {
      console.info("Reconnected error: " + error);
    });

    /* Reconnect failed */
    socket.io.on("reconnect_failed", () => {
      console.info("Reconnection failure");
      alert("We are unable to connect you to the web socket.");
    });
  };
  const SendHandshake = () => {
    console.info("Sending handshake");

    socket.emit(
      "handshake",
      (reconnect: boolean, uid: string, users: string[], gameId: string) => {
        console.log("User handshake callback message received");
        if (!reconnect) {
          SocketDispatch({ type: "update_uid", payload: uid });
          SocketDispatch({ type: "update_users", payload: users });
        }
        if (gameId !== "") {
          SocketDispatch({ type: "remove_game", payload: gameId });
        }
      }
    );

    setLoading(false);
  };

  if (loading) return <p>Loading Socket IO ...</p>;

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;
