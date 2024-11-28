import type { User } from "@/common/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  user: Pick<User, "nickname" | "avatarUrl">;
  className?: string;
};

export function UserAvatar({ user, className }: Props) {
  return (
    <Avatar className={className}>
      <AvatarImage src={user.avatarUrl ?? undefined} alt="" />
      <AvatarFallback className="uppercase">
        {user.nickname?.[0] ?? "U"}
      </AvatarFallback>
    </Avatar>
  );
}
