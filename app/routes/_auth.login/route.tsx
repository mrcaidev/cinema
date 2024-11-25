import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { findUserWithCredentialsByEmail } from "@/database/user";
import { commitMeSession, getMeSession } from "@/utils/session";
import { compare } from "bcrypt";
import { Loader2Icon, LogInIcon } from "lucide-react";
import { useEffect } from "react";
import { data, Link, redirect, useFetcher } from "react-router";
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

  const userWithCredentials = await findUserWithCredentialsByEmail(email);

  if (!userWithCredentials) {
    return data(
      { error: "This email has not yet been registered." },
      { status: 400 },
    );
  }

  const isCorrectPassword = await compare(
    password,
    userWithCredentials.passwordHash,
  );

  if (!isCorrectPassword) {
    return data({ error: "Password is incorrect" }, { status: 401 });
  }

  const meSession = await getMeSession(request.headers.get("Cookie"));

  meSession.set("id", userWithCredentials.id);

  const meCookie = await commitMeSession(meSession);

  return redirect("/", { headers: { "Set-Cookie": meCookie } });
}

export function meta() {
  return [{ title: "Log In | Cinema" }];
}

export default function LogInPage() {
  const { Form, data, state } = useFetcher<typeof action>();

  const { toast } = useToast();

  useEffect(() => {
    if (data && "error" in data) {
      toast({ variant: "destructive", description: data.error });
    }
  }, [data, toast]);

  return (
    <div className="min-w-72">
      <h1 className="mb-1 text-2xl font-bold">Welcome Back 🏠</h1>
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
          {state === "submitting" ? <Loader2Icon /> : <LogInIcon />}
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
