import { Link } from "react-router";

export function Logo() {
  return (
    <Link to="/">
      <img
        src="/favicon.svg"
        alt=""
        width={24}
        height={24}
        className="size-6"
      />
    </Link>
  );
}
