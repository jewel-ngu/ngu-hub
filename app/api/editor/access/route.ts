import { getEditorIdentity } from "@/lib/editor-access";
import { normalizeEditorEmails } from "@/lib/editor-policy";
import { getEditorEmails, saveEditorEmails } from "@/lib/cms-store";
import { isLocalAccessEnabled, LOCAL_PREVIEW_USER } from "@/lib/local-access";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const editor = await getEditorIdentity();
  if (!editor) return Response.json({ error: "Forbidden" }, { status: 403 });
  return Response.json({ emails: await getEditorEmails(), currentEmail: editor.email });
}

export async function PUT(request: Request): Promise<Response> {
  const editor = await getEditorIdentity();
  if (!editor) return Response.json({ error: "Forbidden" }, { status: 403 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "The editor list is not valid JSON." }, { status: 400 });
  }

  const emails = typeof body === "object" && body !== null && "emails" in body ? normalizeEditorEmails(body.emails) : null;
  if (!emails) return Response.json({ error: "Add at least one valid NGU email address." }, { status: 400 });
  if (!isLocalAccessEnabled() && editor.email !== LOCAL_PREVIEW_USER.email && !emails.includes(editor.email.toLowerCase())) {
    return Response.json({ error: "You cannot remove your own access. Ask another editor to remove it." }, { status: 400 });
  }

  await saveEditorEmails(emails, editor.email);
  return Response.json({ ok: true, emails, savedAt: new Date().toISOString() });
}
