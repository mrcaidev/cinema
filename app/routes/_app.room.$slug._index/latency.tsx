import { useEffect, useState } from "react";
import { useSocket } from "./socket-context";

export function Latency() {
  const socket = useSocket();

  const [latency, setLatency] = useState(0);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const interval = setInterval(async () => {
      const start = Date.now();
      await socket.emitWithAck("ping");
      const end = Date.now();
      setLatency(end - start);
    }, 3000);

    return () => clearInterval(interval);
  }, [socket]);

  return <p>Latency: {latency}ms</p>;
}
