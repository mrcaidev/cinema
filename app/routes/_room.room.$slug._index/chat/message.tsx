import { cn } from "@/app/components/ui/cn";
import { UserAvatar } from "@/app/components/user-avatar";
import { useLoaderData } from "react-router";
import type { loader } from "../route";
import type { MessageEvent } from "./types";

type Props = {
  message: MessageEvent;
};

export function Message({ message }: Props) {
  const { me } = useLoaderData<typeof loader>();

  return (
    <div
      className={cn(
        "group flex items-start gap-2",
        message.isWaitingForAck && "opacity-50",
        message.fromUser.id === me.id && "flex-row-reverse",
      )}
    >
      <UserAvatar user={message.fromUser} />
      <div
        className={cn(
          "flex flex-col gap-1",
          message.fromUser.id === me.id ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 text-muted-foreground",
            message.fromUser.id === me.id && "flex-row-reverse",
          )}
        >
          {message.fromUser.role === "host" && (
            <div className="px-1.5 rounded bg-yellow-600/80 text-foreground text-[0.6rem] leading-relaxed">
              HOST
            </div>
          )}
          {message.fromUser.role === "admin" && (
            <div className="px-1.5 rounded bg-green-600/80 text-foreground text-[0.6rem] leading-relaxed">
              ADMIN
            </div>
          )}
          <span className="text-sm">{message.fromUser.nickname}</span>
          <span className="hidden group-hover:inline text-xs">
            {new Date(message.sentTime).toLocaleTimeString()}
          </span>
        </div>
        <p className="max-w-48 sm:max-w-96 xl:max-w-64 px-3 py-2 rounded-md bg-muted break-words">
          {message.content}
        </p>
      </div>
    </div>
  );
}
