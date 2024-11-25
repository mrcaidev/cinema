import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { LogInIcon } from "lucide-react";
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
      <h1 className="mb-1 text-2xl font-bold">Welcome back 🏠</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Log in to your account to continue
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
        <div className="space-y-1">
          <Label htmlFor="password" required>
            Password
          </Label>
          <Input
            type="password"
            name="password"
            required
            minLength={8}
            maxLength={20}
            id="password"
          />
        </div>
        <Button
          type="submit"
          disabled={state === "submitting"}
          className="w-full"
        >
          <LogInIcon />
          Log in
        </Button>
      </Form>
      <p className="mt-4 text-sm text-center">
        Don&apos;t have an account?&nbsp;
        <Link to="/register" className="underline">
          Register
        </Link>
      </p>
    </div>
  );
}

export { action } from "./action";
export { meta } from "./meta";
