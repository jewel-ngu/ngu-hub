export const ALLOWED_EMAIL_DOMAIN = "ngurealestate.com.au";

export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const separatorIndex = normalizedEmail.indexOf("@");

  return (
    separatorIndex > 0 &&
    separatorIndex === normalizedEmail.lastIndexOf("@") &&
    normalizedEmail.slice(separatorIndex + 1) === ALLOWED_EMAIL_DOMAIN
  );
}
