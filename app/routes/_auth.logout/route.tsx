import { destroyMeSession, getMeSession } from "@/utils/session";
import { data } from "react-router";
import type { Route } from "./+types/route";

export async function action({ request }: Route.ActionArgs) {
  const meSession = await getMeSession(request.headers.get("Cookie"));

  const meCookie = await destroyMeSession(meSession);

  return data({}, { status: 200, headers: { "Set-Cookie": meCookie } });
}
