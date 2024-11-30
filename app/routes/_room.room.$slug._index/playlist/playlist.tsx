import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ListVideo } from "lucide-react";
import { useMemo } from "react";
import { usePlaylist } from "../playlist-context";
import { useSocketEvent } from "../socket-context";
import { CandidateVideo } from "./candidate-video";
import { CurrentVideo } from "./current-video";
import { ImportVideoButton } from "./import-video-button";

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
    setPlaylist((videos) => [...videos, event]);
  });

  useSocketEvent("playlist:upvoted", (_, event) => {
    const { id, upvotedUserIds } = event;
    setPlaylist((videos) => {
      const index = videos.findIndex((video) => video.id === id);
      if (index === -1) {
        return videos;
      }
      const video = videos[index];
      if (!video) {
        return videos;
      }
      return videos.toSpliced(index, 1, { ...video, upvotedUserIds });
    });
  });

  useSocketEvent("playlist:removed", (_, event) => {
    const { id } = event;
    setPlaylist((videos) => {
      const index = videos.findIndex((video) => video.id === id);
      if (index === -1) {
        return videos;
      }
      return videos.toSpliced(index, 1);
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
            <CurrentVideo video={playlist[0]} />
          </li>
        ) : (
          <div className="grid place-items-center h-full text-muted-foreground text-sm">
            No video yet :)
          </div>
        )}
        {prioritizedCandidates.map((video, index) => (
          <li key={video.id} className="last:mb-2">
            <CandidateVideo video={video} index={index + 1} />
          </li>
        ))}
      </ol>
    </section>
  );
}
