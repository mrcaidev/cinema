import { findEmailVerificationById } from "@/database/email-verification";
import { createUser } from "@/database/user";
import {
  commitUserSession,
  destroyEmailVerificationSession,
  getEmailVerificationSession,
  getUserSession,
} from "@/utils/session";
import { hash } from "bcrypt";
import { type ActionFunctionArgs, data, redirect } from "react-router";
import * as v from "valibot";

const schema = v.object({
  password: v.pipe(v.string(), v.minLength(8), v.maxLength(20)),
  confirmPassword: v.pipe(v.string(), v.minLength(8), v.maxLength(20)),
  nickname: v.union([
    v.pipe(v.string(), v.minLength(2), v.maxLength(20)),
    v.pipe(
      v.literal(""),
      v.transform(() => null),
    ),
  ]),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const { success, issues, output } = await v.safeParseAsync(
    schema,
    Object.fromEntries(formData),
  );

  if (!success) {
    return data({ error: issues[0].message }, { status: 400 });
  }

  const { password, confirmPassword, nickname } = output;

  if (password !== confirmPassword) {
    return data({ error: "Passwords do not match" }, { status: 400 });
  }

  const emailVerificationSession = await getEmailVerificationSession(
    request.headers.get("Cookie"),
  );

  const emailVerificationId = emailVerificationSession.get("id");

  if (!emailVerificationId) {
    return data({ error: "Please send OTP first" }, { status: 403 });
  }

  const emailVerification =
    await findEmailVerificationById(emailVerificationId);

  if (!emailVerification) {
    return data(
      { error: "This verification record does not exist" },
      { status: 404 },
    );
  }

  if (!emailVerification.verifiedTime) {
    return data(
      { error: "This email has not yet been verified" },
      { status: 403 },
    );
  }

  const { email } = emailVerification;

  const passwordHash = await hash(password, 10);

  const user = await createUser({
    email,
    nickname,
    avatarUrl: null,
    passwordHash,
  });

  const userSession = await getUserSession(request.headers.get("Cookie"));

  userSession.set("id", user.id);

  const userCookie = await commitUserSession(userSession);

  const emailVerificationCookie = await destroyEmailVerificationSession(
    emailVerificationSession,
  );

  const headers = new Headers([
    ["Set-Cookie", userCookie],
    ["Set-Cookie", emailVerificationCookie],
  ]);

  return redirect("/", { headers });
}
