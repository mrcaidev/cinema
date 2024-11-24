import { Outlet } from "react-router";
import { Header } from "./header";
import { loader } from "./loader";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="px-8 pt-20">
        <Outlet />
      </main>
    </>
  );
}

export { loader };
