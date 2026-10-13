# NGU Hub Architecture

This document maps the private website hierarchy and the Next.js files that render it.

## Live directories, editor, and monthly award

The Our People and Trusted Network directories use `components/live-directory.tsx` and the read-only `/api/directory` endpoint. Google Sheets remains the source of truth. Tabs are discovered from the existing sheet, refreshed every five minutes, and rendered as native searchable tables. Supplier hyperlinks are preserved. Employment dates, internal staff groups, and labelled access credentials are not returned to the browser. No sheet permissions are changed. If Google removes anonymous read access, the view shows an error and a source-sheet link; authenticated Google access would then need separate setup.

The restricted `/editor` is available only to its stored email allowlist, seeded with Jewel, Claire, and Edgar. Existing editors can manage that list from the Editor access screen; changes apply immediately, require an approved NGU Workspace domain, retain at least one editor, and prevent an editor from removing their own access. It stores independent draft and published documents in Neon Postgres when `DATABASE_URL` is configured, otherwise in the private Vercel Blob store used by production. Local development uses SQLite. Every publish records a revision. Uploaded images and videos also use private Vercel Blob storage and are streamed to signed-in NGU users through `/api/media`; private training material is never exposed by a public Blob URL. The editor controls the announcement banner, home copy, every page hero, the monthly award, Prestige and Elite agent cards and ordering, Info Hub image cards, and the Sales/Rex training playlists. The monthly award uses the same complete banner component in the editor and on the Hub, with direct drag-to-position, corner-handle and slider resizing, plus desktop and guided mobile previews. Google and YouTube links can be used instead of uploads.

The homepage video is served locally from `public/ngu-home.mov` (the supplied 39.5-second original), instead of Google's download-warning response. It autoplays muted, loops, and has no visible controls. Before a production deployment, transcode the 218 MB source to a smaller web-optimized MP4 and update `components/hero.tsx`.

## Website page file tree

```mermaid
flowchart TB
    app["app/"]
    protected["(protected)/<br/>Shared SiteShell layout"]
    home["page.tsx<br/>/ — Home"]
    catchall["[...slug]/page.tsx<br/>Catch-all content router"]
    signIn["sign-in/page.tsx<br/>/sign-in"]
    api["api/"]
    authApi["auth/[...all]/route.ts<br/>/api/auth/*"]
    directoryApi["directory/route.ts<br/>/api/directory"]

    app --> protected
    app --> signIn
    app --> api
    protected --> home
    protected --> catchall
    api --> authApi
    api --> directoryApi

    catchall --> corePages["Core pages"]
    corePages --> leaderboard["/leaderboard"]
    corePages --> aml["/amlctf"]
    corePages --> workApps["/your-work-apps"]
    corePages --> newToNgu["/new-to-ngu"]
    corePages --> cpd["/real-estate-cpd"]
    corePages --> people["/our-people"]
    corePages --> trusted["/trusted-network"]
    corePages --> offices["/ngu-offices"]

    catchall --> infoHub["/info-hub"]
    infoHub --> preList["/info-hub/agent-toolkit/pre-list"]
    infoHub --> preSale["/info-hub/agent-toolkit/pre-sale"]
    infoHub --> openHome["/info-hub/agent-toolkit/open-home"]
    infoHub --> welcome["/info-hub/welcome-pack"]
    infoHub --> sales["/info-hub/sales-training"]
    infoHub --> rex["/info-hub/rex-training"]

    classDef folder fill:#111827,color:#fff,stroke:#111827;
    classDef file fill:#e5e7eb,color:#111827,stroke:#6b7280;
    classDef route fill:#fff,color:#111827,stroke:#9ca3af;
    class app,protected,api,corePages,infoHub folder;
    class home,catchall,signIn,authApi,directoryApi file;
    class leaderboard,aml,workApps,newToNgu,cpd,people,trusted,offices,preList,preSale,openHome,welcome,sales,rex route;
```

The home page has its own route file. All other protected content pages are selected by the catch-all router from route metadata and specialised content components.

## Routing and component structure

