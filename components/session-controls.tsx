"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type SessionControlsProps = {
  readonly user: {
    readonly email: string;
    readonly name: string;
  };
};

export function SessionControls({ user }: SessionControlsProps): ReactNode {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function signOut(): Promise<void> {
    setError(undefined);
    setPending(true);
    const { error } = await authClient.signOut();

    if (error) {
      setError("We couldn’t sign you out. Please try again.");
      setPending(false);
      return;
    }

    router.replace("/sign-in");
    router.refresh();
  }

  return (
    <div className="drawer-session">
      <div>
        <span>Signed in as</span>
        <strong>{user.name}</strong>
        <small>{user.email}</small>
      </div>
      <button disabled={pending} onClick={signOut} type="button">
        {pending ? "Signing out…" : "Sign out"}
      </button>
      {error && <p className="drawer-session-error" role="alert">{error}</p>}
    </div>
  );
}
