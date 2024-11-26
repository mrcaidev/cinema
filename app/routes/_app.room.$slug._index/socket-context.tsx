import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import io, { type Socket } from "socket.io-client";

const context = createContext<Socket | null>(null);

export function SocketProvider({ children }: PropsWithChildren) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io();

    setSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  return <context.Provider value={socket}>{children}</context.Provider>;
}

export function useSocket() {
  return useContext(context);
}
