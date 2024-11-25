import { createEmailVerification } from "@/database/email-verification";
import { hasUserByEmail } from "@/database/user";
import { sendEmail } from "@/utils/email";
import {
  commitEmailVerificationSession,
  getEmailVerificationSession,
} from "@/utils/session";
import { data, redirect } from "react-router";
import * as v from "valibot";
import type { Route } from "./+types/route";

const schema = v.object({
  email: v.pipe(v.string(), v.email()),
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

  const { email } = output;

  const isEmailConflicted = await hasUserByEmail(email);

  if (isEmailConflicted) {
    return data(
      { error: "This email has already been registered." },
      { status: 409 },
    );
  }

  const otp = generateOtp();

  await sendEmail({
    to: email,
    subject: "Your OTP for Registration",
    text: `Hello,\nYou have just now requested a One-Time Password (OTP) on our platform to register an account. Please enter the OTP below to verify your email.\n${otp}\nThis OTP is valid for 10 minutes, unless you have requested another OTP.\nIf you did not request any OTP, please ignore this email, and DO NOT share this OTP with anyone.\n\nBest regards,\nCinema`,
  });

  const emailVerification = await createEmailVerification({ email, otp });

  const emailVerificationSession = await getEmailVerificationSession(
    request.headers.get("Cookie"),
  );

  emailVerificationSession.set("id", emailVerification.id);

  const cookie = await commitEmailVerificationSession(emailVerificationSession);

  return redirect("/register/verify", { headers: { "Set-Cookie": cookie } });
}

function generateOtp() {
  return String(Math.floor(Math.random() * 900000));
}
