import { createCookieSessionStorage } from "react-router";

export const {
  commitSession: commitMeSession,
  destroySession: destroyMeSession,
  getSession: getMeSession,
} = createCookieSessionStorage<{ id: string }>({
  cookie: {
    name: "me",
    secrets: [process.env.SESSION_SECRET],
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60, // 7 days
    sameSite: "lax",
    secure: true,
  },
});

export const {
  commitSession: commitEmailVerificationSession,
  destroySession: destroyEmailVerificationSession,
  getSession: getEmailVerificationSession,
} = createCookieSessionStorage<{ id: string }>({
  cookie: {
    name: "ev",
    secrets: [process.env.SESSION_SECRET],
    httpOnly: true,
    maxAge: 1 * 60 * 60, // 1 hour
    sameSite: "strict",
    secure: true,
  },
});

export const {
  commitSession: commitVisitorSession,
  destroySession: destroyVisitorSession,
  getSession: getVisitorSession,
} = createCookieSessionStorage<{ id: string }>({
  cookie: {
    name: "vst",
    secrets: [process.env.SESSION_SECRET],
    httpOnly: true,
    maxAge: 100 * 365 * 24 * 60 * 60, // 100 years (almost never expires)
    sameSite: "strict",
    secure: true,
  },
});
