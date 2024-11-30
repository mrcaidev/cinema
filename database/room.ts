import type {
  PlaylistEntry,
  Room,
  RoomUser,
  RoomWithCredentials,
} from "@/common/types";
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
  "name" | "users" | "passwordSalt" | "passwordHash"
>;

export async function createRoom(dto: CreateRoomDto) {
  const doc: Doc = {
    ...dto,
    slug: nanoid(10),
    playlist: [],
    createdTime: Date.now(),
    deletedTime: null,
  };

  const { insertedId } = await collection.insertOne({ ...doc });

  return toRoom({ _id: insertedId, ...doc });
}

export async function admitUserToRoomById(id: string, user: RoomUser) {
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $push: { users: user } },
  );
}

type AddPlaylistEntryToRoomBySlugDto = Pick<
  PlaylistEntry,
  "url" | "provider" | "title" | "html" | "fromUser"
>;

export async function addPlaylistEntryToRoomBySlug(
  slug: string,
  dto: AddPlaylistEntryToRoomBySlugDto,
) {
  const entry: PlaylistEntry = {
    ...dto,
    id: nanoid(),
    upvotedUserIds: [],
  };

  await collection.updateOne({ slug }, { $push: { playlist: entry } });

  return entry;
}

type UpdateUpvotedUserIdsInRoomBySlugDto = {
  id: string;
  upvotedUserIds: string[];
};

export async function updateUpvotedUserIdsInRoomBySlug(
  slug: string,
  dto: UpdateUpvotedUserIdsInRoomBySlugDto,
) {
  await collection.updateOne(
    { slug, "playlist.id": dto.id },
    { $set: { "playlist.$.upvotedUserIds": dto.upvotedUserIds } },
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
