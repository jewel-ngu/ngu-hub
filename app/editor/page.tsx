import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { EditorApp } from "@/components/editor/editor-app";
import { getEditorIdentity } from "@/lib/editor-access";
import { getCmsState, getEditorEmails } from "@/lib/cms-store";

export const dynamic = "force-dynamic";

export default async function EditorPage(): Promise<ReactNode> {
  const editor = await getEditorIdentity();
  if (!editor) redirect("/sign-in?callbackURL=/editor");
  const [state, editorEmails] = await Promise.all([getCmsState(), getEditorEmails()]);
  return <EditorApp editor={editor} initialState={state} initialEditorEmails={editorEmails} />;
}
