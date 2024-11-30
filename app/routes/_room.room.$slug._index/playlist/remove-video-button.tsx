import { DropdownMenuItem } from "@/app/components/ui/dropdown-menu";
import { ListXIcon } from "lucide-react";
import { useSocket } from "../socket-context";

type Props = {
  id: string;
};

export function RemoveVideoButton({ id }: Props) {
  const socket = useSocket();

  const removeVideo = (event: Event) => {
    event.preventDefault();

    if (!socket) {
      return;
    }

    socket.emit("playlist:remove", { id });
  };

  return (
    <DropdownMenuItem
      onSelect={removeVideo}
      className="!text-destructive cursor-pointer"
    >
      <ListXIcon />
      Remove
    </DropdownMenuItem>
  );
}
