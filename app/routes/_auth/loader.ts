import { getUserSession } from "@/utils/session";
import { redirect } from "react-router";
import type { Route } from "./+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  const userSession = await getUserSession(request.headers.get("Cookie"));

  const isLoggedIn = userSession.has("id");

  if (isLoggedIn) {
    return redirect("/");
  }

  return;
}
