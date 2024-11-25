import "@fontsource-variable/nunito";
import { Outlet } from "react-router";
import { ErrorBoundary } from "./error";
import "./global.css";
import { Layout } from "./layout";

export default function Root() {
  return <Outlet />;
}

export { ErrorBoundary, Layout };
