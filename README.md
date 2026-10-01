# NGU Hub

A native Next.js recreation of the private NGU Real Estate team hub. The UI uses reusable React components, TypeScript, and Tailwind CSS, with responsive desktop and mobile navigation.

## Getting started

```sh
pnpm install
cp .env.example .env.local
pnpm dlx auth@1.7.6 migrate --yes
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Authentication

The hub uses Better Auth with Google Workspace. New users are provisioned automatically—there is no invite list—but Google must return the verified hosted-domain claim for `ngurealestate.com.au`. A second server-side policy rejects any profile whose email does not exactly match that domain.

Create a Google Cloud OAuth 2.0 **Web application**, then add this authorized redirect URI for local development:

```text
http://localhost:3000/api/auth/callback/google
```

For production, add the same path on the deployed origin. Copy `.env.example` to `.env.local` and provide the Better Auth URL and secret plus the Google client ID and client secret. Run the migration command above once for each new database before starting the app. The default local SQLite database is `auth.db` and is excluded from Git.

## Scripts

- `pnpm dev` — run the project directly from TypeScript
- `pnpm typecheck` — check types without generating files
- `pnpm lint` — run the code-quality checks
- `pnpm build` — create a production Next.js build
- `pnpm start` — run the production build

The site includes the home page and all internal routes represented in the original navigation, including the app directory, Info Hub/toolkit pages, training archives, people, suppliers, and office directory.
