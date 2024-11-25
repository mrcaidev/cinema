import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import {
  findEmailVerificationById,
  verifyEmailVerificationById,
} from "@/database/email-verification";
import { getEmailVerificationSession } from "@/utils/session";
import { Loader2Icon, ShieldCheckIcon } from "lucide-react";
import { useEffect } from "react";
import { data, redirect, useFetcher } from "react-router";
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

export default function VerifyOtpPage() {
  const { Form, data, state } = useFetcher<typeof action>();

  const { toast } = useToast();

  useEffect(() => {
    if (data && "error" in data) {
      toast({ variant: "destructive", description: data.error });
    }
  }, [data, toast]);

  return (
    <div className="min-w-72">
      <h1 className="mb-1 text-2xl font-bold">Verify Email 📮</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Enter the OTP sent to your email inbox
      </p>
      <Form method="POST" className="space-y-4">
        <InputOTP
          name="otp"
          required
          minLength={6}
          maxLength={6}
          containerClassName="justify-center"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button
          type="submit"
          disabled={state === "submitting"}
          className="w-full"
        >
          {state === "submitting" ? <Loader2Icon /> : <ShieldCheckIcon />}
          Verify OTP
        </Button>
      </Form>
    </div>
  );
}
