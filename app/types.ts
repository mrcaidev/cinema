export type User = {
  id: string;
  email: string;
  nickname: string | null;
  avatarUrl: string | null;
  createdTime: number;
  deletedTime: number | null;
};

export type EmailVerification = {
  id: string;
  email: string;
  otp: string;
  createdTime: number;
  verifiedTime: number | null;
};
