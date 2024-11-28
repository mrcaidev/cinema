import { Badge } from "@/app/components/ui/badge";
import { UserAvatar } from "@/app/components/user-avatar";
import { InviteButton } from "./invite-button";
import { Playlist } from "./playlist";

export function Control() {
  return (
    <section className="flex justify-between items-center gap-x-6 gap-y-4 flex-wrap">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">
            Never Gonna Give You Up
            <Badge className="inline ml-2 bg-pink-500 align-middle pointer-events-none">
              BILIBILI
            </Badge>
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <UserAvatar
            user={{ nickname: null, avatarUrl: null }}
            className="size-7"
          />
          Some user added 32 minutes ago
        </div>
      </div>
      <div className="flex items-center gap-2">
        <InviteButton />
        <Playlist />
      </div>
    </section>
  );
}
