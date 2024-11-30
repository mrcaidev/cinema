import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { UserAvatar } from "@/app/components/user-avatar";
import type { PlaylistVideo } from "@/common/types";
import { EllipsisVerticalIcon } from "lucide-react";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  video: PlaylistVideo;
}>;

export function VideoMenu({ video, children }: Props) {
  return (
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
      <DropdownMenuContent align="end" className="max-w-64">
        <div className="space-y-2 px-2 py-1.5 text-sm">
          <p className="font-medium">{video.title}</p>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <UserAvatar user={video.fromUser} className="size-6" />
            <span>{video.fromUser.nickname}</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
