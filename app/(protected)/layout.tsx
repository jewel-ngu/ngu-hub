import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { auth } from "@/lib/auth";
import { isLocalAccessEnabled, LOCAL_PREVIEW_USER } from "@/lib/local-access";
import { getEditorEmails, getPublishedContent } from "@/lib/cms-store";
import { isEditorEmail } from "@/lib/editor-policy";

type ProtectedLayoutProps = Readonly<{ children: ReactNode }>;

export default async function ProtectedLayout({ children }: ProtectedLayoutProps): Promise<ReactNode> {
  const content = await getPublishedContent();
  if (isLocalAccessEnabled()) {
    return <SiteShell announcement={content.announcement} currentUser={LOCAL_PREVIEW_USER} isLocalPreview>{children}</SiteShell>;
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const canEdit = isEditorEmail(session.user.email, await getEditorEmails());
  return <SiteShell announcement={content.announcement} canEdit={canEdit} currentUser={{ email: session.user.email, name: session.user.name }}>{children}</SiteShell>;
}
