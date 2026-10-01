import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AgentToolkit, AmlCtf, InfoHub, Leaderboard, NewToNgu, Offices, OurPeople, RealEstateCpd, SimpleContent, TrainingList, WelcomePack, WorkApps } from "@/components/content";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { pages } from "@/lib/site-data";
import { LiveDirectory } from "@/components/live-directory";

type RoutePageProps = { readonly params: Promise<{ readonly slug: string[] }> };

const specialPages: Readonly<Record<string, { readonly title: string; readonly subtitle?: string }>> = {
  "your-work-apps": { title: "Your Work Apps", subtitle: "All your tools and platforms in one place." },
  "info-hub": { title: "Info Hub", subtitle: "Your central resource for guides, training, and key contacts." },
  "info-hub/agent-toolkit": { title: "Agent Toolkit" },
  "info-hub/welcome-pack": { title: "Welcome Package", subtitle: "Everything you need to get started at NGU." },
  "info-hub/sales-training": { title: "Sales Training Hub", subtitle: "Training resources for all agents and sales teams." },
  "info-hub/rex-training": { title: "Rex Training", subtitle: "Recorded webinars from Rex on getting the most out of your CRM." },
  "our-people": { title: "Our People" },
  "ngu-offices": { title: "NGU Offices", subtitle: "Our offices across Queensland." },
};

function SpecialContent({ slug }: { readonly slug: string }): ReactNode {
  switch (slug) {
    case "your-work-apps": return <WorkApps />;
    case "info-hub": return <InfoHub />;
    case "info-hub/agent-toolkit": return <AgentToolkit />;
    case "info-hub/welcome-pack": return <WelcomePack />;
    case "info-hub/sales-training": return <TrainingList type="sales" />;
    case "info-hub/rex-training": return <TrainingList type="rex" />;
    case "our-people": return <OurPeople />;
    case "ngu-offices": return <Offices />;
    default: return null;
  }
}

export default async function RoutePage({ params }: RoutePageProps): Promise<ReactNode> {
  const { slug: parts } = await params;
  const slug = parts.join("/");
  const page = pages[slug];
  const special = specialPages[slug];
  if (!page && !special) notFound();

  const title = page?.title ?? special?.title;
  if (!title) notFound();

  return (
    <>
      {slug !== "our-people" && <Hero title={title} subtitle={page?.subtitle ?? special?.subtitle} />}
      {slug === "trusted-network" ? <LiveDirectory kind="suppliers" /> : slug === "leaderboard" ? <Leaderboard /> : slug === "amlctf" ? <AmlCtf /> : slug === "new-to-ngu" ? <NewToNgu /> : slug === "real-estate-cpd" ? <RealEstateCpd /> : page ? <SimpleContent page={page} /> : <SpecialContent slug={slug} />}
      <Footer />
    </>
  );
}
