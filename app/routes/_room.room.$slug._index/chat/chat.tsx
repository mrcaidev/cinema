import { useAutoAnimate } from "@formkit/auto-animate/react";
import { MessageSquareIcon } from "lucide-react";
import { useState } from "react";
import { useSocketEvent } from "../socket-context";
import { Join } from "./join";
import { Leave } from "./leave";
import { Message } from "./message";
import { MessageInput } from "./message-input";
import { Ping } from "./ping";
import type { ChatEvent } from "./types";

export function Chat() {
  const [events, setEvents] = useState<ChatEvent[]>([]);

  useSocketEvent("user:joined", (_, event) => {
    setEvents((events) => [...events, { type: "join", ...event }]);
  });

  useSocketEvent("user:left", (_, event) => {
    setEvents((events) => [...events, { type: "leave", ...event }]);
  });

  useSocketEvent("message:sent", (_, event) => {
    setEvents((events) => [...events, { type: "chat", ...event }]);
  });

  const [listRef] = useAutoAnimate();

  return (
    <section className="row-span-2 rounded-md bg-muted/50">
      <div className="flex justify-between items-center px-4 pt-3 pb-2">
        <h2 className="flex items-center gap-2 text-lg font-medium">
          <MessageSquareIcon className="size-5" />
          Chat
        </h2>
        <Ping />
      </div>
      <hr className="mx-4" />
      <ol
        ref={listRef}
        className="h-[calc(100%-108px)] px-4 overflow-auto scrollbar-thin scroll-thumb-rounded scrollbar-thumb-muted"
      >
        {events.map((event) =>
          event.type === "join" ? (
            <li key={event.id} className="my-1 first:mt-3">
              <Join join={event} />
            </li>
          ) : event.type === "leave" ? (
            <li key={event.id} className="my-1 first:mt-3">
              <Leave leave={event} />
            </li>
          ) : (
            <li key={event.id} className="my-3">
              <Message message={event} />
            </li>
          ),
        )}
      </ol>
      <div className="px-4 pt-2 pb-3">
        <MessageInput setEvents={setEvents} />
      </div>
    </section>
  );
}
