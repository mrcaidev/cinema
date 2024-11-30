import type { PlaylistVideo, Room, RoomUser } from "@/common/types";
import { ObjectId, type WithId } from "mongodb";
import { nanoid } from "nanoid";
import { db } from "./db";

type Doc = Omit<Room, "id">;

const collection = db.collection<Doc>("rooms");

export async function findRoomBySlug(slug: string) {
  const doc = await collection.findOne({ slug });

  if (!doc || doc.deletedTime) {
    return null;
  }

  return toRoom(doc);
}

type CreateRoomDto = Pick<Doc, "name" | "users" | "password">;

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

type AddPlaylistVideoDto = Pick<
  PlaylistVideo,
  "url" | "provider" | "title" | "html" | "fromUser"
>;

export async function addPlaylistVideo(
  roomSlug: string,
  dto: AddPlaylistVideoDto,
) {
  const video: PlaylistVideo = {
    ...dto,
    id: crypto.randomUUID(),
    upvotedUserIds: [],
  };

  await collection.updateOne(
    { slug: roomSlug },
    { $push: { playlist: video } },
  );

  return video;
}

export async function upvotePlaylistVideo(
  roomSlug: string,
  playlistVideoId: string,
  user: RoomUser,
) {
  const room = await collection.findOne({ slug: roomSlug });

  if (!room) {
    return;
  }

  const playlistVideoIndex = room.playlist.findIndex(
    (video) => video.id === playlistVideoId,
  );

  if (playlistVideoIndex === -1) {
    return;
  }

  const playlistVideo = room.playlist[playlistVideoIndex];

  if (!playlistVideo) {
    return;
  }

  const upvotedUserIdIndex = playlistVideo.upvotedUserIds.indexOf(user.id);

  const newUpvotedUserIds =
    upvotedUserIdIndex === -1
      ? [...playlistVideo.upvotedUserIds, user.id]
      : playlistVideo.upvotedUserIds.toSpliced(upvotedUserIdIndex, 1);

  await collection.updateOne(
    { slug: roomSlug },
    {
      $set: {
        [`playlist.${playlistVideoIndex}.upvotedUserIds`]: newUpvotedUserIds,
      },
    },
  );

  return newUpvotedUserIds;
}

export async function removePlaylistVideo(
  roomSlug: string,
  playlistVideoId: string,
) {
  await collection.updateOne(
    { slug: roomSlug },
    { $pull: { playlist: { id: playlistVideoId } } },
  );
}

function toRoom(doc: WithId<Doc>): Room {
  const { _id, ...rest } = doc;

  return { id: _id.toHexString(), ...rest };
}
