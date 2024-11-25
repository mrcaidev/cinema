import type { Route } from "./+types/route";

export function meta() {
  return [{ title: "Welcome | Cinema" }];
}

export default function RoomWelcomePage({
  params: { slug },
}: Route.ComponentProps) {
  return <h1>Welcome to room {slug}</h1>;
}
