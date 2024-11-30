import type { RoomUser } from "@/common/types";

export type JoinEvent = {
  type: "join";
  id: string;
  user: RoomUser;
  joinedTime: number;
};

export type LeaveEvent = {
  type: "leave";
  id: string;
  user: RoomUser;
  leftTime: number;
};

export type MessageEvent = {
  type: "chat";
  id: string;
  fromUser: RoomUser;
  content: string;
  sentTime: number;
  isWaitingForAck?: boolean;
};

export type ChatEvent = JoinEvent | LeaveEvent | MessageEvent;
