import type { User, UserWithCredentials } from "@/common/types";
import { ObjectId, type WithId } from "mongodb";
import { db } from "./db";

type Doc = Omit<UserWithCredentials, "id">;

const collection = db.collection<Doc>("users");

export async function findUserById(id: string) {
  const doc = await collection.findOne({ _id: new ObjectId(id) });

  if (!doc || doc.deletedTime) {
    return null;
  }

  return toUser(doc);
}

export async function findUserByEmail(email: string) {
  const doc = await collection.findOne({ email, deletedTime: null });

  if (!doc) {
    return null;
  }

  return toUser(doc);
}

export async function findUserWithCredentialsByEmail(email: string) {
  const doc = await collection.findOne({ email, deletedTime: null });

  if (!doc) {
    return null;
  }

  return toUserWithCredentials(doc);
}

type CreateUserDto = Pick<
  Doc,
  "email" | "nickname" | "passwordSalt" | "passwordHash"
>;

export async function createUser(dto: CreateUserDto) {
  const doc: Doc = {
    ...dto,
    avatarUrl: null,
    createdTime: Date.now(),
    deletedTime: null,
  };

  const { insertedId } = await collection.insertOne({ ...doc });

  return toUser({ _id: insertedId, ...doc });
}

function toUserWithCredentials(doc: WithId<Doc>): UserWithCredentials {
  const { _id, ...rest } = doc;

  return { id: _id.toHexString(), ...rest };
}

function toUser(doc: WithId<Doc>): User {
  const { _id, passwordSalt, passwordHash, ...rest } = doc;

  return { id: _id.toHexString(), ...rest };
}
