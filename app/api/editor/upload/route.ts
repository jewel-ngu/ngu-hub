import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getEditorIdentity } from "@/lib/editor-access";

export const runtime = "nodejs";

const MAXIMUM_UPLOAD_SIZE = 512 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/quicktime"];

export async function POST(request: Request): Promise<Response> {
  const editor = await getEditorIdentity();
  if (!editor) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return Response.json({ error: "Uploads are not configured yet. Add a Vercel Blob store to this project." }, { status: 503 });

  let body: HandleUploadBody;
  try {
    body = await request.json() as HandleUploadBody;
  } catch {
    return Response.json({ error: "Invalid upload request." }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const safeName = pathname.replace(/[^a-zA-Z0-9._/-]/g, "-");
        if (!safeName || safeName.includes("..")) throw new Error("Invalid filename");
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAXIMUM_UPLOAD_SIZE,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ editor: editor.email }),
        };
      },
      onUploadCompleted: async () => undefined,
    });
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return Response.json({ error: message }, { status: 400 });
  }
}
