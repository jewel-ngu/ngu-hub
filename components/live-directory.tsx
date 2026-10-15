"use client";

import { useEffect, useState, type ReactNode } from "react";
import { directoryIds, type DirectoryData } from "@/lib/directory";

function isDirectoryData(value: unknown): value is DirectoryData {
  return typeof value === "object" && value !== null && "tabs" in value && Array.isArray(value.tabs) && value.tabs.every((tab: unknown) => typeof tab === "object" && tab !== null && "name" in tab && typeof tab.name === "string" && "gid" in tab && typeof tab.gid === "string") && "rows" in value && Array.isArray(value.rows) && value.rows.every((row: unknown) => Array.isArray(row) && row.every((cell: unknown) => typeof cell === "string"));
}

function ContactValue({ value }: { readonly value: string }): ReactNode {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return <a href={`mailto:${value}`}>{value}</a>;
  if (/^https?:\/\/\S+$/.test(value)) return <a href={value} target="_blank" rel="noreferrer">Visit website ↗</a>;
  if (/^[+\d][\d ()-]{7,}$/.test(value)) return <a href={`tel:${value.replace(/[^+\d]/g, "")}`}>{value}</a>;
  return value;
}

export function LiveDirectory({ kind }: { readonly kind: "people" | "suppliers" }): ReactNode {
  const [gid, setGid] = useState("");
  const [query, setQuery] = useState("");
  const [state, setState] = useState<{ status: "loading" } | { status: "error" } | { status: "ready"; data: DirectoryData }>({ status: "loading" });
  useEffect(() => {
    const controller = new AbortController();
    async function refresh(): Promise<void> {
      try {
        const response = await fetch(`/api/directory?kind=${kind}${gid ? `&gid=${gid}` : ""}`, { signal: controller.signal });
        const data: unknown = await response.json();
        if (!response.ok || !isDirectoryData(data)) throw new Error("Invalid directory response");
        setState({ status: "ready", data });
      } catch { if (!controller.signal.aborted) setState({ status: "error" }); }
    }
    void refresh();
    const timer = setInterval(() => { void refresh(); }, 300000);
    return () => { controller.abort(); clearInterval(timer); };
  }, [kind, gid]);
  const rows = state.status === "ready" ? state.data.rows.filter((row) => row.some((value) => value.toLowerCase().includes(query.toLowerCase()))) : [];
  return <section className="content-section live-directory">
    <h2 className="section-heading">CONTACT DIRECTORY</h2>
    <p className="section-intro">{kind === "people" ? "Find your team by office." : "People we trust. Browse our suppliers by service category."}</p>
    <div className="directory-controls"><label>Search this list<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, service, email or phone" /></label>{state.status === "ready" && <label>{kind === "people" ? "Office" : "Category"}<select value={gid || state.data.tabs[0]?.gid} onChange={(event) => { setGid(event.target.value); setQuery(""); setState({ status: "loading" }); }}>{state.data.tabs.map((tab) => <option key={tab.gid} value={tab.gid}>{tab.name}</option>)}</select></label>}</div>
    <p className="directory-status" role="status">{state.status === "loading" ? "Loading live directory…" : state.status === "error" ? "The live directory is temporarily unavailable. Open the source sheet below." : "Synced from Google Sheets · refreshes every 5 minutes"}</p>
    {state.status === "ready" && (rows.length ? <div className="directory-table-scroll"><table aria-label={kind === "people" ? "Team contacts" : "Supplier contacts"}><tbody>{rows.map((row, index) => <tr key={index}>{row.map((value, column) => <td key={column}><ContactValue value={value} /></td>)}</tr>)}</tbody></table></div> : <p>No matching contacts in this tab.</p>)}
    <a className="directory-source" href={`https://docs.google.com/spreadsheets/d/${directoryIds[kind]}/edit`} target="_blank" rel="noreferrer">Open Google Sheet ↗</a>
  </section>;
}
