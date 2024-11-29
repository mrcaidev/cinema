import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ListVideo } from "lucide-react";
import { useMemo, useState } from "react";
import { useSocketEvent } from "../socket-context";
import { AddVideoButton } from "./add-video-button";
import { CurrentItem } from "./current-item";
import { PlaylistItem } from "./playlist-item";
import type { PlaylistEntry } from "./types";

export function Playlist() {
  const [entries, setEntries] = useState<PlaylistEntry[]>([
    {
      id: "test1",
      provider: "bilibili",
      title: "Test 1",
      html: "",
      fromUser: {
        id: "user1",
        nickname: "user1",
        avatarUrl: null,
      },
      upvotedUserIds: [],
    },
    {
      id: "test2",
      provider: "bilibili",
      title: "Test 2",
      html: "",
      fromUser: {
        id: "user1",
        nickname: "user1",
        avatarUrl: null,
      },
      upvotedUserIds: [],
    },
    {
      id: "test3",
      provider: "bilibili",
      title: "Test 3",
      html: "",
      fromUser: {
        id: "user1",
        nickname: "user1",
        avatarUrl: null,
      },
      upvotedUserIds: [],
    },
    {
      id: "test4",
      provider: "bilibili",
      title: "Test 4",
      html: "",
      fromUser: {
        id: "user1",
        nickname: "user1",
        avatarUrl: null,
      },
      upvotedUserIds: [],
    },
  ]);

  const prioritizedCandidates = useMemo(
    () =>
      entries
        .slice(1)
        .toSorted((a, b) => b.upvotedUserIds.length - a.upvotedUserIds.length),
    [entries],
  );
  const [playlistRef] = useAutoAnimate();

  useSocketEvent("video:imported", (_, event) => {
    setEntries((entries) => [...entries, event]);
  });

  useSocketEvent("video:upvoted", (_, event) => {
    const { id, upvotedUserIds } = event;
    setEntries((entries) => {
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
      <ol
        ref={playlistRef}
        className="h-[calc(100%-48px)] px-4 overflow-auto scrollbar-thin scroll-thumb-rounded scrollbar-thumb-muted"
      >
        {entries[0] ? (
          <li className="mt-2">
            <CurrentItem entry={entries[0]} />
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
