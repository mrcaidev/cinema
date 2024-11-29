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

type VideoImportEvent = {
  url: string;
  provider: string;
  title: string;
  html: string;
};

type VideoImportedEvent = VideoImportEvent & {
  id: string;
  fromUser: RoomUser;
  bumpCount: number;
};

export type ClientToServerEvents = {
  ping: (callback: () => void) => void;
  "message:send": (event: MessageSendEvent, callback: () => void) => void;
  "video:import": (event: VideoImportEvent, callback: () => void) => void;
};

export type ServerToClientEvents = {
  "user:joined": (event: UserJoinedEvent) => void;
  "user:left": (event: UserLeftEvent) => void;
  "message:sent": (event: MessageSentEvent) => void;
  "video:imported": (event: VideoImportedEvent) => void;
};
