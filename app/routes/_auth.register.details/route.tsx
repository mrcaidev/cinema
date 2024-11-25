import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { findEmailVerificationById } from "@/database/email-verification";
import { createUser } from "@/database/user";
import { generateSalt, hash } from "@/utils/salt";
import {
  commitMeSession,
  destroyEmailVerificationSession,
  getEmailVerificationSession,
  getMeSession,
} from "@/utils/session";
import { FlagIcon, Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { data, redirect, useFetcher } from "react-router";
import * as v from "valibot";
import type { Route } from "./+types/route";

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

export async function action({ request }: Route.ActionArgs) {
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

  const passwordSalt = generateSalt();
  const passwordHash = await hash(password, passwordSalt);

  const user = await createUser({
    email,
    nickname,
    avatarUrl: null,
    passwordSalt,
    passwordHash,
  });

  const meSession = await getMeSession(request.headers.get("Cookie"));

  meSession.set("id", user.id);

  const meCookie = await commitMeSession(meSession);

  const emailVerificationCookie = await destroyEmailVerificationSession(
    emailVerificationSession,
  );

  return redirect("/", {
    headers: new Headers([
      ["Set-Cookie", meCookie],
      ["Set-Cookie", emailVerificationCookie],
    ]),
  }) as never;
}

export default function FillDetailsPage() {
  const { Form, data, state } = useFetcher<typeof action>();

  const { toast } = useToast();

  useEffect(() => {
    if (data?.error) {
      toast({ variant: "destructive", description: data.error });
    }
  }, [data, toast]);

  return (
    <div className="min-w-72">
      <h1 className="mb-1 text-2xl font-bold">One Last Step 🎌</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Tell us more about you
      </p>
      <Form method="POST" className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="password" required>
            Password
          </Label>
          <Input
            type="password"
            name="password"
            placeholder="8-20 characters"
            required
            minLength={8}
            maxLength={20}
            id="password"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="confirmPassword" required>
            Confirm password
          </Label>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Type your password again"
            required
            minLength={8}
            maxLength={20}
            id="confirmPassword"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="nickname">Nickname</Label>
          <Input
            type="text"
            name="nickname"
            placeholder="2-20 characters"
            minLength={2}
            maxLength={20}
            id="nickname"
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
            <FlagIcon />
          )}
          Finish
        </Button>
      </Form>
    </div>
  );
}
