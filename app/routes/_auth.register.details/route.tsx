import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { FlagIcon } from "lucide-react";
import { useEffect } from "react";
import { useFetcher } from "react-router";

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
      <h1 className="mb-2 text-2xl font-bold">One Last Step 🎌</h1>
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
          <FlagIcon />
          Finish
        </Button>
      </Form>
    </div>
  );
}

export { action } from "./action";
