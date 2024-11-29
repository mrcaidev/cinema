import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/common/types";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { useLoaderData } from "react-router";
import io, { type Socket } from "socket.io-client";
import type { loader } from "./route";

type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const context = createContext<ClientSocket | null>(null);

export function SocketProvider({ children }: PropsWithChildren) {
  const { room, me } = useLoaderData<typeof loader>();

  const [socket, setSocket] = useState<ClientSocket | null>(null);

  useEffect(() => {
    const socket: ClientSocket = io({
      query: { roomSlug: room.slug },
      auth: { userId: me.id },
    });

    setSocket(socket);

    return () => {
      socket.close();
    };
  }, [room.slug, me.id]);

  return <context.Provider value={socket}>{children}</context.Provider>;
}

export function useSocket() {
  return useContext(context);
}

export function useSocketEvent<E extends keyof ServerToClientEvents>(
  eventName: E,
  handler: (
    socket: ClientSocket,
    ...args: Parameters<ServerToClientEvents[E]>
  ) => ReturnType<ServerToClientEvents[E]>,
) {
  const socket = useSocket();

  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!socket) {
      return;
    }

    // @ts-ignore This works fine.
    socket.on(eventName, (...args: Parameters<ServerToClientEvents[E]>) => {
      handlerRef.current(socket, ...args);
    });

    return () => {
      socket.off(eventName);
    };
  }, [socket, eventName]);
}
