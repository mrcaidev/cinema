import type { ClientToServerEvents } from "@/common/types";
import type { Context } from "../types";

export function handlePing(
  _: Context,
  ...args: Parameters<ClientToServerEvents["ping"]>
) {
  const [callback] = args;

  callback();
}
