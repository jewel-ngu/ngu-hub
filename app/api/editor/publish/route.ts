import { revalidatePath } from "next/cache";
import { getEditorIdentity } from "@/lib/editor-access";
import { publishDraft } from "@/lib/cms-store";

export const runtime = "nodejs";

export async function POST(): Promise<Response> {
  const editor = await getEditorIdentity();
  if (!editor) return Response.json({ error: "Forbidden" }, { status: 403 });
  await publishDraft(editor.email);
  revalidatePath("/", "layout");
  revalidatePath("/editor");
  return Response.json({ ok: true, publishedAt: new Date().toISOString() });
}
