import { useAutoAnimate } from "@formkit/auto-animate/react";
import { MessageSquareIcon } from "lucide-react";
import { useState } from "react";
import { useSocketEvent } from "../socket-context";
import { Join, type JoinEntry } from "./join";
import { Leave, type LeaveEntry } from "./leave";
import { Message, type MessageEntry } from "./message";
import { MessageInput } from "./message-input";
import { Ping } from "./ping";

export type ChatEntry = JoinEntry | LeaveEntry | MessageEntry;

export function Chat() {
  const [entries, setEntries] = useState<ChatEntry[]>([]);

  useSocketEvent("user:joined", (_, event) => {
    setEntries((entries) => [...entries, { type: "join", ...event }]);
  });

  useSocketEvent("user:left", (_, event) => {
    setEntries((entries) => [...entries, { type: "leave", ...event }]);
  });

  useSocketEvent("message:sent", (_, event) => {
    setEntries((entries) => [...entries, { type: "message", ...event }]);
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
        {entries.map((chatEntry) =>
          chatEntry.type === "join" ? (
            <li key={chatEntry.id} className="my-1 first:mt-3">
              <Join entry={chatEntry} />
            </li>
          ) : chatEntry.type === "leave" ? (
            <li key={chatEntry.id} className="my-1 first:mt-3">
              <Leave entry={chatEntry} />
            </li>
          ) : (
            <li key={chatEntry.id} className="my-3">
              <Message entry={chatEntry} />
            </li>
          ),
        )}
      </ol>
      <div className="px-4 pt-2 pb-3">
        <MessageInput setEntries={setEntries} />
      </div>
    </section>
  );
}
