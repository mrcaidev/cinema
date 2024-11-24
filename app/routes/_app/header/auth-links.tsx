import { Button } from "@/components/ui/button";
import { LogInIcon, UserPlusIcon } from "lucide-react";
import { Link } from "react-router";

export function AuthLinks() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" asChild>
        <Link to="/login">
          <LogInIcon />
          Log in
        </Link>
      </Button>
      <Button asChild>
        <Link to="/register">
          <UserPlusIcon />
          Register
        </Link>
      </Button>
    </div>
  );
}
