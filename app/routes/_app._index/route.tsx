import { Greeting } from "./greeting";
import { JoinRoomButton } from "./join-room-button";
import { NewRoomButton } from "./new-room-button";

export default function Page() {
  return (
    <div className="grid place-items-center min-h-[calc(100vh-80px)]">
      <div className="space-y-5 -translate-y-16">
        <Greeting />
        <div className="flex items-center gap-3">
          <NewRoomButton />
          <JoinRoomButton />
        </div>
      </div>
    </div>
  );
}

export { loader } from "./loader";
export { meta } from "./meta";
