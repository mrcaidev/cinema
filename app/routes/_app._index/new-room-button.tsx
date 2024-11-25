import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import type { loader } from "./loader";

export function NewRoomButton() {
  const me = useLoaderData<typeof loader>();

  return (
    <Button variant="secondary" asChild>
      <Link to={me ? "/room/new" : "/login"}>
        <PlusIcon />
        New room
      </Link>
    </Button>
  );
}
