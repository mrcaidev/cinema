import { destroyUserSession, getUserSession } from "@/utils/session";
import { data, type ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  const userSession = await getUserSession(request.headers.get("Cookie"));

  const userCookie = await destroyUserSession(userSession);

  return data({}, { status: 200, headers: { "Set-Cookie": userCookie } });
}
