import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { EllipsisVerticalIcon, ExternalLinkIcon } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import type { loader } from "../route";
import { RemoveButton } from "./remove-button";
import type { PlaylistEntry } from "./types";
import { UpvoteButton } from "./upvote-button";

type Props = {
  entry: PlaylistEntry;
  index: number;
};

export function PlaylistItem({ entry, index }: Props) {
  const { role } = useLoaderData<typeof loader>();

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
      {role !== "visitor" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <UpvoteButton id={entry.id} upvotedUserIds={entry.upvotedUserIds} />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to={entry.url}>
                <ExternalLinkIcon />
                Original video on {entry.provider}
              </Link>
            </DropdownMenuItem>
            <RemoveButton id={entry.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
