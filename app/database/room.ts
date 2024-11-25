import type { Room, RoomWithCredentials, User } from "@/types";
import type { WithId } from "mongodb";
import { nanoid } from "nanoid";
import { db } from "./db";

type Doc = Omit<RoomWithCredentials, "id">;

const collection = db.collection<Doc>("rooms");

type CreateRoomDto = {
  name: string;
  host: User;
  passwordHash: string | null;
};

export async function createRoom(dto: CreateRoomDto) {
  const doc: Doc = {
    slug: nanoid(10),
    name: dto.name,
    host: {
      id: dto.host.id,
      nickname: dto.host.nickname,
      avatarUrl: dto.host.avatarUrl,
    },
    admins: [],
    members: [],
    createdTime: Date.now(),
    deletedTime: null,
    passwordHash: dto.passwordHash,
  };

  const { insertedId } = await collection.insertOne({ ...doc });

  return toRoom({ _id: insertedId, ...doc });
}

function toRoomWithCredentials(doc: WithId<Doc>): RoomWithCredentials {
  const { _id, ...rest } = doc;

  return { id: _id.toHexString(), ...rest };
}

function toRoom(doc: WithId<Doc>): Room {
  const { _id, passwordHash, ...rest } = doc;

  return { id: _id.toHexString(), ...rest };
}
