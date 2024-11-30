import { Link, useLoaderData } from "react-router";
import type { loader } from "../route";
import { InviteButton } from "./invite-button";

export function RoomInfo() {
  const { room } = useLoaderData<typeof loader>();

  return (
    <section className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-1 w-fit text-muted-foreground text-sm"
        >
          <img src="/favicon.svg" alt="" width={24} height={24} />
        </Link>
        <div className="w-[1px] h-6 bg-muted" />
        <h1 className="text-lg font-medium">{room.name}</h1>
      </div>
      <InviteButton />
    </section>
  );
}
