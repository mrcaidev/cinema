import { Input } from "@/app/components/ui/input";
import { UserAvatar } from "@/app/components/user-avatar";
import {
  useRef,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { useLoaderData } from "react-router";
import type { loader } from "../route";
import { useSocket } from "../socket-context";
import type { ChatEvent } from "./types";

type Props = {
  setEvents: Dispatch<SetStateAction<ChatEvent[]>>;
};

export function MessageInput({ setEvents }: Props) {
  const { me, role } = useLoaderData<typeof loader>();

  const socket = useSocket();

  const formRef = useRef<HTMLFormElement>(null);

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!socket) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const content = formData.get("content")?.toString();

    if (!content) {
      return;
    }

    const id = crypto.randomUUID();
    const sentTime = Date.now();

    setEvents((events) => [
      ...events,
      {
        type: "chat" as const,
        id,
        fromUser: {
          id: me.id,
          nickname: me.nickname,
          avatarUrl: me.avatarUrl,
          role,
        },
        content,
        sentTime,
        isWaitingForAck: true,
      },
    ]);

    formRef.current?.reset();

    await socket.emitWithAck("message:send", { id, content, sentTime });

    setEvents((events) => {
      const index = events.findIndex((event) => event.id === id);

      if (index === -1) {
        return events;
      }

      const event = events[index];

      if (!event || event.type !== "chat") {
        return events;
      }

      return events.toSpliced(index, 1, { ...event, isWaitingForAck: false });
    });
  };

  return (
    <div className="flex items-center gap-2">
      <UserAvatar user={me} />
      <form ref={formRef} onSubmit={sendMessage} className="grow">
        <label htmlFor="content" className="sr-only">
          Message
        </label>
        <Input
          name="content"
          placeholder="Say something..."
          maxLength={100}
          id="content"
        />
      </form>
    </div>
  );
}
