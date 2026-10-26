import { auth } from "@/lib/auth";
import { getCalendarEvents } from "@/lib/calendar";
import { getCalendarMonthRange } from "@/lib/calendar-range";
import { isLocalAccessEnabled } from "@/lib/local-access";

export async function GET(request: Request): Promise<Response> {
  if (!isLocalAccessEnabled()) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }
  }

  const month = new URL(request.url).searchParams.get("month");
  const range = month ? getCalendarMonthRange(month) : undefined;
  if (!range) {
    return Response.json({ error: "Use a calendar month in YYYY-MM format" }, { status: 400 });
  }

  const events = await getCalendarEvents(range.start, range.end);
  return Response.json({ events });
}
