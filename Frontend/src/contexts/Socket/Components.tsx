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
    socket.connect();

    /* Save the socket in context */
    SocketDispatch({ type: "update_socket", payload: socket });

    /* Start the event listeners */
    StartListeners();

    /* Send the handshake */
    SendHandshake();
  }, []);

  const StartListeners = () => {
    /** Messages */
    socket.on("user_connected", (users: string[]) => {
      console.info("User connected message received");
      SocketDispatch({ type: "update_users", payload: users });
    });

    /** Messages */
    socket.on("user_disconnected", (uid: string) => {
      console.info("User disconnected message received");
      SocketDispatch({ type: "remove_user", payload: uid });
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

    socket.emit("handshake", (uid: string, users: string[]) => {
      console.log("User handshake callback message received");
      SocketDispatch({ type: "update_uid", payload: uid });
      SocketDispatch({ type: "update_users", payload: users });
    });

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
