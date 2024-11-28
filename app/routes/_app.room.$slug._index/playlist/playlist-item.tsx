import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/cn";
import { ArrowBigUpIcon } from "lucide-react";
import type { PlaylistEntry } from "./types";

type Props = {
  entry: PlaylistEntry;
  index: number;
};

export function PlaylistItem({ entry, index }: Props) {
  return (
    <div className="group flex items-center gap-3 px-2 py-1.5 rounded">
      <div className="shrink-0 w-4 text-muted-foreground text-center">
        {index}
      </div>
      <div className="grow">
        <p className="text-sm line-clamp-1">{entry.title}</p>
        <p className="text-muted-foreground text-sm">
          from {entry.fromUser.nickname}
        </p>
      </div>
      <div
        className={cn(entry.bumpCount === 0 && "invisible group-hover:visible")}
      >
        <Button
          variant="ghost"
          className="gap-1 [&_svg]:size-5 px-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowBigUpIcon />
          {entry.bumpCount}
        </Button>
      </div>
    </div>
  );
}
