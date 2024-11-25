import type { Route } from "./+types/route";

export function meta() {
  return [{ title: "Room | Cinema" }];
}

export default function RoomPage({ params: { slug } }: Route.ComponentProps) {
  return <h1>Room {slug}</h1>;
}
