import type { RoomUser } from "@/common/types";

export type PlaylistEntry = {
  id: string;
  url: string;
  provider: string;
  title: string;
  html: string;
  fromUser: RoomUser;
  upvotedUserIds: string[];
};
