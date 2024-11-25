import { data, redirect } from "react-router";
import * as v from "valibot";
import type { Route } from "./+types/route";

const schema = v.pipe(
  v.object({
    room: v.pipe(v.string(), v.url()),
  }),
  v.transform(({ room }) => {
    const url = new URL(room);
    return {
      domain: url.hostname,
      slug: url.pathname.replace(/^\/room\//, ""),
      password: url.searchParams.get("pwd"),
    };
  }),
  v.object({
    domain: import.meta.env.DEV
      ? v.literal("localhost")
      : v.literal("cinema.mrcai.dev"),
    slug: v.pipe(v.string(), v.nanoid(), v.length(10)),
    password: v.nullable(v.pipe(v.string(), v.minLength(1), v.maxLength(20))),
  }),
);

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const { success, issues, output } = await v.safeParseAsync(
    schema,
    Object.fromEntries(formData),
  );

  if (!success) {
    return data({ error: issues[0].message }, { status: 400 });
  }

  const { slug } = output;

  return redirect(`/room/${slug}/welcome`);
}
