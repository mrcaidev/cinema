import { Button } from "@/app/components/ui/button";
import { loadMe } from "@/app/loaders/me";
import { PlusIcon, UsersRoundIcon } from "lucide-react";
import { Link } from "react-router";
import type { Route } from "./+types/route";
import { Greeting } from "./greeting";

export async function loader({ request }: Route.LoaderArgs) {
  return await loadMe(request);
}

export function meta() {
  return [{ title: "Home | Cinema" }];
}

export default function HomePage() {
  return (
    <div className="grid place-items-center min-h-screen">
      <div className="space-y-5">
        <Greeting />
        <div className="flex justify-center items-center gap-3">
          <Button variant="secondary" asChild>
            <Link to="/room/join">
              <UsersRoundIcon />
              Join room
            </Link>
          </Button>
          <Button asChild>
            <Link to="/room/new">
              <PlusIcon />
              New room
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
