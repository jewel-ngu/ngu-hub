import "server-only";

import Database from "better-sqlite3";
import { neon } from "@neondatabase/serverless";
import { get, put } from "@vercel/blob";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { DEFAULT_CMS_CONTENT, isCmsContent, type CmsContent } from "@/lib/cms-types";
import { DEFAULT_EDITOR_EMAILS, normalizeEditorEmails } from "@/lib/editor-policy";

export type CmsState = {
  readonly draft: CmsContent;
  readonly published: CmsContent;
  readonly draftUpdatedAt: string | null;
  readonly draftUpdatedBy: string | null;
  readonly publishedAt: string | null;
  readonly publishedBy: string | null;
};

const DEFAULT_JSON = JSON.stringify(DEFAULT_CMS_CONTENT);
const DEFAULT_EDITOR_EMAILS_JSON = JSON.stringify(DEFAULT_EDITOR_EMAILS);
const CMS_BLOB_PATH = "ngu-hub/system/cms-state.json";

type CmsRow = {
  readonly draft_json: string;
  readonly published_json: string;
  readonly draft_updated_at: string | null;
  readonly draft_updated_by: string | null;
  readonly published_at: string | null;
  readonly published_by: string | null;
};

type CmsRevision = {
  readonly content: CmsContent;
  readonly publishedAt: string;
  readonly publishedBy: string;
};

type BlobCmsDocument = {
  readonly state: CmsState;
  readonly editorEmails: readonly string[];
  readonly revisions: readonly CmsRevision[];
};

const DEFAULT_CMS_STATE: CmsState = {
  draft: DEFAULT_CMS_CONTENT,
  published: DEFAULT_CMS_CONTENT,
  draftUpdatedAt: null,
  draftUpdatedBy: null,
  publishedAt: null,
  publishedBy: null,
};

const DEFAULT_BLOB_DOCUMENT: BlobCmsDocument = {
  state: DEFAULT_CMS_STATE,
  editorEmails: DEFAULT_EDITOR_EMAILS,
  revisions: [],
};

function parseContent(raw: string): CmsContent {
  try {
    const parsed: unknown = JSON.parse(raw);
    return isCmsContent(parsed) ? parsed : DEFAULT_CMS_CONTENT;
  } catch {
    return DEFAULT_CMS_CONTENT;
  }
}

function toState(row: CmsRow | undefined): CmsState {
  if (!row) return DEFAULT_CMS_STATE;
  return {
    draft: parseContent(row.draft_json),
    published: parseContent(row.published_json),
    draftUpdatedAt: row.draft_updated_at,
    draftUpdatedBy: row.draft_updated_by,
    publishedAt: row.published_at,
    publishedBy: row.published_by,
  };
}

function databaseUrl(): string | null {
  return process.env.DATABASE_URL?.trim() || process.env.POSTGRES_URL?.trim() || null;
}

function shouldUseBlobStore(): boolean {
  return process.env.VERCEL === "1" && Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()) && !databaseUrl();
}

function parseNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function parseBlobDocument(value: unknown): BlobCmsDocument {
  if (typeof value !== "object" || value === null || !("state" in value) || typeof value.state !== "object" || value.state === null) return DEFAULT_BLOB_DOCUMENT;
  const stateValue = value.state;
  const draft = "draft" in stateValue && isCmsContent(stateValue.draft) ? stateValue.draft : DEFAULT_CMS_CONTENT;
  const published = "published" in stateValue && isCmsContent(stateValue.published) ? stateValue.published : DEFAULT_CMS_CONTENT;
  const editorEmails = "editorEmails" in value ? normalizeEditorEmails(value.editorEmails) ?? DEFAULT_EDITOR_EMAILS : DEFAULT_EDITOR_EMAILS;
  const revisions: readonly CmsRevision[] = "revisions" in value && Array.isArray(value.revisions)
    ? value.revisions.flatMap((revision): readonly CmsRevision[] => {
        if (typeof revision !== "object" || revision === null || !("content" in revision) || !isCmsContent(revision.content)) return [];
        const publishedAt = "publishedAt" in revision ? parseNullableString(revision.publishedAt) : null;
        const publishedBy = "publishedBy" in revision ? parseNullableString(revision.publishedBy) : null;
        return publishedAt && publishedBy ? [{ content: revision.content, publishedAt, publishedBy }] : [];
      })
    : [];
  return {
    state: {
      draft,
      published,
      draftUpdatedAt: "draftUpdatedAt" in stateValue ? parseNullableString(stateValue.draftUpdatedAt) : null,
      draftUpdatedBy: "draftUpdatedBy" in stateValue ? parseNullableString(stateValue.draftUpdatedBy) : null,
      publishedAt: "publishedAt" in stateValue ? parseNullableString(stateValue.publishedAt) : null,
      publishedBy: "publishedBy" in stateValue ? parseNullableString(stateValue.publishedBy) : null,
    },
    editorEmails,
    revisions,
  };
}

