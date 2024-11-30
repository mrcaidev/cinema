import type { PlaylistVideo } from "@/common/types";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import { useLoaderData } from "react-router";
import type { loader } from "./route";

type State = {
  playlist: PlaylistVideo[];
  setPlaylist: Dispatch<SetStateAction<PlaylistVideo[]>>;
};

const DEFAULT_STATE: State = {
  playlist: [],
  setPlaylist: () => {},
};

const context = createContext<State>(DEFAULT_STATE);

export function PlaylistProvider({ children }: PropsWithChildren) {
  const { room } = useLoaderData<typeof loader>();

  const [playlist, setPlaylist] = useState(room.playlist);

  return (
    <context.Provider value={{ playlist, setPlaylist }}>
      {children}
    </context.Provider>
  );
}

export function usePlaylist() {
  return useContext(context);
}
