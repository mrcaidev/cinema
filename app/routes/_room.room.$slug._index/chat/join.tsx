import type { RoomUser } from "@/common/types";

export type JoinEntry = {
  type: "join";
  id: string;
  user: RoomUser;
  joinedTime: number;
};

type Props = {
  entry: JoinEntry;
};

export function Join({ entry }: Props) {
  return (
    <div className="text-muted-foreground text-sm text-center">
      {entry.user.nickname} joins the room
    </div>
  );
}
