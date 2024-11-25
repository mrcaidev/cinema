import { findUserById } from "@/database/user";
import type { User } from "@/types";
import { destroyMeSession, getMeSession } from "@/utils/session";
import { data, redirect } from "react-router";

type LoadMeOptions<Strict extends boolean> = {
  /**
   * For those users who have not yet logged in:
   *
   * If `strict` is `true`, they will be redirected to the login page.
   *
   * If `strict` is `false`, the loader will return `null`.
   */
  strict?: Strict;
};

export async function loadMe<Strict extends boolean>(
  request: Request,
  options: LoadMeOptions<Strict> = {},
): Promise<Strict extends true ? User : User | null> {
  const { strict = false as Strict } = options;

  const meSession = await getMeSession(request.headers.get("Cookie"));

  const meId = meSession.get("id");

  if (!meId) {
    if (strict) {
      return redirect("/login") as never;
    }

    return null as unknown as User;
  }

  const me = await findUserById(meId);

  if (!me) {
    const meCookie = await destroyMeSession(meSession);

    if (strict) {
      return redirect("/login", {
        headers: { "Set-Cookie": meCookie },
      }) as never;
    }

    return data(null as unknown as User, {
      headers: { "Set-Cookie": meCookie },
    }) as unknown as User;
  }

  return me;
}
