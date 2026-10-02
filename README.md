# NGU Hub

A native Next.js recreation of the private NGU Real Estate team hub. The UI uses reusable React components, TypeScript, and Tailwind CSS, with responsive desktop and mobile navigation.

## Getting started

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Authentication

The hub uses Better Auth with Google Workspace and stateless encrypted sessions. New users are provisioned automatically—there is no invite list—but their verified Google email must use `ngurealestate.com.au`, `nguteam.com`, or `ngugroup.com`. A server-side allowlist rejects every other domain.

Create a Google Cloud OAuth 2.0 **Web application**, then add this authorized redirect URI for local development:

```text
http://localhost:3000/api/auth/callback/google
```

For production, add the same path on the deployed origin. Copy `.env.example` to `.env.local` and provide the Better Auth URL and secret plus the Google client ID and client secret. Add the same variables to Vercel before deploying. Better Auth stores the seven-day session in an encrypted cookie, so this setup does not require a database.

## Scripts

- `pnpm dev` — run the project directly from TypeScript
- `pnpm typecheck` — check types without generating files
- `pnpm lint` — run the code-quality checks
- `pnpm build` — create a production Next.js build
- `pnpm start` — run the production build

The site includes the home page and all internal routes represented in the original navigation, including the app directory, Info Hub/toolkit pages, training archives, people, suppliers, and office directory.
