import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isLocalAccessEnabled, LOCAL_PREVIEW_USER } from "@/lib/local-access";
import { isEditorEmail } from "@/lib/editor-policy";
import { getEditorEmails } from "@/lib/cms-store";

export type EditorIdentity = { readonly email: string; readonly name: string };

export async function getEditorIdentity(): Promise<EditorIdentity | null> {
  if (isLocalAccessEnabled()) return LOCAL_PREVIEW_USER;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !isEditorEmail(session.user.email, await getEditorEmails())) return null;
  return { email: session.user.email, name: session.user.name };
}
