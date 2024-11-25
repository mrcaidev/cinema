import type { Route } from "./+types/route";

export default function Page({ params: { slug } }: Route.ComponentProps) {
  return <h1>Room {slug}</h1>;
}
