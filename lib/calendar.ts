import ical, { type ParameterValue, type VEvent } from "node-ical";
import type { HubEvent } from "@/lib/calendar-config";

const CALENDAR_ID = "c_3f1d04350c2a27ad3df4b5dbd33831cdbef52551b3a9cc3d3b2e47f0562a923f@group.calendar.google.com";
const CALENDAR_FEED_URL = `https://calendar.google.com/calendar/ical/${encodeURIComponent(CALENDAR_ID)}/public/basic.ics`;
const LOOKAHEAD_DAYS = 180;

function parameterText(value: ParameterValue | undefined): string {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "val" in value && typeof value.val === "string") {
    return value.val;
  }

  return "";
}

function firstMatch(value: string, pattern: RegExp): string | undefined {
  const match = value.match(pattern);
  return match?.[0]?.replaceAll("&amp;", "&");
}

function toHubEvent(event: VEvent, start: Date, end: Date, allDay: boolean): HubEvent | undefined {
  const title = parameterText(event.summary).trim();
  if (!title) {
    return undefined;
  }

  const description = parameterText(event.description);
  const imageUrl = firstMatch(description, /https:\/\/[^"'<>\s]+?\.(?:jpg|jpeg|png|webp)(?:\?[^"'<>\s]*)?/i);
  const meetingUrl = firstMatch(description, /https:\/\/meet\.google\.com\/[a-z-]+/i);
  const location = parameterText(event.location).trim() || undefined;

  return {
    id: `${event.uid ?? title}-${start.toISOString()}`,
    title,
    start: start.toISOString(),
    end: end.toISOString(),
    allDay,
    imageUrl,
    meetingUrl,
    location,
  };
}

export async function getCalendarEvents(rangeStart: Date, rangeEnd: Date): Promise<readonly HubEvent[]> {
  try {
    const response = await fetch(CALENDAR_FEED_URL, {
      headers: { "User-Agent": "NGU-Hub/1.0" },
      signal: AbortSignal.timeout(8_000),
      next: { revalidate: 300 },
    });
    if (!response.ok) {
      throw new Error(`Calendar request failed with status ${response.status}.`);
    }
    const calendar = await ical.async.parseICS(await response.text());
    const events: HubEvent[] = [];

    for (const component of Object.values(calendar)) {
      if (!component || component.type !== "VEVENT") {
        continue;
      }

      if (component.rrule) {
        const instances = ical.expandRecurringEvent(component, {
          from: rangeStart,
          to: rangeEnd,
        });

        for (const instance of instances) {
          const event = toHubEvent(instance.event, instance.start, instance.end, instance.isFullDay);
          if (event && instance.start >= rangeStart) {
            events.push(event);
          }
        }
        continue;
      }

      if (component.start && component.end && component.start >= rangeStart && component.start <= rangeEnd) {
        const event = toHubEvent(component, component.start, component.end, component.start.dateOnly === true);
        if (event) {
          events.push(event);
        }
      }
    }

    const uniqueEvents = new Map(events.map((event) => [`${event.title}-${event.start}`, event]));
    return [...uniqueEvents.values()]
      .sort((first, second) => Date.parse(first.start) - Date.parse(second.start));
  } catch (error: unknown) {
    console.error("Unable to sync the NGU calendar.", error);
    return [];
  }
}

export async function getUpcomingEvents(limit = 8): Promise<readonly HubEvent[]> {
  const now = new Date();
  const rangeEnd = new Date(now.getTime() + LOOKAHEAD_DAYS * 24 * 60 * 60 * 1000);
  const events = await getCalendarEvents(now, rangeEnd);
  return events.slice(0, limit);
}
