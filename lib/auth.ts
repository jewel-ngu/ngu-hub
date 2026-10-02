import { betterAuth } from "better-auth";
import { ALLOWED_EMAIL_DOMAINS_LABEL, isAllowedEmail } from "@/lib/auth-policy";

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const auth = betterAuth({
  appName: "NGU Hub",
  baseURL: requiredEnvironmentVariable("BETTER_AUTH_URL"),
  secret: requiredEnvironmentVariable("BETTER_AUTH_SECRET"),
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  socialProviders: {
    google: {
      clientId: requiredEnvironmentVariable("GOOGLE_CLIENT_ID"),
      clientSecret: requiredEnvironmentVariable("GOOGLE_CLIENT_SECRET"),
      hd: "*",
      prompt: "select_account",
      requireEmailVerification: true,
    },
  },
  trustedOrigins: [requiredEnvironmentVariable("BETTER_AUTH_URL")],
  user: {
    validateUserInfo: ({ user }) => {
      if (isAllowedEmail(user.email)) {
        return;
      }

      return {
        error: "email_not_allowed",
        errorDescription: `Use an approved NGU Google Workspace account (${ALLOWED_EMAIL_DOMAINS_LABEL}) to sign in.`,
      };
    },
  },
});
