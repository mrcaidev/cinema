import { findUserById } from "@/database/user";
import { getMeSession } from "@/utils/session";
import type { Route } from "./+types/route";
import { Greeting } from "./greeting";
import { JoinRoomButton } from "./join-room-button";
import { NewRoomButton } from "./new-room-button";

export async function loader({ request }: Route.LoaderArgs) {
  const meSession = await getMeSession(request.headers.get("Cookie"));

  const meId = meSession.get("id");

  if (!meId) {
    return null;
  }

  const me = await findUserById(meId);

  return me;
}

export function meta() {
  return [{ title: "Home | Cinema" }];
}

export default function HomePage() {
  return (
    <div className="grid place-items-center min-h-[calc(100vh-80px)]">
      <div className="space-y-5 -translate-y-16">
        <Greeting />
        <div className="flex justify-center items-center gap-3">
          <JoinRoomButton />
          <NewRoomButton />
        </div>
      </div>
    </div>
  );
}
