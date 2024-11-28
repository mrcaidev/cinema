export function Video() {
  return (
    <section className="rounded-md overflow-hidden [&_*]:!w-full [&_*]:!aspect-video">
      <div className="grid place-items-center bg-muted/50 text-muted-foreground">
        No video yet :)
      </div>
      {/* <iframe
        src="https://www.youtube.com/embed/14K_a2kKTxU"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      /> */}
    </section>
  );
}
