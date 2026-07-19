import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { Guest } from "~/models/guest.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const guestSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__guest",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  },
});

const GUEST_SESSION_KEY = "guestId";

export async function getGuestSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return guestSessionStorage.getSession(cookie);
}

export async function getGuestId(
  request: Request
): Promise<Guest["id"] | null> {
  const session = await getGuestSession(request);
  const guestId = session.get(GUEST_SESSION_KEY);
  return guestId ?? null;
}

export async function createGuestSession({
  request,
  guestId,
}: {
  request: Request;
  guestId: string;
}) {
  const session = await getGuestSession(request);
  session.set(GUEST_SESSION_KEY, guestId);
  return {
    "Set-Cookie": await guestSessionStorage.commitSession(session),
  };
}