```mermaid
flowchart LR
    layout["app/layout.tsx<br/>Root layout"] --> protectedLayout["app/(protected)/layout.tsx<br/>Shared site layout"]
    protectedLayout --> shell["components/site-shell.tsx<br/>Responsive navigation and page frame"]
    layout --> routes{"Page route"}

    routes --> homeRoute["app/(protected)/page.tsx<br/>Home page"]
    routes --> dynamicRoute["app/(protected)/[...slug]/page.tsx<br/>All internal content pages"]

    dynamicRoute --> data["lib/site-data.ts<br/>Navigation, route metadata, and content"]
    dynamicRoute --> content["components/content.tsx<br/>Reusable page sections"]
    homeRoute --> content

    homeRoute --> hero["components/hero.tsx"]
    homeRoute --> events["components/event-showcase.tsx<br/>Countdown and event carousel"]
    events --> calendar["lib/calendar.ts<br/>Live Google Calendar sync"]
    homeRoute --> heroVideo["public/ngu-home.mov<br/>Home hero background video"]
    homeRoute --> video["components/company-video.tsx<br/>Viewport-triggered company video"]
    homeRoute --> calendarView["components/branded-calendar.tsx<br/>Native branded month and agenda views"]
    calendarView --> calendar
    dynamicRoute --> hero
    homeRoute --> footer["components/footer.tsx"]
    dynamicRoute --> footer

    shell --> styles["app/globals.css<br/>Shared responsive styles"]
    content --> styles
    hero --> styles
    footer --> styles
```

## Rendering model

- Local development can use `LOCAL_DEV_ACCESS=true` to preview the protected Hub without Google OAuth or local Google credentials. The bypass is accepted only while `NODE_ENV=development` and `BETTER_AUTH_URL` points to `localhost`, `127.0.0.1`, or `[::1]`; Vercel production always requires its real Google credentials.
- `app/(protected)/layout.tsx` verifies the Better Auth session before applying the shared `SiteShell` to every Hub route. Google Workspace identities are limited to the `ngurealestate.com.au`, `nguteam.com`, and `ngugroup.com` domains, and sessions are stored in encrypted cookies.
- `/editor` performs a second exact-email authorization check against the stored editor list. The same check runs inside every access, draft, publish, and upload endpoint; hiding the editor link is not treated as a security boundary.
- Published content is read by the Hub. Saving writes only the private draft; publishing snapshots that draft in `cms_revisions` before promoting it. Local development uses an ignored SQLite file, while Vercel uses the attached Neon database.
- Uploaded media is stored in a private Vercel Blob store. `/api/media` verifies an NGU session before streaming it, including byte-range requests used by the video player.
- `app/(protected)/page.tsx` owns the bespoke home-page sections and loads upcoming events.
- `app/(protected)/[...slug]/page.tsx` converts the URL segments to a route key, rejects unknown routes with `notFound()`, and selects either data-driven content or a specialised component.
- `app/api/directory/route.ts` verifies the same server-side session before returning live directory data.
- `lib/calendar.ts` reads the public NGU Google Calendar feed, expands recurring events, and refreshes the home-page event data every five minutes.
- `components/event-showcase.tsx` renders the responsive carousel, live countdown, event artwork, and Google Meet link.
- `components/company-video.tsx` loads the NGU introduction video when its section enters the viewport and pauses it when it leaves.
- `components/branded-calendar.tsx` turns the live Google Calendar data into NGU-branded month and mobile agenda views while keeping event and meeting details synced.
- The home hero serves the supplied video locally from `public/ngu-home.mov`, with the city image retained as a loading fallback.
- `lib/site-data.ts` is the source of truth for navigation entries, simple page definitions, training lists, people, offices, and work-app groups.
- `components/content.tsx` contains the reusable and specialised content renderers used by the catch-all route.
- The old standalone Agent Toolkit index route has been retired. Its Pre-List, Pre-Sale and Open Home pages remain directly accessible and combine locally saved checklists, work-app links, the live supplier directory and marketing resources.
- Sales and Rex training use a selectable video-player layout backed by the dated links in `lib/training-data.ts`.
- `Hero` and `Footer` provide the shared content-page framing, while `SiteShell` owns desktop and mobile navigation.

## References

- [Repository instructions](./AGENTS.md)
- [@Visualize](plugin://visualize@openai-bundled)
