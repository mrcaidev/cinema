import { ListVideo } from "lucide-react";
import { useState } from "react";
import { useSocketEvent } from "../socket-context";
import { AddVideoButton } from "./add-video-button";
import { CurrentItem } from "./current-item";
import { PlaylistItem } from "./playlist-item";
import type { PlaylistEntry } from "./types";

export function Playlist() {
  const [entries, setEntries] = useState<PlaylistEntry[]>([]);

  useSocketEvent("video:imported", (_, event) => {
    setEntries((entries) => [...entries, event]);
  });

  return (
    <section className="rounded-md bg-muted/50">
      <div className="flex justify-between items-center px-4 pt-3 pb-2">
        <h2 className="flex items-center gap-2 text-lg font-medium">
          <ListVideo className="size-5" />
          Playlist
        </h2>
        <AddVideoButton />
      </div>
      <hr className="mx-4" />
      <ol className="h-[calc(100%-48px)] px-4 overflow-auto scrollbar-thin scroll-thumb-rounded scrollbar-thumb-muted">
        {entries[0] ? (
          <li className="mt-2">
            <CurrentItem entry={entries[0]} />
          </li>
        ) : (
          <div className="grid place-items-center h-full text-muted-foreground text-sm">
            No video yet :)
          </div>
        )}
        {entries.slice(1).map((entry, index) => (
          <li key={entry.id} className="last:mb-2">
            <PlaylistItem entry={entry} index={index + 1} />
          </li>
        ))}
      </ol>
    </section>
  );
}
