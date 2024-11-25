import type { User, UserWithCredentials } from "@/types";
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

export async function hasUserByEmail(email: string) {
  const count = await collection.countDocuments({ email, deletedTime: null });

  return count > 0;
}

export async function findUserWithCredentialsByEmail(email: string) {
  const doc = await collection.findOne({ email, deletedTime: null });

  if (!doc) {
    return null;
  }

  return toUserWithCredentials(doc);
}

type CreateUserDto = {
  email: string;
  passwordHash: string;
  nickname: string | null;
  avatarUrl: string | null;
};

export async function createUser(dto: CreateUserDto) {
  const doc: Doc = {
    email: dto.email,
    nickname: dto.nickname,
    avatarUrl: dto.avatarUrl,
    createdTime: Date.now(),
    deletedTime: null,
    passwordHash: dto.passwordHash,
  };

  const { insertedId } = await collection.insertOne({ ...doc });

  return toUser({ _id: insertedId, ...doc });
}

function toUserWithCredentials(doc: WithId<Doc>): UserWithCredentials {
  const { _id, ...rest } = doc;

  return { id: _id.toHexString(), ...rest };
}

function toUser(doc: WithId<Doc>): User {
  const { _id, passwordHash, ...rest } = doc;

  return { id: _id.toHexString(), ...rest };
}
