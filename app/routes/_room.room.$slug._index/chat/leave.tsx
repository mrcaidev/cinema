import type { LeaveEvent } from "./types";

type Props = {
  leave: LeaveEvent;
};

export function Leave({ leave }: Props) {
  return (
    <div className="text-muted-foreground text-sm text-center">
      {leave.user.nickname} leaves the room
    </div>
  );
}
