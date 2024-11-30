import { DropdownMenuItem } from "@/app/components/ui/dropdown-menu";
import { ListXIcon } from "lucide-react";
import { useSocket } from "../socket-context";

type Props = {
  id: string;
};

export function RemoveButton({ id }: Props) {
  const socket = useSocket();
  const remove = (event: Event) => {
    event.preventDefault();

    if (!socket) {
      return;
    }

    socket.emit("playlist:remove", { id });
  };

  return (
    <DropdownMenuItem onSelect={remove} className="cursor-pointer">
      <ListXIcon />
      Remove
    </DropdownMenuItem>
  );
}