async function readBlobDocument(): Promise<BlobCmsDocument> {
  const result = await get(CMS_BLOB_PATH, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return DEFAULT_BLOB_DOCUMENT;
  try {
    return parseBlobDocument(JSON.parse(await new Response(result.stream).text()));
  } catch {
    return DEFAULT_BLOB_DOCUMENT;
  }
}

async function writeBlobDocument(document: BlobCmsDocument): Promise<void> {
  await put(CMS_BLOB_PATH, JSON.stringify(document), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    contentType: "application/json",
  });
}

function localDatabase(): Database.Database {
  const dataDirectory = join(process.cwd(), ".data");
  mkdirSync(dataDirectory, { recursive: true });
  const database = new Database(join(dataDirectory, "ngu-editor.db"));
  database.pragma("journal_mode = WAL");
  database.exec(`CREATE TABLE IF NOT EXISTS cms_content (
    id TEXT PRIMARY KEY,
    draft_json TEXT NOT NULL,
    published_json TEXT NOT NULL,
    draft_updated_at TEXT,
    draft_updated_by TEXT,
    published_at TEXT,
    published_by TEXT
  ); CREATE TABLE IF NOT EXISTS cms_revisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_json TEXT NOT NULL,
    published_at TEXT NOT NULL,
    published_by TEXT NOT NULL
  ); CREATE TABLE IF NOT EXISTS editor_access (
    id TEXT PRIMARY KEY,
    emails_json TEXT NOT NULL,
    updated_at TEXT,
    updated_by TEXT
  );`);
  database.prepare("INSERT OR IGNORE INTO cms_content (id, draft_json, published_json) VALUES ('site', ?, ?)").run(DEFAULT_JSON, DEFAULT_JSON);
  database.prepare("INSERT OR IGNORE INTO editor_access (id, emails_json) VALUES ('editors', ?)").run(DEFAULT_EDITOR_EMAILS_JSON);
  return database;
}

async function ensureNeon() {
  const url = databaseUrl();
  if (!url) throw new Error("Database URL is not configured");
  const sql = neon(url);
  await sql`CREATE TABLE IF NOT EXISTS cms_content (
    id text PRIMARY KEY,
    draft_json text NOT NULL,
    published_json text NOT NULL,
    draft_updated_at text,
    draft_updated_by text,
    published_at text,
    published_by text
  )`;
  await sql`CREATE TABLE IF NOT EXISTS cms_revisions (
    id bigserial PRIMARY KEY,
    content_json text NOT NULL,
    published_at text NOT NULL,
    published_by text NOT NULL
  )`;
  await sql`CREATE TABLE IF NOT EXISTS editor_access (
    id text PRIMARY KEY,
    emails_json text NOT NULL,
    updated_at text,
    updated_by text
  )`;
  await sql`INSERT INTO cms_content (id, draft_json, published_json) VALUES ('site', ${DEFAULT_JSON}, ${DEFAULT_JSON}) ON CONFLICT (id) DO NOTHING`;
  await sql`INSERT INTO editor_access (id, emails_json) VALUES ('editors', ${DEFAULT_EDITOR_EMAILS_JSON}) ON CONFLICT (id) DO NOTHING`;
  return sql;
}

function parseEditorEmails(raw: string | undefined): readonly string[] {
  if (!raw) return DEFAULT_EDITOR_EMAILS;
  try {
    return normalizeEditorEmails(JSON.parse(raw)) ?? DEFAULT_EDITOR_EMAILS;
  } catch {
    return DEFAULT_EDITOR_EMAILS;
  }
}

export async function getEditorEmails(): Promise<readonly string[]> {
  if (shouldUseBlobStore()) return (await readBlobDocument()).editorEmails;
  if (!databaseUrl()) {
    const database = localDatabase();
    try {
      const row = database.prepare("SELECT emails_json FROM editor_access WHERE id = 'editors'").get() as { readonly emails_json: string } | undefined;
      return parseEditorEmails(row?.emails_json);
    } finally {
      database.close();
    }
  }
  const sql = await ensureNeon();
  const rows = await sql`SELECT emails_json FROM editor_access WHERE id = 'editors'`;
  return parseEditorEmails(typeof rows[0]?.emails_json === "string" ? rows[0].emails_json : undefined);
}

