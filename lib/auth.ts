import Database from "better-sqlite3";
import { betterAuth } from "better-auth";
import { ALLOWED_EMAIL_DOMAIN, isAllowedEmail } from "@/lib/auth-policy";

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const database = new Database(process.env.BETTER_AUTH_DATABASE_PATH ?? "./auth.db");
database.pragma("journal_mode = WAL");

export const auth = betterAuth({
  appName: "NGU Hub",
  baseURL: requiredEnvironmentVariable("BETTER_AUTH_URL"),
  database,
  secret: requiredEnvironmentVariable("BETTER_AUTH_SECRET"),
  socialProviders: {
    google: {
      clientId: requiredEnvironmentVariable("GOOGLE_CLIENT_ID"),
      clientSecret: requiredEnvironmentVariable("GOOGLE_CLIENT_SECRET"),
      hd: ALLOWED_EMAIL_DOMAIN,
      prompt: "select_account",
      requireEmailVerification: true,
    },
  },
  user: {
    validateUserInfo: ({ user }) => {
      if (isAllowedEmail(user.email)) {
        return;
      }

      return {
        error: "email_not_allowed",
        errorDescription: `Use your @${ALLOWED_EMAIL_DOMAIN} Google Workspace account to sign in.`,
      };
    },
  },
});
