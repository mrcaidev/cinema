import type { User } from "@/app/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  user: Pick<User, "nickname" | "avatarUrl">;
};

export function UserAvatar({ user }: Props) {
  return (
    <Avatar>
      <AvatarImage src={user.avatarUrl ?? undefined} alt="" />
      <AvatarFallback className="uppercase">
        {user.nickname?.[0] ?? "U"}
      </AvatarFallback>
    </Avatar>
  );
}
