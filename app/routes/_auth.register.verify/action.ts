import {
  findEmailVerificationById,
  verifyEmailVerificationById,
} from "@/database/email-verification";
import { getEmailVerificationSession } from "@/utils/session";
import { data, redirect } from "react-router";
import * as v from "valibot";
import type { Route } from "./+types/route";

const schema = v.object({
  otp: v.pipe(v.string(), v.regex(/^\d{6}$/)),
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

  const { otp } = output;

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

  if (emailVerification.verifiedTime) {
    return data(
      { error: "This email has already been verified" },
      { status: 409 },
    );
  }

  if (otp !== emailVerification.otp) {
    return data({ error: "OTP is incorrect" }, { status: 400 });
  }

  const elapsedTime = Date.now() - emailVerification.createdTime;

  if (elapsedTime > 10 * 60 * 1000) {
    return data({ error: "OTP has expired" }, { status: 422 });
  }

  await verifyEmailVerificationById(emailVerificationId);

  return redirect("/register/details");
}
