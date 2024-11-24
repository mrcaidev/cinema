import { Link } from "react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img
        src="/favicon.svg"
        alt=""
        width={24}
        height={24}
        className="size-6"
      />
      <span className="text-lg font-medium">Cinema</span>
    </Link>
  );
}
