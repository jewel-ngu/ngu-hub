import { isAllowedEmail } from "@/lib/auth-policy";

export const DEFAULT_EDITOR_EMAILS = [
  "jewel@ngurealestate.com.au",
  "claire@ngurealestate.com.au",
  "edgar@ngurealestate.com.au",
] as const;

export function normalizeEditorEmails(value: unknown): readonly string[] | null {
  if (!Array.isArray(value)) return null;
  const normalized = value.map((email) => typeof email === "string" ? email.trim().toLowerCase() : "");
  if (normalized.length === 0 || normalized.some((email) => !isAllowedEmail(email))) return null;
  return [...new Set(normalized)];
}

export function isEditorEmail(email: string | null | undefined, allowedEmails: readonly string[]): boolean {
  const normalized = email?.trim().toLowerCase();
  return normalized !== undefined && allowedEmails.includes(normalized);
}
