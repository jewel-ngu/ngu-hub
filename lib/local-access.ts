export type LocalAccessEnvironment = Readonly<{
  BETTER_AUTH_URL?: string;
  LOCAL_DEV_ACCESS?: string;
  NODE_ENV?: string;
}>;

export const LOCAL_PREVIEW_USER = {
  email: "local-preview@ngurealestate.com.au",
  name: "Local Site Editor",
} as const;

function isLoopbackUrl(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  try {
    const hostname = new URL(value).hostname;
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
  } catch {
    return false;
  }
}

export function isLocalAccessEnabled(environment: LocalAccessEnvironment = process.env): boolean {
  return (
    environment.NODE_ENV === "development" &&
    environment.LOCAL_DEV_ACCESS === "true" &&
    isLoopbackUrl(environment.BETTER_AUTH_URL)
  );
}
