"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import type { HubEvent } from "@/lib/calendar-config";

type BrandedCalendarProps = {
  readonly events: readonly HubEvent[];
  readonly initialMonth: string;
};

type CalendarDay = {
  readonly date: Date;
  readonly dateKey: string;
  readonly day: number;
  readonly inMonth: boolean;
};

const TIME_ZONE = "Australia/Brisbane";
const weekdayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
const monthHeading = new Intl.DateTimeFormat("en-AU", { month: "long", year: "numeric", timeZone: "UTC" });
const eventTime = new Intl.DateTimeFormat("en-AU", { hour: "numeric", minute: "2-digit", timeZone: TIME_ZONE });
const eventDateKey = new Intl.DateTimeFormat("en-CA", {
  day: "2-digit",
  month: "2-digit",
  timeZone: TIME_ZONE,
  year: "numeric",
});

function keyForDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function createDays(year: number, month: number): readonly CalendarDay[] {
  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const visibleDayCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  return Array.from({ length: visibleDayCount }, (_, index) => {
    const date = new Date(Date.UTC(year, month, index - firstWeekday + 1));
    return {
      date,
      dateKey: keyForDate(date),
      day: date.getUTCDate(),
      inMonth: date.getUTCMonth() === month,
    };
  });
}

export function BrandedCalendar({ events, initialMonth }: BrandedCalendarProps): ReactNode {
  const [monthOffset, setMonthOffset] = useState(0);
  const [initialYear, initialMonthNumber] = initialMonth.split("-").map(Number);
  const baseYear = initialYear ?? new Date().getUTCFullYear();
  const baseMonth = (initialMonthNumber ?? 1) - 1;
  const visibleDate = new Date(Date.UTC(baseYear, baseMonth + monthOffset, 1));
  const visibleYear = visibleDate.getUTCFullYear();
  const visibleMonth = visibleDate.getUTCMonth();
  const days = createDays(visibleYear, visibleMonth);
  const today = eventDateKey.format(new Date());

  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, HubEvent[]>();
    for (const event of events) {
      const key = eventDateKey.format(new Date(event.start));
      const existing = grouped.get(key) ?? [];
      existing.push(event);
      grouped.set(key, existing);
    }
    return grouped;
  }, [events]);

  return (
    <div className="ngu-calendar" aria-label={`${monthHeading.format(visibleDate)} calendar`}>
      <div className="ngu-calendar-toolbar">
        <h3>{monthHeading.format(visibleDate)}</h3>
        <div>
          <button type="button" onClick={() => setMonthOffset(0)}>Today</button>
          <button type="button" aria-label="Previous month" onClick={() => setMonthOffset((offset) => offset - 1)}><ChevronLeft /></button>
          <button type="button" aria-label="Next month" onClick={() => setMonthOffset((offset) => offset + 1)}><ChevronRight /></button>
        </div>
      </div>
      <div className="ngu-calendar-weekdays" aria-hidden="true">
        {weekdayLabels.map((label) => <span key={label}>{label}</span>)}
      </div>
      <div className="ngu-calendar-grid">
        {days.map((day) => {
          const dayEvents = eventsByDate.get(day.dateKey) ?? [];
          return (
            <article className={`${day.inMonth ? "" : "outside-month"} ${day.dateKey === today ? "today" : ""}`} key={day.dateKey}>
              <time dateTime={day.dateKey}>{day.day}</time>
              <div>
                {dayEvents.slice(0, 2).map((event) => (
                  event.meetingUrl ? (
                    <a className="calendar-event" href={event.meetingUrl} key={event.id} target="_blank" rel="noreferrer">
                      <span>{event.allDay ? "ALL DAY" : eventTime.format(new Date(event.start))}</span>
                      {event.title}
                    </a>
                  ) : (
                    <div className="calendar-event" key={event.id}>
                      <span>{event.allDay ? "ALL DAY" : eventTime.format(new Date(event.start))}</span>
                      {event.title}
                    </div>
                  )
                ))}
                {dayEvents.length > 2 && <small>+{dayEvents.length - 2} more</small>}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
