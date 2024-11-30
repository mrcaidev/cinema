import { usePlaylist } from "./playlist-context";

export function Video() {
  const { playlist } = usePlaylist();

  const currentVideo = playlist[0];

  if (!currentVideo) {
    return (
      <section className="grid place-items-center aspect-video rounded-md bg-muted/50 text-muted-foreground">
        No video yet :)
      </section>
    );
  }

  return (
    <section
      className="rounded-md overflow-hidden [&_*]:!w-full [&_*]:!aspect-video"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: currentVideo.html }}
    />
  );
}
