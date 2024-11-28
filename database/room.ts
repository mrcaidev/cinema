import type { Room, RoomUser, RoomWithCredentials } from "@/common/types";
import { ObjectId, type WithId } from "mongodb";
import { nanoid } from "nanoid";
import { db } from "./db";

type Doc = Omit<RoomWithCredentials, "id">;

const collection = db.collection<Doc>("rooms");

export async function findRoomBySlug(slug: string) {
  const doc = await collection.findOne({ slug });

  if (!doc || doc.deletedTime) {
    return null;
  }

  return toRoom(doc);
}

export async function findRoomWithCredentialsBySlug(slug: string) {
  const doc = await collection.findOne({ slug });

  if (!doc || doc.deletedTime) {
    return null;
  }

  return toRoomWithCredentials(doc);
}

type CreateRoomDto = Pick<
  Doc,
  "name" | "host" | "passwordSalt" | "passwordHash"
>;

export async function createRoom(dto: CreateRoomDto) {
  const doc: Doc = {
    ...dto,
    slug: nanoid(10),
    admins: [],
    members: [],
    visitors: [],
    createdTime: Date.now(),
    deletedTime: null,
  };

  const { insertedId } = await collection.insertOne({ ...doc });

  return toRoom({ _id: insertedId, ...doc });
}

export async function admitMemberToRoomById(id: string, member: RoomUser) {
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $push: { members: member } },
  );
}

export async function admitVisitorToRoomById(id: string, visitorId: string) {
  const visitor: RoomUser = {
    id: visitorId,
    nickname: `Visitor ${visitorId}`,
    avatarUrl: null,
  };

  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $push: { visitors: visitor } },
  );
}

function toRoomWithCredentials(doc: WithId<Doc>): RoomWithCredentials {
  const { _id, ...rest } = doc;

  return { id: _id.toHexString(), ...rest };
}

function toRoom(doc: WithId<Doc>): Room {
  const { _id, passwordSalt, passwordHash, ...rest } = doc;

  return { id: _id.toHexString(), ...rest };
}
