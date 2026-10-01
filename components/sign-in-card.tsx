"use client";

import { useState, type ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { ALLOWED_EMAIL_DOMAIN } from "@/lib/auth-policy";

type SignInCardProps = {
  readonly oauthError?: string;
};

export function SignInCard({ oauthError }: SignInCardProps): ReactNode {
  const [error, setError] = useState(oauthError);
  const [pending, setPending] = useState(false);

  async function signIn(): Promise<void> {
    setError(undefined);
    setPending(true);

    const { error: signInError } = await authClient.signIn.social({
      callbackURL: "/",
      errorCallbackURL: "/sign-in",
      provider: "google",
    });

    if (signInError) {
      setError(signInError.message ?? "We couldn’t start Google sign-in. Please try again.");
      setPending(false);
    }
  }

  return (
    <main className="sign-in-page">
      <section className="sign-in-card" aria-labelledby="sign-in-heading">
        <img src="/images/ngu-mark.png" alt="NGU Real Estate" />
        <p className="sign-in-kicker">NGU HUB</p>
        <h1 id="sign-in-heading">Welcome back</h1>
        <p>Sign in with your NGU Google Workspace account to continue.</p>

        {error && <p className="sign-in-error" role="alert">{error}</p>}

        <button className="google-sign-in" disabled={pending} onClick={signIn} type="button">
          <span aria-hidden="true">G</span>
          {pending ? "Opening Google…" : "Continue with Google"}
        </button>

        <small>Access is limited to @{ALLOWED_EMAIL_DOMAIN} accounts. No invite is required.</small>
      </section>
    </main>
  );
}
