import { cn } from "@/app/components/ui/cn";
import { useEffect, useState } from "react";
import { useSocket } from "../socket-context";

export function Ping() {
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

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "size-1.5 rounded-full",
          latency < 200
            ? "bg-green-500"
            : latency < 1000
              ? "bg-yellow-500"
              : "bg-red-500",
        )}
      />
      <span className="text-muted-foreground text-xs">Ping: {latency}ms</span>
    </div>
  );
}
