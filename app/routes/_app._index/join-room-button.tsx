import { Button } from "@/components/ui/button";
import { UsersRoundIcon } from "lucide-react";
import { Link } from "react-router";

export function JoinRoomButton() {
  return (
    <Button variant="secondary" asChild>
      <Link to="/room/join">
        <UsersRoundIcon />
        Join room
      </Link>
    </Button>
  );
}
