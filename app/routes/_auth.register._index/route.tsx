import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { createEmailVerification } from "@/database/email-verification";
import { findUserByEmail } from "@/database/user";
import { sendEmail } from "@/utils/email";
import {
  commitEmailVerificationSession,
  getEmailVerificationSession,
} from "@/utils/session";
import { Loader2Icon, MailIcon } from "lucide-react";
import { useEffect } from "react";
import { data, Link, redirect, useFetcher } from "react-router";
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

  const conflictedUser = await findUserByEmail(email);

  if (conflictedUser) {
    return data(
      { error: "This email has already been registered." },
      { status: 409 },
    );
  }

  const otp = String(Math.floor(Math.random() * 900000));

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

  const emailVerificationCookie = await commitEmailVerificationSession(
    emailVerificationSession,
  );

  return redirect("/register/verify", {
    headers: { "Set-Cookie": emailVerificationCookie },
  }) as never;
}

export default function SendOtpPage() {
  const { Form, data, state } = useFetcher<typeof action>();

  const { toast } = useToast();

  useEffect(() => {
    if (data?.error) {
      toast({ variant: "destructive", description: data.error });
    }
  }, [data, toast]);

  return (
    <div className="min-w-72">
      <h1 className="mb-1 text-2xl font-bold">Welcome Aboard 👋</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Register to fully enjoy all features
      </p>
      <Form method="POST" className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email" required>
            Email
          </Label>
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            id="email"
          />
        </div>
        <Button
          type="submit"
          disabled={state === "submitting"}
          className="w-full"
        >
          {state === "submitting" ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <MailIcon />
          )}
          Send OTP
        </Button>
      </Form>
      <p className="mt-4 text-sm text-center">
        Already have an account?&nbsp;
        <Link to="/login" className="underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