export async function saveEditorEmails(emails: readonly string[], editorEmail: string): Promise<void> {
  const normalized = normalizeEditorEmails(emails);
  if (!normalized) throw new Error("At least one valid NGU editor email is required");
  const emailsJson = JSON.stringify(normalized);
  const timestamp = new Date().toISOString();
  if (shouldUseBlobStore()) {
    const document = await readBlobDocument();
    await writeBlobDocument({ ...document, editorEmails: normalized });
    return;
  }
  if (!databaseUrl()) {
    const database = localDatabase();
    try {
      database.prepare("UPDATE editor_access SET emails_json = ?, updated_at = ?, updated_by = ? WHERE id = 'editors'").run(emailsJson, timestamp, editorEmail);
    } finally {
      database.close();
    }
    return;
  }
  const sql = await ensureNeon();
  await sql`UPDATE editor_access SET emails_json = ${emailsJson}, updated_at = ${timestamp}, updated_by = ${editorEmail} WHERE id = 'editors'`;
}

export async function getCmsState(): Promise<CmsState> {
  if (shouldUseBlobStore()) return (await readBlobDocument()).state;
  if (!databaseUrl()) {
    const database = localDatabase();
    try {
      return toState(database.prepare("SELECT * FROM cms_content WHERE id = 'site'").get() as CmsRow | undefined);
    } finally {
      database.close();
    }
  }
  const sql = await ensureNeon();
  const rows = await sql`SELECT draft_json, published_json, draft_updated_at, draft_updated_by, published_at, published_by FROM cms_content WHERE id = 'site'`;
  return toState(rows[0] as CmsRow | undefined);
}

export async function getPublishedContent(): Promise<CmsContent> {
  return (await getCmsState()).published;
}

export async function saveDraft(content: CmsContent, editorEmail: string): Promise<void> {
  const contentJson = JSON.stringify(content);
  const timestamp = new Date().toISOString();
  if (shouldUseBlobStore()) {
    const document = await readBlobDocument();
    await writeBlobDocument({ ...document, state: { ...document.state, draft: content, draftUpdatedAt: timestamp, draftUpdatedBy: editorEmail } });
    return;
  }
  if (!databaseUrl()) {
    const database = localDatabase();
    try {
      database.prepare("UPDATE cms_content SET draft_json = ?, draft_updated_at = ?, draft_updated_by = ? WHERE id = 'site'").run(contentJson, timestamp, editorEmail);
    } finally {
      database.close();
    }
    return;
  }
  const sql = await ensureNeon();
  await sql`UPDATE cms_content SET draft_json = ${contentJson}, draft_updated_at = ${timestamp}, draft_updated_by = ${editorEmail} WHERE id = 'site'`;
}

export async function publishDraft(editorEmail: string): Promise<void> {
  const timestamp = new Date().toISOString();
  if (shouldUseBlobStore()) {
    const document = await readBlobDocument();
    const revision: CmsRevision = { content: document.state.draft, publishedAt: timestamp, publishedBy: editorEmail };
    await writeBlobDocument({
      ...document,
      state: { ...document.state, published: document.state.draft, publishedAt: timestamp, publishedBy: editorEmail },
      revisions: [...document.revisions.slice(-49), revision],
    });
    return;
  }
  if (!databaseUrl()) {
    const database = localDatabase();
    try {
      const transaction = database.transaction(() => {
        const row = database.prepare("SELECT draft_json FROM cms_content WHERE id = 'site'").get() as { readonly draft_json: string } | undefined;
        if (!row) throw new Error("Draft content was not found");
        database.prepare("INSERT INTO cms_revisions (content_json, published_at, published_by) VALUES (?, ?, ?)").run(row.draft_json, timestamp, editorEmail);
        database.prepare("UPDATE cms_content SET published_json = draft_json, published_at = ?, published_by = ? WHERE id = 'site'").run(timestamp, editorEmail);
      });
      transaction();
    } finally {
      database.close();
    }
    return;
  }
  const sql = await ensureNeon();
  const rows = await sql`SELECT draft_json FROM cms_content WHERE id = 'site'`;
  const draft = rows[0]?.draft_json;
  if (typeof draft !== "string") throw new Error("Draft content was not found");
  await sql.transaction([
    sql`INSERT INTO cms_revisions (content_json, published_at, published_by) VALUES (${draft}, ${timestamp}, ${editorEmail})`,
    sql`UPDATE cms_content SET published_json = draft_json, published_at = ${timestamp}, published_by = ${editorEmail} WHERE id = 'site'`,
  ]);
}
