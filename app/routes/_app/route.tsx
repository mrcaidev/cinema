import { findUserById } from "@/database/user";
import { getMeSession } from "@/utils/session";
import { Outlet } from "react-router";
import type { Route } from "./+types/route";
import { Header } from "./header";

export async function loader({ request }: Route.LoaderArgs) {
  const meSession = await getMeSession(request.headers.get("Cookie"));

  const meId = meSession.get("id");

  if (!meId) {
    return null;
  }

  const me = await findUserById(meId);

  return me;
}

export default function AppLayout() {
  return (
    <>
      <Header />
      <main className="px-8 pt-20">
        <Outlet />
      </main>
    </>
  );
}
