export type DirectoryTab = { readonly name: string; readonly gid: string };
export type DirectoryData = { readonly tabs: readonly DirectoryTab[]; readonly rows: readonly (readonly string[])[] };
export const directoryIds = {
  people: "134wjDVskPEfBtohxGUBrSFNOZcmI-TY9wOTaimrDBV4",
  suppliers: "1S_SkTYzy5mI2natsrXfbw6gazKk7Vuv7BU15U0zx-BI",
} as const;

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') { value += '"'; index++; }
      else quoted = !quoted;
    } else if (!quoted && (char === "," || char === "\n")) {
      row.push(value.trim()); value = "";
      if (char === "\n") { rows.push(row); row = []; }
    } else value += char;
  }
  if (quoted) throw new Error("Incomplete CSV response");
  row.push(value.trim());
  rows.push(row);
  return rows.filter((cells) => cells.some(Boolean));
}

export function parseDirectoryTabs(html: string): DirectoryTab[] {
  return Array.from(html.matchAll(/items\.push\(\{name: "((?:\\.|[^"\\])*)", pageUrl: "[^"\n]*", gid: "(-?\d+)"/g), (match) => ({ name: String(JSON.parse(`"${match[1]}"`)), gid: match[2] ?? "" }));
}

export function restoreSheetLinks(rows: string[][], html: string): string[][] {
  const links = new Map<string, string[]>();
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const label = (match[2] ?? "").replace(/<[^>]*>/g, "").replaceAll("&amp;", "&").trim();
    try {
      const wrapper = new URL((match[1] ?? "").replaceAll("&amp;", "&"));
      const destination = new URL(wrapper.hostname === "www.google.com" && wrapper.pathname === "/url" ? wrapper.searchParams.get("q") ?? "" : wrapper.href);
      if (!["https:", "http:"].includes(destination.protocol)) continue;
      const values = links.get(label) ?? [];
      values.push(destination.href);
      links.set(label, values);
    } catch { continue; }
  }
  return rows.map((row) => row.map((cell) => links.get(cell)?.shift() ?? cell));
}

export function redactAccessDetails(rows: string[][]): string[][] {
  return rows.map((row) => row.map((cell) => cell.replace(/(?:password|passcode|access code)\s*:[^\r\n]*/gi, "Access details: open the source sheet")));
}
