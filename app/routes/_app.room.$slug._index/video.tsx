export function Video() {
  return (
    <section className="rounded-md overflow-hidden [&_iframe]:w-full [&_iframe]:aspect-video">
      <iframe
        src="//player.bilibili.com/player.html?isOutside=true&aid=80433022&bvid=BV1GJ411x7h7&cid=137649199&p=1"
        title="Never gonna give you up"
        allowFullScreen
      />
    </section>
  );
}
