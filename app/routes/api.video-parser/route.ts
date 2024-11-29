import { data } from "react-router";
import * as v from "valibot";
import { parseVideoUrl } from "../_room.room.$slug._index/playlist/parser";
import type { Route } from "./+types/route";

const schema = v.object({
  videoUrl: v.pipe(v.string(), v.url()),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const { success, issues, output } = await v.safeParseAsync(
    schema,
    Object.fromEntries(formData),
  );

  if (!success) {
    return data({ error: issues[0].message }, { status: 400 });
  }

  const { videoUrl } = output;

  return parseVideoUrl(videoUrl);
}
