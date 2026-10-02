import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { auth } from "@/lib/auth";

type ProtectedLayoutProps = Readonly<{ children: ReactNode }>;

export default async function ProtectedLayout({ children }: ProtectedLayoutProps): Promise<ReactNode> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  return <SiteShell currentUser={{ email: session.user.email, name: session.user.name }}>{children}</SiteShell>;
}
