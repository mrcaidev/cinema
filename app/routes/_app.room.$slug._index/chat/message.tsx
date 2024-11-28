import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/app/components/ui/cn";
import { UserAvatar } from "@/app/components/user-avatar";
import type { RoomUser } from "@/common/types";
import { isAdmin, isHost } from "@/common/utils";
import { useLoaderData } from "react-router";
import type { loader } from "../route";

export type MessageEntry = {
  type: "message";
  id: string;
  from: RoomUser;
  content: string;
  sentTime: number;
  isWaitingForAck?: boolean;
};

type Props = {
  entry: MessageEntry;
};

export function Message({ entry }: Props) {
  const { room, me } = useLoaderData<typeof loader>();

  return (
    <div
      className={cn(
        "group flex gap-2",
        entry.isWaitingForAck && "opacity-50",
        entry.from.id === me.id && "flex-row-reverse",
      )}
    >
      <UserAvatar user={entry.from} className="translate-y-0.5" />
      <div
        className={cn(
          "flex flex-col gap-1",
          entry.from.id === me.id ? "items-end" : "items-start",
        )}
      >
        <p
          className={cn(
            "flex items-center gap-2 text-muted-foreground",
            entry.from.id === me.id && "flex-row-reverse",
          )}
        >
          {isHost(room, entry.from) && (
            <Badge className="px-2 rounded bg-yellow-600/80 pointer-events-none">
              HOST
            </Badge>
          )}
          {isAdmin(room, entry.from) && (
            <Badge className="px-2 rounded bg-green-600/80 pointer-events-none">
              ADMIN
            </Badge>
          )}
          <span className="text-sm">{entry.from.nickname}</span>
          <span className="hidden group-hover:inline text-xs">
            {new Date(entry.sentTime).toLocaleTimeString()}
          </span>
        </p>
        <p className="max-w-48 sm:max-w-96 xl:max-w-64 px-3 py-2 rounded-md bg-muted break-words">
          {entry.content}
        </p>
      </div>
    </div>
  );
}
