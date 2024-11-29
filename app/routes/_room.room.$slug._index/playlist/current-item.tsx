import { AudioLinesIcon } from "lucide-react";
import type { PlaylistEntry } from "./types";

type Props = {
  entry: PlaylistEntry;
};

export function CurrentItem({ entry }: Props) {
  return (
    <div className="flex items-center gap-3 px-2 py-1.5 rounded">
      <div className="shrink-0 relative text-muted-foreground overflow-hidden">
        <AudioLinesIcon className="absolute left-0 top-0 size-4 animate-audio-icon-before" />
        <AudioLinesIcon className="size-4 animate-audio-icon-after" />
      </div>
      <div>
        <p className="text-sm line-clamp-1">{entry.title}</p>
        <p className="text-muted-foreground text-sm">
          from {entry.fromUser.nickname}
        </p>
      </div>
    </div>
  );
}
