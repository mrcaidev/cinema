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
import type { ChatEntry } from "./chat";

type Props = {
  setEntries: Dispatch<SetStateAction<ChatEntry[]>>;
};

export function MessageInput({ setEntries }: Props) {
  const { me } = useLoaderData<typeof loader>();

  const socket = useSocket();

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!socket) {
      return;
    }

    const content = new FormData(e.currentTarget).get("content")?.toString();

    if (!content) {
      return;
    }

    const id = crypto.randomUUID();
    const sentTime = Date.now();

    setEntries((entries) => [
      ...entries,
      {
        type: "message" as const,
        id,
        fromUser: me,
        content,
        sentTime,
        isWaitingForAck: true,
      },
    ]);

    formRef.current?.reset();

    await socket.emitWithAck("message:send", { id, content, sentTime });

    setEntries((entries) => {
      const index = entries.findIndex((entry) => entry.id === id);

      if (index === -1) {
        return entries;
      }

      return [
        ...entries.slice(0, index),
        // biome-ignore lint/style/noNonNullAssertion: Must exist.
        { ...entries[index]!, isWaitingForAck: false },
        ...entries.slice(index + 1),
      ];
    });
  };

  return (
    <div className="flex items-center gap-2">
      <UserAvatar user={me} />
      <form ref={formRef} onSubmit={handleSubmit} className="grow">
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
