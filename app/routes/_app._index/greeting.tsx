import { useLayoutEffect, useState } from "react";
import { useLoaderData } from "react-router";
import type { loader } from "../_app/loader";

export function Greeting() {
  const me = useLoaderData<typeof loader>();

  const [{ text, emoji }, setGreeting] = useState({
    text: "Hello",
    emoji: "👋",
  });

  useLayoutEffect(() => setGreeting(getGreeting()), []);

  return (
    <p className="text-2xl font-medium">
      {text}
      {me && `, ${me.nickname}`}
      &nbsp;
      {emoji}
    </p>
  );
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 6) {
    return { text: "It's midnight", emoji: "🛏️" };
  }

  if (hour < 12) {
    return { text: "Good morning", emoji: "🍞" };
  }

  if (hour < 18) {
    return { text: "Good afternoon", emoji: "☀️" };
  }

  return { text: "Good evening", emoji: "🌙" };
}
