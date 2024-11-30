import { DropdownMenuItem } from "@/app/components/ui/dropdown-menu";
import { ExternalLinkIcon } from "lucide-react";
import { Link } from "react-router";

type Props = {
  url: string;
  provider: string;
};

export function OriginalVideoLink({ url, provider }: Props) {
  return (
    <DropdownMenuItem asChild className="cursor-pointer">
      <Link to={url}>
        <ExternalLinkIcon />
        Original video on {provider}
      </Link>
    </DropdownMenuItem>
  );
}
