import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignInCard } from "@/components/sign-in-card";
import { auth } from "@/lib/auth";
import { isLocalAccessEnabled } from "@/lib/local-access";

type SignInPageProps = {
  readonly searchParams: Promise<{ readonly error?: string | readonly string[] }>;
};

function firstValue(value: string | readonly string[] | undefined): string | undefined {
  return typeof value === "string" ? value : value?.[0];
}

export default async function SignInPage({ searchParams }: SignInPageProps): Promise<ReactNode> {
  if (isLocalAccessEnabled()) {
    redirect("/");
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/");
  }

  const error = firstValue((await searchParams).error);
  return <SignInCard oauthError={error ? "We couldn’t sign you in. Please use your NGU Google Workspace account." : undefined} />;
}
