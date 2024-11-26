import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useSocket } from "./socket-context";

export function Chat() {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("event", console.log);

    socket.emit("event", "ping");
  });

  return <Button onClick={() => socket?.emit("event", "ping")}>Ping</Button>;
}
