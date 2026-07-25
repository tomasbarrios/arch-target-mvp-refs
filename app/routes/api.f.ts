import type { LoaderArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const upstreamUrl = `${process.env.GOATCOUNTER_URL}/count${url.search}`;

  const forwardedFor =
    request.headers.get("x-forwarded-for") ?? request.headers.get("fly-client-ip") ?? "";

  const upstream = await fetch(upstreamUrl, {
    headers: {
      "User-Agent": request.headers.get("user-agent") ?? "",
      Referer: request.headers.get("referer") ?? "",
      "X-Forwarded-For": forwardedFor,
    },
  });

  const body = await upstream.arrayBuffer();

  return new Response(body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/gif",
      "Cache-Control": "no-cache",
    },
  });
};
