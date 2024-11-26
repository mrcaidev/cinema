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

type CreateUserDto = {
  email: string;
  nickname: string | null;
  passwordSalt: string;
  passwordHash: string;
};

export async function createUser(dto: CreateUserDto) {
  const doc: Doc = {
    email: dto.email,
    nickname: dto.nickname,
    avatarUrl: null,
    createdTime: Date.now(),
    deletedTime: null,
    passwordSalt: dto.passwordSalt,
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
  const { _id, passwordSalt, passwordHash, ...rest } = doc;

  return { id: _id.toHexString(), ...rest };
}
