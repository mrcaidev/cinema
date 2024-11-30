import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ListVideo } from "lucide-react";
import { useMemo } from "react";
import { usePlaylist } from "../playlist-context";
import { useSocketEvent } from "../socket-context";
import { CurrentItem } from "./current-item";
import { ImportVideoButton } from "./import-video-button";
import { PlaylistItem } from "./playlist-item";

export function Playlist() {
  const { playlist, setPlaylist } = usePlaylist();

  const prioritizedCandidates = useMemo(
    () =>
      playlist
        .slice(1)
        .toSorted((a, b) => b.upvotedUserIds.length - a.upvotedUserIds.length),
    [playlist],
  );
  const [playlistRef] = useAutoAnimate();

  useSocketEvent("playlist:imported", (_, event) => {
    setPlaylist((entries) => [...entries, event]);
  });

  useSocketEvent("playlist:upvoted", (_, event) => {
    const { id, upvotedUserIds } = event;
    setPlaylist((entries) => {
      const index = entries.findIndex((entry) => entry.id === id);
      if (index === -1) {
        return entries;
      }
      return entries.toSpliced(index, 1, {
        // biome-ignore lint/style/noNonNullAssertion: Must exist.
        ...entries[index]!,
        upvotedUserIds,
      });
    });
  });

  useSocketEvent("playlist:removed", (_, event) => {
    const { id } = event;
    setPlaylist((entries) => {
      const index = entries.findIndex((entry) => entry.id === id);
      if (index === -1) {
        return entries;
      }
      return entries.toSpliced(index, 1);
    });
  });

  return (
    <section className="rounded-md bg-muted/50">
      <div className="flex justify-between items-center px-4 pt-3 pb-2">
        <h2 className="flex items-center gap-2 text-lg font-medium">
          <ListVideo className="size-5" />
          Playlist
        </h2>
        <ImportVideoButton />
      </div>
      <hr className="mx-4" />
      <ol
        ref={playlistRef}
        className="h-[calc(100%-50px)] px-4 overflow-auto scrollbar-thin scroll-thumb-rounded scrollbar-thumb-muted"
      >
        {playlist[0] ? (
          <li className="mt-2">
            <CurrentItem entry={playlist[0]} />
          </li>
        ) : (
          <div className="grid place-items-center h-full text-muted-foreground text-sm">
            No video yet :)
          </div>
        )}
        {prioritizedCandidates.map((entry, index) => (
          <li key={entry.id} className="last:mb-2">
            <PlaylistItem entry={entry} index={index + 1} />
          </li>
        ))}
      </ol>
    </section>
  );
}
