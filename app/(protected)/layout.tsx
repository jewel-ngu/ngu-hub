import type { ReactNode } from "react";
import { SiteShell } from "@/components/site-shell";

type ProtectedLayoutProps = Readonly<{ children: ReactNode }>;

export default function ProtectedLayout({ children }: ProtectedLayoutProps): ReactNode {
  return <SiteShell>{children}</SiteShell>;
}
