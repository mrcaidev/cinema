import { useState } from "react";
import { useSocketEvent } from "../socket-context";
import { Join, type JoinEntry } from "./join";
import { Leave, type LeaveEntry } from "./leave";
import { Message, type MessageEntry } from "./message";
import { MessageInput } from "./message-input";

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

  return (
    <section className="grow xl:grow-0 flex flex-col xl:min-w-[420px] h-96 xl:h-[calc(100vh-112px)] py-3 rounded-md bg-muted/50">
      <h2 className="px-4 mb-2 text-lg font-medium">Chat</h2>
      <hr className="mx-4" />
      <ol className="grow px-4 overflow-auto scrollbar-thin scroll-thumb-rounded scrollbar-thumb-muted">
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
      <div className="px-4 mt-2">
        <MessageInput setEntries={setEntries} />
      </div>
    </section>
  );
}
