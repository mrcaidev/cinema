import { findUserById } from "@/database/user";
import { getUserSession } from "@/utils/session";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const userSession = await getUserSession(request.headers.get("Cookie"));

  const userId = userSession.get("id");

  if (!userId) {
    return null;
  }

  const user = await findUserById(userId);

  return user;
}
