import { get } from "@vercel/blob";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isAllowedEmail } from "@/lib/auth-policy";
import { isLocalAccessEnabled } from "@/lib/local-access";

export const runtime = "nodejs";

function isBlobUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export async function GET(request: Request): Promise<Response> {
  if (!isLocalAccessEnabled()) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAllowedEmail(session.user.email)) return new Response("Forbidden", { status: 403 });
  }

  const blobUrl = new URL(request.url).searchParams.get("url");
  if (!blobUrl || !isBlobUrl(blobUrl)) return new Response("Invalid media URL", { status: 400 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return new Response("Media storage is not configured", { status: 503 });

  const range = request.headers.get("range");
  const result = await get(blobUrl, { access: "private", headers: range ? { range } : undefined });
  if (!result) return new Response("Media not found", { status: 404 });
  if (result.statusCode === 304) return new Response(null, { status: 304, headers: { ETag: result.blob.etag } });

  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", result.blob.contentType);
  responseHeaders.set("Content-Length", String(result.blob.size));
  responseHeaders.set("Cache-Control", "private, max-age=3600");
  responseHeaders.set("ETag", result.blob.etag);
  const contentRange = result.headers.get("content-range");
  if (contentRange) responseHeaders.set("Content-Range", contentRange);
  responseHeaders.set("Accept-Ranges", "bytes");
  return new Response(result.stream, { status: contentRange ? 206 : 200, headers: responseHeaders });
}
