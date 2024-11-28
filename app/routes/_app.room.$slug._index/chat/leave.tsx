import type { RoomUser } from "@/common/types";

export type LeaveEntry = {
  type: "leave";
  id: string;
  user: RoomUser;
  leftTime: number;
};

type Props = {
  entry: LeaveEntry;
};

export function Leave({ entry }: Props) {
  return (
    <div className="text-muted-foreground text-sm text-center">
      {entry.user.nickname} leaves the room
    </div>
  );
}
