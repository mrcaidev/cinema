import { destroyUserSession, getUserSession } from "@/utils/session";
import { data } from "react-router";
import type { Route } from "./+types/route";

export async function action({ request }: Route.ActionArgs) {
  const userSession = await getUserSession(request.headers.get("Cookie"));

  const userCookie = await destroyUserSession(userSession);

  return data({}, { status: 200, headers: { "Set-Cookie": userCookie } });
}
