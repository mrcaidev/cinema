import type { PlaylistVideo } from "@/common/types";
import { AudioLinesIcon } from "lucide-react";
import { useLoaderData } from "react-router";
import type { loader } from "../route";
import { OriginalVideoLink } from "./original-video-link";
import { RemoveVideoButton } from "./remove-video-button";
import { VideoMenu } from "./video-menu";

type Props = {
  video: PlaylistVideo;
};

export function CurrentVideo({ video }: Props) {
  const { role } = useLoaderData<typeof loader>();

  return (
    <div className="flex items-center gap-3 px-2 py-1.5">
      <div className="shrink-0 relative text-muted-foreground overflow-hidden">
        <AudioLinesIcon className="absolute left-0 top-0 size-4 animate-audio-icon-before" />
        <AudioLinesIcon className="size-4 animate-audio-icon-after" />
      </div>
      <div className="grow">
        <p className="text-sm line-clamp-1">{video.title}</p>
        <p className="text-muted-foreground text-sm">
          from {video.fromUser.nickname}
        </p>
      </div>
      {role !== "visitor" && (
        <VideoMenu video={video}>
          <OriginalVideoLink url={video.url} provider={video.provider} />
          <RemoveVideoButton id={video.id} />
        </VideoMenu>
      )}
    </div>
  );
}
