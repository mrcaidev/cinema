import type { JoinEvent } from "./types";

type Props = {
  join: JoinEvent;
};

export function Join({ join }: Props) {
  return (
    <div className="text-muted-foreground text-sm text-center">
      {join.user.nickname} joins the room
    </div>
  );
}
