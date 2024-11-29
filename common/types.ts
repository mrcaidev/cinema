export type User = {
  id: string;
  email: string;
  nickname: string | null;
  avatarUrl: string | null;
  createdTime: number;
  deletedTime: number | null;
};

export type UserWithCredentials = User & {
  passwordSalt: string;
  passwordHash: string;
};

export type EmailVerification = {
  id: string;
  email: string;
  otp: string;
  createdTime: number;
  verifiedTime: number | null;
};

export type RoomUser = Pick<User, "id" | "nickname" | "avatarUrl">;

export type Room = {
  id: string;
  slug: string;
  name: string;
  host: RoomUser;
  admins: RoomUser[];
  members: RoomUser[];
  visitors: RoomUser[];
  createdTime: number;
  deletedTime: number | null;
};

export type RoomWithCredentials = Room & {
  passwordSalt: string | null;
  passwordHash: string | null;
};

type UserJoinedEvent = {
  id: string;
  user: RoomUser;
  joinedTime: number;
};

type UserLeftEvent = {
  id: string;
  user: RoomUser;
  leftTime: number;
};

type MessageSendEvent = {
  id: string;
  content: string;
  sentTime: number;
};

type MessageSentEvent = MessageSendEvent & {
  fromUser: RoomUser;
};

type PlaylistImportEvent = {
  url: string;
  provider: string;
  title: string;
  html: string;
};

type PlaylistImportedEvent = PlaylistImportEvent & {
  id: string;
  fromUser: RoomUser;
  upvotedUserIds: string[];
};

type PlaylistUpvoteEvent = {
  id: string;
  upvotedUserIds: string[];
};

type PlaylistUpvotedEvent = PlaylistUpvoteEvent;

export type ClientToServerEvents = {
  ping: (callback: () => void) => void;
  "message:send": (event: MessageSendEvent, callback: () => void) => void;
  "playlist:import": (event: PlaylistImportEvent, callback: () => void) => void;
  "playlist:upvote": (event: PlaylistUpvoteEvent) => void;
};

export type ServerToClientEvents = {
  "user:joined": (event: UserJoinedEvent) => void;
  "user:left": (event: UserLeftEvent) => void;
  "message:sent": (event: MessageSentEvent) => void;
  "playlist:imported": (event: PlaylistImportedEvent) => void;
  "playlist:upvoted": (event: PlaylistUpvotedEvent) => void;
};
