import { DropdownMenuItem } from "@/app/components/ui/dropdown-menu";
import { ArrowBigUpIcon } from "lucide-react";
import { useLoaderData } from "react-router";
import type { loader } from "../route";
import { useSocket } from "../socket-context";

type Props = {
  id: string;
  upvotedUserIds: string[];
};

export function UpvoteVideoButton({ id, upvotedUserIds }: Props) {
  const { me } = useLoaderData<typeof loader>();

  const isUpvoted = upvotedUserIds.some((userId) => userId === me.id);

  const socket = useSocket();

  const upvoteVideo = (event: Event) => {
    event.preventDefault();

    if (!socket) {
      return;
    }

    socket.emit("playlist:upvote", { id });
  };

  return (
    <DropdownMenuItem onSelect={upvoteVideo} className="cursor-pointer">
      <ArrowBigUpIcon fill={isUpvoted ? "currentColor" : undefined} />
      {isUpvoted ? "Upvoted" : "Upvote"}
      <span className="text-muted-foreground">({upvotedUserIds.length})</span>
    </DropdownMenuItem>
  );
}
