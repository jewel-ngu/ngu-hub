import Link from "next/link";
import type { ReactNode } from "react";
import { BrandedCalendar } from "@/components/branded-calendar";
import { CompanyVideo } from "@/components/company-video";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { LinkCard, SectionHeading } from "@/components/content";
import { EventShowcase } from "@/components/event-showcase";
import { CALENDAR_URL } from "@/lib/calendar-config";
import { getCalendarEvents } from "@/lib/calendar";

export default async function Home(): Promise<ReactNode> {
  const now = new Date();
  const initialNow = now.toISOString();
  const calendarStart = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000);
  const calendarEnd = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
  const calendarEvents = await getCalendarEvents(calendarStart, calendarEnd);
  const upcomingEvents = calendarEvents.filter((event) => Date.parse(event.start) >= now.getTime()).slice(0, 8);
  const brisbaneMonthParts = new Intl.DateTimeFormat("en-AU", {
    month: "2-digit",
    timeZone: "Australia/Brisbane",
    year: "numeric",
  }).formatToParts(now);
  const initialMonth = `${brisbaneMonthParts.find((part) => part.type === "year")?.value ?? now.getFullYear()}-${brisbaneMonthParts.find((part) => part.type === "month")?.value ?? "01"}`;

  return (
    <>
      <Hero title="Everything NGU." subtitle="Resources, tools, people and what’s happening next — all in one place." home />

      <EventShowcase events={upcomingEvents} initialNow={initialNow} />

      <section className="resource-intro">
        <div><p className="eyebrow">FIND WHAT YOU NEED</p><h2>Built for the way you work.</h2></div>
        <div className="resource-links">
          <Link href="/info-hub">Resources</Link>
          <Link href="/new-to-ngu">New to NGU</Link>
          <a href="https://basecamp.com/" target="_blank" rel="noreferrer">Basecamp</a>
          <a href="https://realhub-frontend.realbase.io/" target="_blank" rel="noreferrer">RealHub</a>
        </div>
      </section>

      <section className="welcome-section">
        <SectionHeading>WELCOME TO NGU REAL ESTATE</SectionHeading>
        <p>NGU Real Estate is one of Queensland&apos;s fastest-growing independent real estate groups. Whether you&apos;re new to the team or a long-standing member, this Hub is your go-to for tools, resources, contacts, and company updates — everything you need in one place.</p>
      </section>

      <CompanyVideo />

      <section className="live-calendar" id="ngu-calendar">
        <div className="live-calendar-heading">
          <div><p className="eyebrow">LIVE GOOGLE CALENDAR</p><h2>NGU Calendar</h2></div>
          <a href={CALENDAR_URL} target="_blank" rel="noreferrer">Open in Google Calendar</a>
        </div>
        <BrandedCalendar events={calendarEvents} initialMonth={initialMonth} />
      </section>

      <section className="home-links">
        <LinkCard title="Your Work Apps" description="Access Rex, RealHub, Basecamp, and all your daily tools." href="/your-work-apps" />
        <LinkCard title="Our People" description="Contact details for the entire NGU team." href="/our-people" />
        <LinkCard title="Info Hub" description="Policies, procedures, and key documents." href="/info-hub" />
        <LinkCard title="Trusted Network" description="Our preferred suppliers and partners." href="/trusted-network" />
      </section>
      <Footer />
    </>
  );
}
