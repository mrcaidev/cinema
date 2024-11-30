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

export type RoomUser = Pick<User, "id" | "nickname" | "avatarUrl"> & {
  role: "host" | "admin" | "member" | "visitor";
};

export type PlaylistVideo = {
  id: string;
  url: string;
  provider: string;
  title: string;
  html: string;
  fromUser: RoomUser;
  upvotedUserIds: string[];
};

export type Room = {
  id: string;
  slug: string;
  name: string;
  password: string | null;
  users: RoomUser[];
  playlist: PlaylistVideo[];
  createdTime: number;
  deletedTime: number | null;
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
};

type PlaylistUpvotedEvent = PlaylistUpvoteEvent & {
  upvotedUserIds: string[];
};

type PlaylistRemoveEvent = {
  id: string;
};

type PlaylistRemovedEvent = PlaylistRemoveEvent;

export type ClientToServerEvents = {
  ping: (callback: () => void) => void;
  "message:send": (event: MessageSendEvent, callback: () => void) => void;
  "playlist:import": (event: PlaylistImportEvent, callback: () => void) => void;
  "playlist:upvote": (event: PlaylistUpvoteEvent) => void;
  "playlist:remove": (event: PlaylistRemoveEvent) => void;
};

export type ServerToClientEvents = {
  "user:joined": (event: UserJoinedEvent) => void;
  "user:left": (event: UserLeftEvent) => void;
  "message:sent": (event: MessageSentEvent) => void;
  "playlist:imported": (event: PlaylistImportedEvent) => void;
  "playlist:upvoted": (event: PlaylistUpvotedEvent) => void;
  "playlist:removed": (event: PlaylistRemovedEvent) => void;
};
