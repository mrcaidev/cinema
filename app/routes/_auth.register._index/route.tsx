import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { MailIcon } from "lucide-react";
import { useEffect } from "react";
import { Link, useFetcher } from "react-router";

export default function Page() {
  const { Form, data, state } = useFetcher();

  const { toast } = useToast();

  useEffect(() => {
    if (data && "error" in data) {
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
          <MailIcon />
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

export { action } from "./action";
