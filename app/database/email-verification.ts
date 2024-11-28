import type { EmailVerification } from "@/app/types";
import { ObjectId, type WithId } from "mongodb";
import { db } from "./db";

type Doc = Omit<EmailVerification, "id">;

const collection = db.collection<Doc>("emailVerifications");

export async function findEmailVerificationById(id: string) {
  const doc = await collection.findOne({ _id: new ObjectId(id) });

  if (!doc) {
    return null;
  }

  return toEmailVerification(doc);
}

type CreateEmailVerificationDto = {
  email: string;
  otp: string;
};

export async function createEmailVerification(dto: CreateEmailVerificationDto) {
  const doc: Doc = {
    email: dto.email,
    otp: dto.otp,
    createdTime: Date.now(),
    verifiedTime: null,
  };

  const { insertedId } = await collection.insertOne({ ...doc });

  return toEmailVerification({ _id: insertedId, ...doc });
}

export async function verifyEmailVerificationById(id: string) {
  const doc = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { verifiedTime: Date.now() } },
    { returnDocument: "after" },
  );

  if (!doc) {
    return null;
  }

  return toEmailVerification(doc);
}

function toEmailVerification(doc: WithId<Doc>): EmailVerification {
  const { _id, ...rest } = doc;

  return { id: _id.toHexString(), ...rest };
}
