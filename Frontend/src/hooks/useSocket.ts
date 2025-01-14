//Stolen from https://github.com/joeythelantern/Socket-IO-Basics

import { useEffect, useRef } from "react";
import io, { ManagerOptions, SocketOptions } from "socket.io-client";

interface Props {
  uri: string;
  opts?: Partial<ManagerOptions & SocketOptions> | undefined;
}

export const useSocket = ({ uri, opts }: Props) => {
  const { current: socket } = useRef(io(uri, opts));

  useEffect(() => {
    return () => {
      if (socket) socket.close();
    };
  }, [socket]);

  return socket;
};
