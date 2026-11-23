import { revalidatePath } from "next/cache";
import { getEditorIdentity } from "@/lib/editor-access";
import { validateCmsContent } from "@/lib/cms-types";
import { getCmsState, saveDraft } from "@/lib/cms-store";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const editor = await getEditorIdentity();
  if (!editor) return Response.json({ error: "Forbidden" }, { status: 403 });
  return Response.json(await getCmsState());
}

export async function PUT(request: Request): Promise<Response> {
  const editor = await getEditorIdentity();
  if (!editor) return Response.json({ error: "Forbidden" }, { status: 403 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "The draft is not valid JSON." }, { status: 400 });
  }
  const validation = validateCmsContent(body);
  if (!validation.ok) return Response.json({ error: validation.error }, { status: 400 });

  await saveDraft(validation.content, editor.email);
  revalidatePath("/editor");
  return Response.json({ ok: true, savedAt: new Date().toISOString() });
}
