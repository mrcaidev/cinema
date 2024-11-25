import { findUserWithPasswordByEmail } from "@/database/user";
import { commitUserSession, getUserSession } from "@/utils/session";
import { compare } from "bcrypt";
import { data, redirect } from "react-router";
import * as v from "valibot";
import type { Route } from "./+types/route";

const schema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8), v.maxLength(20)),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const { success, issues, output } = await v.safeParseAsync(
    schema,
    Object.fromEntries(formData),
  );

  if (!success) {
    return data({ error: issues[0].message }, { status: 400 });
  }

  const { email, password } = output;

  const user = await findUserWithPasswordByEmail(email);

  if (!user) {
    return data(
      { error: "This email has not yet been registered." },
      { status: 400 },
    );
  }

  const isCorrectPassword = await compare(password, user.passwordHash);

  if (!isCorrectPassword) {
    return data({ error: "Password is incorrect" }, { status: 401 });
  }

  const userSession = await getUserSession(request.headers.get("Cookie"));

  userSession.set("id", user.id);

  const userCookie = await commitUserSession(userSession);

  return redirect("/", { headers: { "Set-Cookie": userCookie } });
}
