import { useLoaderData } from "react-router";
import type { loader } from "../route";
import { InviteButton } from "./invite-button";

export function RoomInfo() {
  const { room } = useLoaderData<typeof loader>();

  return (
    <section className="flex justify-between items-center gap-2">
      <h1 className="text-lg font-medium">{room.name}</h1>
      <InviteButton />
    </section>
  );
}
