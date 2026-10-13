"use client";

import { upload } from "@vercel/blob/client";
import { ArrowDown, ArrowUp, Check, ExternalLink, Monitor, Plus, RotateCcw, Save, Send, Smartphone, Trash2, Upload, UserPlus } from "lucide-react";
import { useMemo, useRef, useState, type ChangeEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { AwardDisplay } from "@/components/award-display";
import type { CmsState } from "@/lib/cms-store";
import { EDITABLE_PAGE_KEYS, type CmsContent, type EditableImageCard, type EditablePageKey, type EditablePerson } from "@/lib/cms-types";
import type { EditorIdentity } from "@/lib/editor-access";
import type { TrainingVideo } from "@/lib/training-data";

type EditorAppProps = {
  readonly editor: EditorIdentity;
  readonly initialState: CmsState;
  readonly initialEditorEmails: readonly string[];
};

type EditorSection = "announcement" | "home" | "pages" | "people" | "info-hub" | "award" | "training" | "access";
type SaveStatus = "idle" | "saving" | "saved" | "publishing" | "error";

function Field({ label, children, hint }: { readonly label: string; readonly children: ReactNode; readonly hint?: string }): ReactNode {
  return <label className="editor-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}

function UploadField({ label, value, accept, onChange }: { readonly label: string; readonly value: string; readonly accept: string; readonly onChange: (url: string) => void }): ReactNode {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadFile(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const blob = await upload(`ngu-hub/${file.name}`, file, { access: "private", handleUploadUrl: "/api/editor/upload", multipart: file.size > 5 * 1024 * 1024 });
      onChange(`/api/media?url=${encodeURIComponent(blob.url)}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="editor-upload-field">
      <Field label={label}><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Paste a secure URL or upload a file" /></Field>
      <label className="editor-upload-button"><Upload size={16} />{uploading ? "Uploading…" : "Upload"}<input type="file" accept={accept} disabled={uploading} onChange={(event) => void uploadFile(event)} /></label>
      {error && <p className="editor-error">{error}</p>}
    </div>
  );
}

function TrainingEditor({ title, videos, onChange }: { readonly title: string; readonly videos: readonly TrainingVideo[]; readonly onChange: (videos: readonly TrainingVideo[]) => void }): ReactNode {
  const [expanded, setExpanded] = useState<number | null>(0);

  function update(index: number, field: keyof TrainingVideo, value: string): void {
    onChange(videos.map((video, videoIndex) => videoIndex === index ? { ...video, [field]: value } : video));
  }

  function move(index: number, direction: -1 | 1): void {
    const destination = index + direction;
    if (destination < 0 || destination >= videos.length) return;
    const next = [...videos];
    const current = next[index];
    const adjacent = next[destination];
    if (!current || !adjacent) return;
    next[index] = adjacent;
    next[destination] = current;
    onChange(next);
    setExpanded(destination);
  }

  return (
    <section className="editor-card">
      <div className="editor-card-heading"><div><p className="eyebrow">PLAYLIST</p><h2>{title}</h2></div><button type="button" onClick={() => { onChange([{ title: "New training video", date: new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }), href: "https://" }, ...videos]); setExpanded(0); }}><Plus size={16} /> Add video</button></div>
      <div className="editor-video-list">
        {videos.map((video, index) => (
          <article key={`${video.title}-${index}`}>
            <button className="editor-video-summary" type="button" onClick={() => setExpanded(expanded === index ? null : index)}><span>{index + 1}</span><strong>{video.title}</strong><small>{video.date}</small></button>
            {expanded === index && <div className="editor-video-fields">
              <Field label="Video title"><input value={video.title} onChange={(event) => update(index, "title", event.target.value)} /></Field>
              <Field label="Date"><input value={video.date} onChange={(event) => update(index, "date", event.target.value)} /></Field>
              <UploadField label="Google, YouTube or uploaded video URL" value={video.href} accept="video/mp4,video/webm,video/quicktime" onChange={(value) => update(index, "href", value)} />
              <div className="editor-row-actions"><button type="button" disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp size={15} /> Move up</button><button type="button" disabled={index === videos.length - 1} onClick={() => move(index, 1)}><ArrowDown size={15} /> Move down</button><button className="danger" type="button" onClick={() => onChange(videos.filter((_, videoIndex) => videoIndex !== index))}><Trash2 size={15} /> Remove</button></div>
            </div>}
          </article>
        ))}
      </div>
    </section>
  );
}

function moveItem<T>(items: readonly T[], index: number, direction: -1 | 1): readonly T[] {
  const destination = index + direction;
  if (destination < 0 || destination >= items.length) return items;
  const next = [...items];
  const current = next[index];
  const adjacent = next[destination];
  if (current === undefined || adjacent === undefined) return items;
  next[index] = adjacent;
  next[destination] = current;
  return next;
}

function PeopleGroupEditor({ title, group, otherGroupLabel, onChange, onMoveGroup }: { readonly title: string; readonly group: readonly EditablePerson[]; readonly otherGroupLabel: string; readonly onChange: (people: readonly EditablePerson[]) => void; readonly onMoveGroup: (person: EditablePerson, index: number) => void }): ReactNode {
  const [expanded, setExpanded] = useState<number | null>(0);
  function update(index: number, field: keyof EditablePerson, value: string): void {
    onChange(group.map((person, personIndex) => personIndex === index ? { ...person, [field]: value } : person));
  }
  return <section className="editor-card"><div className="editor-card-heading"><div><p className="eyebrow">AGENT GROUP</p><h2>{title}</h2></div><button type="button" onClick={() => { onChange([...group, { id: `agent-${Date.now()}`, name: "New agent", role: "NGU Agent", imageUrl: "/images/ngu-mark.png", imagePosition: "50% 0%" }]); setExpanded(group.length); }}><Plus size={16} /> Add agent</button></div><div className="editor-video-list editor-people-list">{group.map((person, index) => <article key={person.id}><button className="editor-video-summary" type="button" onClick={() => setExpanded(expanded === index ? null : index)}><span>{index + 1}</span><strong>{person.name}</strong><small>{person.role}</small></button>{expanded === index && <div className="editor-video-fields"><div className="editor-person-preview"><img src={person.imageUrl} alt="" style={{ objectPosition: person.imagePosition }} /></div><Field label="Agent name"><input value={person.name} onChange={(event) => update(index, "name", event.target.value)} /></Field><Field label="Role"><input value={person.role} onChange={(event) => update(index, "role", event.target.value)} /></Field><UploadField label="Agent photo" value={person.imageUrl} accept="image/jpeg,image/png,image/webp" onChange={(value) => update(index, "imageUrl", value)} /><Field label="Photo position" hint="Examples: 50% 0%, center top"><input value={person.imagePosition} onChange={(event) => update(index, "imagePosition", event.target.value)} /></Field><div className="editor-row-actions"><button type="button" disabled={index === 0} onClick={() => { onChange(moveItem(group, index, -1)); setExpanded(index - 1); }}><ArrowUp size={15} /> Move up</button><button type="button" disabled={index === group.length - 1} onClick={() => { onChange(moveItem(group, index, 1)); setExpanded(index + 1); }}><ArrowDown size={15} /> Move down</button><button type="button" onClick={() => onMoveGroup(person, index)}>Move to {otherGroupLabel}</button><button className="danger" type="button" onClick={() => onChange(group.filter((_, personIndex) => personIndex !== index))}><Trash2 size={15} /> Remove</button></div></div>}</article>)}</div></section>;
}

function ImageCardEditor({ title, cards, includeCategory = false, onChange }: { readonly title: string; readonly cards: readonly (EditableImageCard & { readonly category?: string })[]; readonly includeCategory?: boolean; readonly onChange: (cards: readonly (EditableImageCard & { readonly category?: string })[]) => void }): ReactNode {
  const [expanded, setExpanded] = useState<number | null>(0);
  function update(index: number, field: string, value: string): void {
    onChange(cards.map((card, cardIndex) => cardIndex === index ? { ...card, [field]: value } : card));
  }
  return <section className="editor-card"><div className="editor-card-heading"><div><p className="eyebrow">IMAGE CARDS</p><h2>{title}</h2></div><button type="button" onClick={() => { onChange([...cards, { id: `card-${Date.now()}`, title: "New card", description: "", href: "/", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%", ...(includeCategory ? { category: "Resource" } : {}) }]); setExpanded(cards.length); }}><Plus size={16} /> Add card</button></div><div className="editor-video-list">{cards.map((card, index) => <article key={card.id}><button className="editor-video-summary" type="button" onClick={() => setExpanded(expanded === index ? null : index)}><span>{index + 1}</span><strong>{card.title}</strong><small>{card.href}</small></button>{expanded === index && <div className="editor-video-fields">{includeCategory && <Field label="Category"><input value={card.category ?? ""} onChange={(event) => update(index, "category", event.target.value)} /></Field>}<Field label="Title"><input value={card.title} onChange={(event) => update(index, "title", event.target.value)} /></Field><Field label="Description"><textarea rows={3} value={card.description} onChange={(event) => update(index, "description", event.target.value)} /></Field><Field label="Link"><input value={card.href} onChange={(event) => update(index, "href", event.target.value)} /></Field><UploadField label="Card image" value={card.imageUrl} accept="image/jpeg,image/png,image/webp,image/gif" onChange={(value) => update(index, "imageUrl", value)} /><Field label="Image position"><input value={card.imagePosition} onChange={(event) => update(index, "imagePosition", event.target.value)} /></Field><div className="editor-image-preview editor-card-preview" style={{ backgroundImage: `url('${card.imageUrl}')`, backgroundPosition: card.imagePosition }}><span>{card.title}</span></div><div className="editor-row-actions"><button type="button" disabled={index === 0} onClick={() => { onChange(moveItem(cards, index, -1)); setExpanded(index - 1); }}><ArrowUp size={15} /> Move up</button><button type="button" disabled={index === cards.length - 1} onClick={() => { onChange(moveItem(cards, index, 1)); setExpanded(index + 1); }}><ArrowDown size={15} /> Move down</button><button className="danger" type="button" onClick={() => onChange(cards.filter((_, cardIndex) => cardIndex !== index))}><Trash2 size={15} /> Remove</button></div></div>}</article>)}</div></section>;
}

type AwardInteraction = {
  readonly pointerId: number;
  readonly mode: "move" | "resize";
  readonly startClientX: number;
  readonly startClientY: number;
  readonly startOffsetX: number;
  readonly startOffsetY: number;
  readonly startScale: number;
  readonly baseWidth: number;
  readonly baseHeight: number;
  readonly centerX: number;
  readonly centerY: number;
  readonly startDistance: number;
};

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function AwardEditor({ award, onChange }: { readonly award: CmsContent["award"]; readonly onChange: (award: CmsContent["award"]) => void }): ReactNode {
  const personRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<AwardInteraction | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  function beginInteraction(mode: AwardInteraction["mode"], event: ReactPointerEvent<HTMLElement>): void {
    const person = personRef.current;
    if (!person) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = person.getBoundingClientRect();
    const startScale = award.imageScale ?? 100;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    interactionRef.current = {
      pointerId: event.pointerId,
      mode,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startOffsetX: award.imageOffsetX ?? 0,
      startOffsetY: award.imageOffsetY ?? 0,
      startScale,
      baseWidth: rect.width / (startScale / 100),
      baseHeight: rect.height / (startScale / 100),
      centerX,
      centerY,
      startDistance: Math.max(Math.hypot(event.clientX - centerX, event.clientY - centerY), 1),
    };
  }

  function updateInteraction(event: ReactPointerEvent<HTMLElement>): void {
    const interaction = interactionRef.current;
    if (!interaction || interaction.pointerId !== event.pointerId) return;
    event.preventDefault();
    if (interaction.mode === "move") {
      const imageOffsetX = clamp(interaction.startOffsetX + ((event.clientX - interaction.startClientX) / interaction.baseWidth) * 100, -100, 100);
      const imageOffsetY = clamp(interaction.startOffsetY + ((event.clientY - interaction.startClientY) / interaction.baseHeight) * 100, -100, 100);
      onChange({ ...award, imageOffsetX, imageOffsetY });
      return;
    }
    const distance = Math.hypot(event.clientX - interaction.centerX, event.clientY - interaction.centerY);
    const imageScale = clamp(interaction.startScale * (distance / interaction.startDistance), 50, 180);
    onChange({ ...award, imageScale });
  }

  function endInteraction(event: ReactPointerEvent<HTMLElement>): void {
    if (interactionRef.current?.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    interactionRef.current = null;
  }

  return (
    <section className="editor-card editor-award-card">
      <p className="eyebrow">OUR PEOPLE</p>
      <h1>Agent of the month</h1>
      <Field label="Agent name"><input value={award.name} onChange={(event) => onChange({ ...award, name: event.target.value })} /></Field>
      <Field label="Month"><input value={award.month} onChange={(event) => onChange({ ...award, month: event.target.value })} /></Field>
      <Field label="Award heading"><input value={award.heading} onChange={(event) => onChange({ ...award, heading: event.target.value })} /></Field>
      <Field label="Category"><input value={award.category} onChange={(event) => onChange({ ...award, category: event.target.value })} /></Field>
      <UploadField label="Agent cut-out image" value={award.imageUrl} accept="image/jpeg,image/png,image/webp" onChange={(imageUrl) => onChange({ ...award, imageUrl })} />
      <div className="editor-award-heading">
        <div><span>LIVE LAYOUT</span><p>Drag the person to move them. Drag the white corner handle to make them larger or smaller.</p></div>
        <button type="button" onClick={() => onChange({ ...award, imageOffsetX: 0, imageOffsetY: 0, imageScale: 100 })}><RotateCcw size={15} /> Reset image</button>
      </div>
      <div className="editor-award-controls">
        <div className="editor-preview-switch" role="group" aria-label="Award preview size">
          <button className={previewMode === "desktop" ? "active" : ""} type="button" aria-pressed={previewMode === "desktop"} onClick={() => setPreviewMode("desktop")}><Monitor size={16} /> Desktop</button>
          <button className={previewMode === "mobile" ? "active" : ""} type="button" aria-pressed={previewMode === "mobile"} onClick={() => setPreviewMode("mobile")}><Smartphone size={16} /> Mobile</button>
        </div>
        <label className="editor-award-slider"><span>Image size</span><input aria-label="Agent image size" type="range" min="50" max="180" step="2" value={Math.round(award.imageScale ?? 100)} onChange={(event) => onChange({ ...award, imageScale: Number(event.target.value) })} /><output>{Math.round(award.imageScale ?? 100)}%</output></label>
      </div>
      <div className={`editor-award-canvas editor-award-canvas-${previewMode}`}>
        <AwardDisplay
          award={award}
          interactive
          showMobileGuide={previewMode === "mobile"}
          personRef={personRef}
          onMoveStart={(event) => beginInteraction("move", event)}
          onMove={updateInteraction}
          onMoveEnd={endInteraction}
          onResizeStart={(event) => beginInteraction("resize", event)}
          onResize={updateInteraction}
          onResizeEnd={endInteraction}
        />
      </div>
    </section>
  );
}

export function EditorApp({ editor, initialState, initialEditorEmails }: EditorAppProps): ReactNode {
  const [content, setContent] = useState<CmsContent>(initialState.draft);
  const [section, setSection] = useState<EditorSection>("announcement");
  const [selectedPage, setSelectedPage] = useState<EditablePageKey>("home");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [message, setMessage] = useState("Draft changes stay private until you publish.");
  const [editorEmails, setEditorEmails] = useState<readonly string[]>(initialEditorEmails);
  const [newEditorEmail, setNewEditorEmail] = useState("");
  const [accessMessage, setAccessMessage] = useState("Access changes apply immediately and do not require publishing.");
  const [accessSaving, setAccessSaving] = useState(false);
  const hasChanges = useMemo(() => JSON.stringify(content) !== JSON.stringify(initialState.draft), [content, initialState.draft]);

  async function save(): Promise<boolean> {
    setStatus("saving");
    const response = await fetch("/api/editor/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
    if (!response.ok) { const result: unknown = await response.json(); setStatus("error"); setMessage(typeof result === "object" && result !== null && "error" in result && typeof result.error === "string" ? result.error : "Could not save the draft."); return false; }
    setStatus("saved");
    setMessage("Draft saved. The live Hub has not changed.");
    return true;
  }

  async function publish(): Promise<void> {
    if (!(await save())) return;
    setStatus("publishing");
    const response = await fetch("/api/editor/publish", { method: "POST" });
    if (!response.ok) { setStatus("error"); setMessage("The draft was saved, but publishing failed."); return; }
    setStatus("saved");
    setMessage("Published successfully. The live Hub now uses this content.");
  }

  async function updateEditorAccess(emails: readonly string[]): Promise<boolean> {
    setAccessSaving(true);
    const response = await fetch("/api/editor/access", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ emails }) });
    const result: unknown = await response.json();
    setAccessSaving(false);
    if (!response.ok) {
      setAccessMessage(typeof result === "object" && result !== null && "error" in result && typeof result.error === "string" ? result.error : "Could not update editor access.");
      return false;
    }
    if (typeof result !== "object" || result === null || !("emails" in result) || !Array.isArray(result.emails)) {
      setAccessMessage("Access was updated, but the new list could not be displayed.");
      return false;
    }
    const savedEmails = result.emails.filter((email): email is string => typeof email === "string");
    setEditorEmails(savedEmails);
    setAccessMessage("Editor access updated successfully.");
    return true;
  }

  async function addEditor(): Promise<void> {
    const email = newEditorEmail.trim().toLowerCase();
    if (!email) { setAccessMessage("Enter an NGU email address first."); return; }
    if (editorEmails.includes(email)) { setAccessMessage("That person already has editor access."); return; }
    if (await updateEditorAccess([...editorEmails, email])) setNewEditorEmail("");
  }

  async function removeEditor(email: string): Promise<void> {
    if (!window.confirm(`Remove editor access for ${email}?`)) return;
    await updateEditorAccess(editorEmails.filter((existingEmail) => existingEmail !== email));
  }

  const page = content.pages[selectedPage];
  const navigation: readonly { readonly key: EditorSection; readonly label: string }[] = [
    { key: "announcement", label: "Announcement" }, { key: "home", label: "Home" }, { key: "pages", label: "Page headers" }, { key: "people", label: "Prestige & Elite" }, { key: "info-hub", label: "Info Hub cards" }, { key: "award", label: "Agent of the month" }, { key: "training", label: "Training videos" }, { key: "access", label: "Editor access" },
  ];

  return (
    <main className="editor-shell">
      <header className="editor-topbar"><div><img src="/images/ngu-mark.png" alt="NGU Real Estate" /><div><strong>NGU Hub Editor</strong><span>Signed in as {editor.email}</span></div></div><div><a href="/" target="_blank">View live Hub <ExternalLink size={15} /></a><button type="button" onClick={() => void save()} disabled={status === "saving" || status === "publishing"}><Save size={16} /> Save draft</button><button className="editor-publish" type="button" onClick={() => void publish()} disabled={status === "saving" || status === "publishing"}><Send size={16} /> Publish</button></div></header>
      <div className="editor-layout">
        <aside className="editor-sidebar"><p>CONTENT</p>{navigation.map((item) => <button className={section === item.key ? "active" : ""} type="button" key={item.key} onClick={() => setSection(item.key)}>{item.label}</button>)}</aside>
        <section className={`editor-workspace${section === "award" ? " editor-workspace-wide" : ""}`}>
          <div className={`editor-status ${status === "error" ? "error" : ""}`}><Check size={16} /><span>{hasChanges && status === "idle" ? "Unsaved changes" : message}</span></div>
          {section === "announcement" && <section className="editor-card"><p className="eyebrow">GLOBAL</p><h1>Announcement banner</h1><p>This appears across the top of every Hub page.</p><Field label="Show banner"><select value={content.announcement.enabled ? "yes" : "no"} onChange={(event) => setContent({ ...content, announcement: { ...content.announcement, enabled: event.target.value === "yes" } })}><option value="yes">Yes</option><option value="no">No</option></select></Field><Field label="Message"><input value={content.announcement.message} onChange={(event) => setContent({ ...content, announcement: { ...content.announcement, message: event.target.value } })} /></Field><Field label="Link label"><input value={content.announcement.linkLabel} onChange={(event) => setContent({ ...content, announcement: { ...content.announcement, linkLabel: event.target.value } })} /></Field><Field label="Link"><input value={content.announcement.href} onChange={(event) => setContent({ ...content, announcement: { ...content.announcement, href: event.target.value } })} /></Field></section>}
          {section === "home" && <section className="editor-card"><p className="eyebrow">HOME PAGE</p><h1>Home content</h1><Field label="Hero kicker"><input value={content.home.kicker} onChange={(event) => setContent({ ...content, home: { ...content.home, kicker: event.target.value } })} /></Field><Field label="Welcome heading"><input value={content.home.welcomeHeading} onChange={(event) => setContent({ ...content, home: { ...content.home, welcomeHeading: event.target.value } })} /></Field><Field label="Welcome text"><textarea rows={6} value={content.home.welcomeText} onChange={(event) => setContent({ ...content, home: { ...content.home, welcomeText: event.target.value } })} /></Field><Field label="Company video URL" hint="YouTube, Google Drive or an uploaded video URL"><input value={content.home.companyVideoUrl} onChange={(event) => setContent({ ...content, home: { ...content.home, companyVideoUrl: event.target.value } })} /></Field></section>}
          {section === "pages" && <section className="editor-card"><p className="eyebrow">ALL PAGES</p><h1>Page headers and hero images</h1><Field label="Choose a page"><select value={selectedPage} onChange={(event) => setSelectedPage(event.target.value as EditablePageKey)}>{EDITABLE_PAGE_KEYS.map((key) => <option value={key} key={key}>{content.pages[key].label}</option>)}</select></Field><Field label="Page title"><input value={page.title} onChange={(event) => setContent({ ...content, pages: { ...content.pages, [selectedPage]: { ...page, title: event.target.value } } })} /></Field><Field label="Subtitle"><textarea rows={3} value={page.subtitle} onChange={(event) => setContent({ ...content, pages: { ...content.pages, [selectedPage]: { ...page, subtitle: event.target.value } } })} /></Field><UploadField label="Hero image" value={page.imageUrl} accept="image/jpeg,image/png,image/webp,image/gif" onChange={(value) => setContent({ ...content, pages: { ...content.pages, [selectedPage]: { ...page, imageUrl: value } } })} /><Field label="Image position" hint="Examples: 50% 50%, center top, right bottom"><input value={page.imagePosition} onChange={(event) => setContent({ ...content, pages: { ...content.pages, [selectedPage]: { ...page, imagePosition: event.target.value } } })} /></Field><div className="editor-image-preview" style={{ backgroundImage: `url('${page.imageUrl}')`, backgroundPosition: page.imagePosition }}><span>Image preview</span></div></section>}
          {section === "people" && <div className="editor-training"><div className="editor-page-heading"><p className="eyebrow">OUR PEOPLE</p><h1>Prestige &amp; Elite agents</h1><p>Change photos and roles, reorder agents, or move an agent to the other achievement group.</p></div><PeopleGroupEditor title="Prestige agents" group={content.people.prestige} otherGroupLabel="Elite" onChange={(prestige) => setContent({ ...content, people: { ...content.people, prestige } })} onMoveGroup={(person, index) => setContent({ ...content, people: { prestige: content.people.prestige.filter((_, personIndex) => personIndex !== index), elite: [...content.people.elite, person] } })} /><PeopleGroupEditor title="Elite agents" group={content.people.elite} otherGroupLabel="Prestige" onChange={(elite) => setContent({ ...content, people: { ...content.people, elite } })} onMoveGroup={(person, index) => setContent({ ...content, people: { prestige: [...content.people.prestige, person], elite: content.people.elite.filter((_, personIndex) => personIndex !== index) } })} /></div>}
          {section === "info-hub" && <div className="editor-training"><div className="editor-page-heading"><p className="eyebrow">INFO HUB</p><h1>Info Hub image cards</h1><p>Change the image, text, destination and order of cards such as Rex Training.</p></div><ImageCardEditor title="Hub pages" cards={content.infoHub.cards} onChange={(cards) => setContent({ ...content, infoHub: { ...content.infoHub, cards: cards.map(({ id, title, description, href, imageUrl, imagePosition }) => ({ id, title, description, href, imageUrl, imagePosition })) } })} /><ImageCardEditor title="Marketing request cards" cards={content.infoHub.requests} includeCategory onChange={(requests) => setContent({ ...content, infoHub: { ...content.infoHub, requests: requests.map(({ id, title, description, href, imageUrl, imagePosition, category }) => ({ id, title, description, href, imageUrl, imagePosition, category: category ?? "Resource" })) } })} /></div>}
          {section === "award" && <AwardEditor award={content.award} onChange={(award) => setContent({ ...content, award })} />}
          {section === "training" && <div className="editor-training"><div className="editor-page-heading"><p className="eyebrow">WEEKLY UPDATES</p><h1>Training videos</h1><p>Add a Google Drive or YouTube link, or upload a video directly. New entries can be moved into the correct order before publishing.</p></div><TrainingEditor title="Sales training" videos={content.training.sales} onChange={(sales) => setContent({ ...content, training: { ...content.training, sales } })} /><TrainingEditor title="Rex training" videos={content.training.rex} onChange={(rex) => setContent({ ...content, training: { ...content.training, rex } })} /></div>}
          {section === "access" && <section className="editor-card editor-access-card"><p className="eyebrow">SECURITY</p><h1>Editor access</h1><p>Add or remove the people who can open this editor. They must sign in with an approved NGU Google Workspace account.</p><div className="editor-access-notice">{accessMessage}</div><div className="editor-access-add"><Field label="New editor email" hint="Allowed domains: @ngurealestate.com.au, @nguteam.com and @ngugroup.com"><input type="email" value={newEditorEmail} onChange={(event) => setNewEditorEmail(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void addEditor(); } }} placeholder="name@ngurealestate.com.au" /></Field><button type="button" disabled={accessSaving} onClick={() => void addEditor()}><UserPlus size={16} /> Add editor</button></div><div className="editor-access-list">{editorEmails.map((email) => { const isCurrentEditor = email === editor.email.toLowerCase(); return <div key={email}><span><strong>{email}</strong>{isCurrentEditor && <small>YOU</small>}</span><button className="danger" type="button" disabled={accessSaving || isCurrentEditor || editorEmails.length === 1} title={isCurrentEditor ? "Another editor must remove your access" : editorEmails.length === 1 ? "At least one editor is required" : "Remove editor access"} onClick={() => void removeEditor(email)}><Trash2 size={15} /> Remove</button></div>; })}</div></section>}
        </section>
      </div>
    </main>
  );
}
