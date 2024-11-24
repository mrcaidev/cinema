import { getUserSession } from "@/utils/session";
import { redirect, type LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const userSession = await getUserSession(request.headers.get("Cookie"));

  const isLoggedIn = userSession.has("id");

  if (isLoggedIn) {
    return redirect("/");
  }

  return;
}
