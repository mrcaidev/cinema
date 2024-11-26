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
  createdTime: number;
  deletedTime: number | null;
};

export type RoomWithCredentials = Room & {
  passwordSalt: string | null;
  passwordHash: string | null;
};
