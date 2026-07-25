import crypto from "crypto";
import invariant from "tiny-invariant";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export function createGuestToken(guestId: string) {
  return crypto
    .createHmac("sha256", process.env.SESSION_SECRET!)
    .update(guestId)
    .digest("hex");
}

export function verifyGuestToken(guestId: string, token: string) {
  const expected = createGuestToken(guestId);
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
