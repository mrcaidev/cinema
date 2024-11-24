import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { ShieldCheckIcon } from "lucide-react";
import { useEffect } from "react";
import { useFetcher } from "react-router";
import { action } from "./action";

export default function Page() {
  const { Form, data, state } = useFetcher<typeof action>();

  const { toast } = useToast();

  useEffect(() => {
    if (data && "error" in data) {
      toast({ variant: "destructive", description: data.error });
    }
  }, [data, toast]);

  return (
    <div className="min-w-72">
      <h1 className="mb-2 text-2xl font-bold">Verify Email 📮</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Enter the OTP sent to your email inbox
      </p>
      <Form method="POST" className="space-y-4">
        <InputOTP name="otp" maxLength={6} containerClassName="justify-center">
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
          <ShieldCheckIcon />
          Verify OTP
        </Button>
      </Form>
    </div>
  );
}

export { action };
