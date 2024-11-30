import type { PlaylistVideo } from "@/common/types";
import { useLoaderData } from "react-router";
import type { loader } from "../route";
import { OriginalVideoLink } from "./original-video-link";
import { RemoveVideoButton } from "./remove-video-button";
import { UpvoteVideoButton } from "./upvote-video-button";
import { VideoMenu } from "./video-menu";

type Props = {
  video: PlaylistVideo;
  index: number;
};

export function CandidateVideo({ video, index }: Props) {
  const { role } = useLoaderData<typeof loader>();

  return (
    <div className="group flex items-center gap-3 px-2 py-1.5">
      <div className="shrink-0 w-4 text-muted-foreground text-center">
        {index}
      </div>
      <div className="grow">
        <p className="text-sm line-clamp-1">{video.title}</p>
        <p className="text-muted-foreground text-sm">
          from {video.fromUser.nickname}
        </p>
      </div>
      {role !== "visitor" && (
        <VideoMenu video={video}>
          <UpvoteVideoButton
            id={video.id}
            upvotedUserIds={video.upvotedUserIds}
          />
          <OriginalVideoLink url={video.url} provider={video.provider} />
          <RemoveVideoButton id={video.id} />
        </VideoMenu>
      )}
    </div>
  );
}
