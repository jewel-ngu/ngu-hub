import { directoryIds, parseCsv, parseDirectoryTabs, restoreSheetLinks, redactAccessDetails } from "@/lib/directory";

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const kind = params.get("kind");
  if (kind !== "people" && kind !== "suppliers") return Response.json({ error: "Unknown directory" }, { status: 400 });
  try {
    const base = `https://docs.google.com/spreadsheets/d/${directoryIds[kind]}`;
    const index = await fetch(`${base}/htmlembed`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(15000) });
    if (!index.ok) throw new Error("Directory index unavailable");
    const tabs = parseDirectoryTabs(await index.text());
    const gid = params.get("gid") ?? tabs[0]?.gid;
    if (!gid || !tabs.some((tab) => tab.gid === gid)) return Response.json({ error: "Unknown directory tab" }, { status: 400 });
    const response = await fetch(`${base}/gviz/tq?tqx=out:csv&gid=${gid}`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(15000) });
    if (!response.ok || !response.headers.get("content-type")?.includes("text/csv")) throw new Error("Directory data unavailable");
    let rows = parseCsv(await response.text());
    if (kind === "suppliers") {
      const sheet = await fetch(`${base}/htmlembed/sheet?headers=false&gid=${gid}`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(15000) });
      if (!sheet.ok) throw new Error("Supplier links unavailable");
      rows = restoreSheetLinks(rows, await sheet.text());
    }
    // Only expose the contact columns; employment dates and internal groups are not part of the directory.
    const publicRows = redactAccessDetails(kind === "people" ? rows.map((row) => row.slice(0, 6)) : rows);
    return Response.json({ tabs, rows: publicRows });
  } catch {
    return Response.json({ error: "The live directory is temporarily unavailable. Please open the Google Sheet below." }, { status: 502 });
  }
}
