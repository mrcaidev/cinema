export type ParserOutput = {
  provider: string;
  title: string;
  thumbnailUrl: string;
  html: string;
};

export const DEFAULT_PARSER_OUTPUT: ParserOutput = {
  provider: "",
  title: "",
  thumbnailUrl: "",
  html: "",
};

type Parser = (input: string) => Promise<ParserOutput | undefined>;

const parseNoembedUrl: Parser = async (input) => {
  const response = await fetch(`https://noembed.com/embed?url=${input}`);

  if (!response.ok) {
    return;
  }

  const json:
    | { error: string }
    | { provider: string; title: string; thumbnail_url: string; html: string } =
    await response.json();

  if ("error" in json) {
    return;
  }

  const { provider, title, thumbnail_url, html } = json;

  return {
    provider,
    title,
    thumbnailUrl: thumbnail_url,
    html: html
      .replace(/\s*width="\d+"\s*/, " ")
      .replace(/\s*height="\d+"\s*/, " "),
  };
};

const parseBilibiliBvUrl: Parser = async (input) => {
  const url = new URL(input);

  if (url.hostname !== "bilibili.com" && url.hostname !== "www.bilibili.com") {
    return;
  }

  const matchResult = url.pathname.match(
    /^\/video\/(BV[a-zA-Z0-9]{10}?)(\/)?$/,
  );

  if (!matchResult) {
    return;
  }

  const [, bvid] = matchResult;

  if (!bvid) {
    return;
  }

  const response = await fetch(
    `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
  );

  if (!response.ok) {
    return;
  }

  const json: { code: number; data: { title: string; pic: string } } =
    await response.json();

  if (json.code !== 0) {
    return;
  }

  const { title, pic } = json.data;

  return {
    provider: "Bilibili",
    title,
    thumbnailUrl: pic,
    html: `<iframe src="//player.bilibili.com/player.html?isOutside=true&bvid=${bvid}" title=${title} scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>`,
  };
};

function createConcurrentParser(...parsers: Parser[]) {
  return async (input: string) => {
    const outputs = await Promise.all(
      parsers.map(async (parser) => {
        try {
          return await parser(input);
        } catch {
          return;
        }
      }),
    );

    return outputs.find((o) => !!o) ?? DEFAULT_PARSER_OUTPUT;
  };
}

export const parseVideoUrl = createConcurrentParser(
  parseNoembedUrl,
  parseBilibiliBvUrl,
);
