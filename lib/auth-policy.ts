export const ALLOWED_EMAIL_DOMAINS = [
  "ngurealestate.com.au",
  "nguteam.com",
  "ngugroup.com",
] as const;

export const ALLOWED_EMAIL_DOMAINS_LABEL = ALLOWED_EMAIL_DOMAINS.map((domain) => `@${domain}`).join(", ");

export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const separatorIndex = normalizedEmail.indexOf("@");

  return (
    separatorIndex > 0 &&
    separatorIndex === normalizedEmail.lastIndexOf("@") &&
    ALLOWED_EMAIL_DOMAINS.some((domain) => normalizedEmail.slice(separatorIndex + 1) === domain)
  );
}
