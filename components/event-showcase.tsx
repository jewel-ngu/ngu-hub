"use client";

import { ArrowLeft, ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CALENDAR_URL, type HubEvent } from "@/lib/calendar-config";

type EventShowcaseProps = {
  readonly events: readonly HubEvent[];
  readonly initialNow: string;
};

const brisbaneDate = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  timeZone: "Australia/Brisbane",
});

const brisbaneTime = new Intl.DateTimeFormat("en-AU", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Australia/Brisbane",
});

const SIX_WEEKS_MS = 42 * 24 * 60 * 60 * 1_000;

function countdown(start: string, now: number): string {
  const remainingMinutes = Math.max(0, Math.floor((Date.parse(start) - now) / 60_000));
  const days = Math.floor(remainingMinutes / 1_440);
  const hours = Math.floor((remainingMinutes % 1_440) / 60);
  const minutes = remainingMinutes % 60;
  return `${days}d ${hours}h ${minutes}m`;
}

type EventPanelProps = {
  readonly event: HubEvent;
  readonly now: number;
  readonly className: string;
  readonly hidden?: boolean;
  readonly onAnimationEnd?: () => void;
};

function EventPanel({ event, now, className, hidden = false, onAnimationEnd }: EventPanelProps): ReactNode {
  const dateParts = brisbaneDate.formatToParts(new Date(event.start));
  const month = dateParts.find((part) => part.type === "month")?.value ?? "";
  const day = dateParts.find((part) => part.type === "day")?.value ?? "";

  return (
    <article className={`event-slide ${className}`} aria-hidden={hidden} onAnimationEnd={onAnimationEnd}>
      <div className="event-date-panel">
        <p>{month}</p>
        <strong>{day}</strong>
      </div>

      <div className="event-image">
        <img src={event.imageUrl ?? "/images/work-apps-hero.png"} alt="" />
      </div>

      <div className="event-detail">
        <p className="eyebrow">UPCOMING AT NGU</p>
        <h2>{event.title}</h2>
        <p className="event-time">{event.allDay ? "All day" : brisbaneTime.format(new Date(event.start))}</p>
        {event.location && <p className="event-location"><MapPin size={15} /> {event.location}</p>}
        <div className="event-countdown"><span>STARTS IN</span><strong>{countdown(event.start, now)}</strong></div>
        <div className="event-actions">
          <a href={CALENDAR_URL} target="_blank" rel="noreferrer" tabIndex={hidden ? -1 : undefined}>View calendar</a>
          {event.meetingUrl && <a href={event.meetingUrl} target="_blank" rel="noreferrer" tabIndex={hidden ? -1 : undefined}>Join meeting</a>}
        </div>
      </div>
    </article>
  );
}

export function EventShowcase({ events, initialNow }: EventShowcaseProps): ReactNode {
  const [activeIndex, setActiveIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<"next" | "previous">("next");
  const [now, setNow] = useState(Date.parse(initialNow));
  const visibleEvents = useMemo(() => {
    const cutoff = Date.parse(initialNow) + SIX_WEEKS_MS;
    return events.filter((event) => Date.parse(event.start) <= cutoff);
  }, [events, initialNow]);
  const activeEvent = visibleEvents[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!activeEvent) {
    return (
      <section className="events-showcase events-empty" id="ngu-events">
        <CalendarDays />
        <div><p className="eyebrow">UPCOMING AT NGU</p><h2>The calendar is reconnecting.</h2></div>
        <a href={CALENDAR_URL} target="_blank" rel="noreferrer">Open Google Calendar</a>
      </section>
    );
  }

  const move = (direction: number): void => {
    if (outgoingIndex !== null) {
      return;
    }

    const nextIndex = Math.min(Math.max(activeIndex + direction, 0), visibleEvents.length - 1);
    if (nextIndex === activeIndex) {
      return;
    }

    setSlideDirection(direction > 0 ? "next" : "previous");
    setOutgoingIndex(activeIndex);
    setActiveIndex(nextIndex);
  };
  const outgoingEvent = outgoingIndex === null ? undefined : visibleEvents[outgoingIndex];
  const isTransitioning = outgoingEvent !== undefined;

  return (
    <section className="events-showcase" id="ngu-events" aria-label="Upcoming NGU events">
      <div className="event-slides">
        {outgoingEvent && (
          <EventPanel
            className={`event-slide-out-${slideDirection}`}
            event={outgoingEvent}
            hidden
            now={now}
          />
        )}
        <EventPanel
          className={isTransitioning ? `event-slide-in-${slideDirection}` : "event-slide-current"}
          event={activeEvent}
          now={now}
          onAnimationEnd={isTransitioning ? () => setOutgoingIndex(null) : undefined}
        />
      </div>

      <div className="event-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Previous event" disabled={activeIndex === 0 || isTransitioning}><ArrowLeft /></button>
        <button type="button" onClick={() => move(1)} aria-label="Next event" disabled={activeIndex === visibleEvents.length - 1 || isTransitioning}><ArrowRight /></button>
      </div>
    </section>
  );
}
