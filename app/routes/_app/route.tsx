import { loadMe } from "@/app/loaders/me";
import { Outlet } from "react-router";
import type { Route } from "./+types/route";
import { Header } from "./header";

export async function loader({ request }: Route.LoaderArgs) {
  return await loadMe(request);
}

export default function AppLayout() {
  return (
    <>
      <Header />
      <main className="px-8">
        <Outlet />
      </main>
    </>
  );
}
