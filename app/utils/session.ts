import { createCookieSessionStorage } from "react-router";

export const {
  commitSession: commitUserSession,
  destroySession: destroyUserSession,
  getSession: getUserSession,
} = createCookieSessionStorage<{ id: string }>({
  cookie: {
    name: "user",
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
    maxAge: 10 * 60, // 10 minutes
    sameSite: "strict",
    secure: true,
  },
});
