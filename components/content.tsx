import { ArrowRight, CalendarDays, ExternalLink, FileText, Mail, PlayCircle, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { AwardDisplay } from "@/components/award-display";
import { FirstWeekChecklist } from "@/components/first-week-checklist";
import { OnboardingChecklist } from "@/components/onboarding-checklist";
import { StageChecklist } from "@/components/stage-checklist";
import { TrainingPlaylist } from "@/components/training-playlist";
import { appGroups, type SimplePage } from "@/lib/site-data";
import { supportContacts } from "@/lib/support-contacts";
import { officeDetails } from "@/lib/office-details";
import { LiveDirectory } from "@/components/live-directory";
import { rexTrainingVideos, salesTrainingVideos } from "@/lib/training-data";
import type { CmsContent } from "@/lib/cms-types";
import type { TrainingVideo } from "@/lib/training-data";
import { listingChecklists, type ListingChecklist } from "@/lib/listing-checklists";

export function SectionHeading({ children }: { readonly children: ReactNode }): ReactNode {
  return <h2 className="section-heading">{children}</h2>;
}

export function LinkCard({ title, description, href }: { readonly title: string; readonly description: string; readonly href: string }): ReactNode {
  return (
    <Link className="link-card" href={href}>
      <span>{title}</span>
      <p>{description}</p>
      <ArrowRight size={21} />
    </Link>
  );
}

export function DocumentCard({ title }: { readonly title: string }): ReactNode {
  return (
    <article className="document-card">
      <FileText size={28} />
      <div><h3>{title}</h3><p>Open resource</p></div>
      <ArrowRight size={18} />
    </article>
  );
}

export function SimpleContent({ page }: { readonly page: SimplePage }): ReactNode {
  return (
    <div className="content-stack">
      {page.sections?.map((section) => (
        <section className="content-section" key={section.title}>
          <SectionHeading>{section.title}</SectionHeading>
          {section.body && <p className="section-intro">{section.body}</p>}
          {section.items && <div className="document-grid">{section.items.map((item) => <DocumentCard title={item} key={item} />)}</div>}
        </section>
      ))}
    </div>
  );
}

const liveLeaderboardUrl = "https://my.spinify.com/tv/3vhjv25pupscodft.3wojfa5k08lxc5op";
const resultsLeaderboardUrl = "https://my.spinify.com/tv/3vhjv25pupscodft.3xgwvuisns364lxu";

export function Leaderboard(): ReactNode {
  return (
    <div className="content-stack leaderboard-page">
      <section className="leaderboard-intro">
        <SectionHeading>NGU LEADERBOARD</SectionHeading>
        <p>Track performance across the network. Rankings are based on GCI per agent (unconditional sales), total settled properties, and total listings per month.</p>
      </section>

      <section className="leaderboard-board" aria-labelledby="live-leaderboard-heading">
        <div className="leaderboard-heading">
          <p className="eyebrow">LIVE NETWORK PERFORMANCE</p>
          <h2 id="live-leaderboard-heading">Current leaderboard</h2>
        </div>
        <div className="leaderboard-frame">
          <iframe src={liveLeaderboardUrl} title="Current NGU monthly leaderboard" allowFullScreen />
        </div>
        <p className="leaderboard-note"><strong>Note:</strong> The leaderboard is indicative and may have a small margin of error.</p>
      </section>

      <section className="leaderboard-board leaderboard-results" aria-labelledby="results-leaderboard-heading">
        <div className="leaderboard-heading">
          <p className="eyebrow">MONTHLY RECOGNITION</p>
          <h2 id="results-leaderboard-heading">September results</h2>
        </div>
        <div className="leaderboard-frame">
          <iframe src={resultsLeaderboardUrl} title="NGU September results leaderboard" allowFullScreen />
        </div>
      </section>

      <section className="leaderboard-accuracy">
        <div>
          <p className="eyebrow">KEEPING THE LEADERBOARD ACCURATE</p>
          <h2>Good data keeps recognition fair.</h2>
        </div>
        <div>
          <p>To keep rankings accurate and fair, make sure your office stays on top of these key Rex tasks:</p>
          <ul>
            <li>Complete the Rex commission worksheet as soon as an offer is accepted.</li>
            <li>Enter the unconditional date and Com Est in the Legal tab.</li>
            <li>Update Rex property records immediately if contract conditions change.</li>
          </ul>
          <div className="leaderboard-links">
            <a href="https://my.spinify.com/" target="_blank" rel="noreferrer">Log in to Spinify</a>
            <a href="https://apps.apple.com/us/app/spinify-lively-leaderboards/id1181398352" target="_blank" rel="noreferrer">Download Spinify app</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export function WorkApps(): ReactNode {
  return (
    <div className="content-stack apps-page">
      <section className="work-apps-intro">
        <SectionHeading>QUICK LINKS</SectionHeading>
        <p>NGU runs on a suite of software tools designed to keep every department connected and operating efficiently. Some platforms are used company-wide, while others are specific to your role. Browse by category below to find what you need.</p>
        <nav className="work-apps-categories" aria-label="Work app categories">{appGroups.map((group, index) => <a href={`#${group.title.toLowerCase().replaceAll(" ", "-")}`} key={group.title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{group.title}</strong></a>)}</nav>
      </section>
      {appGroups.map((group) => (
        <section className="content-section" id={group.title.toLowerCase().replaceAll(" ", "-")} key={group.title}>
          <SectionHeading>{group.title}</SectionHeading>
          <div className="app-grid">
            {group.apps.map((app) => (
              <a className="app-card" href={app.href} target="_blank" rel="noreferrer" key={`${group.title}-${app.name}`}>
                <div className="app-logo"><img src={app.image} alt="" /></div>
                <div><h3>{app.name}</h3><p>{app.description}</p></div>
                <ExternalLink size={17} />
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function InfoHub({ content }: { readonly content: CmsContent["infoHub"] }): ReactNode {
  const contacts = supportContacts;
  const legacyChecklistCard = content.cards.find((card) => card.id === "agent-listing-checklists") ?? content.cards.find((card) => card.id === "pre-list");
  const checklistCard = {
    id: "agent-listing-checklists",
    title: "Agent Checklists",
    description: "Seven practical checklists from appraisal to settlement.",
    href: "/info-hub/agent-listing-checklists",
    imageUrl: legacyChecklistCard?.imageUrl ?? "/images/work-apps-hero.png",
    imagePosition: legacyChecklistCard?.imagePosition ?? "50% 50%",
  };
  const fallbackCards = {
    "welcome-pack": { id: "welcome-pack", title: "Welcome Pack", description: "Everything you need for your first weeks at NGU.", href: "/info-hub/welcome-pack", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
    "sales-training": { id: "sales-training", title: "Sales Training", description: "Training resources for agents and sales teams.", href: "/info-hub/sales-training", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
    "rex-training": { id: "rex-training", title: "Rex Training", description: "Recorded webinars to help you get more from Rex.", href: "/info-hub/rex-training", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  } as const;
  const cards = [
    checklistCard,
    ...(["welcome-pack", "sales-training", "rex-training"] as const).map((id) => content.cards.find((card) => card.id === id) ?? fallbackCards[id]),
  ];

  return (
    <div className="hub-resource-page">
      <section className="hub-feature-section">
        <p className="eyebrow">EXPLORE THE HUB</p>
        <div className="hub-image-grid">
          {cards.map((card) => <ImageLinkCard key={card.id} title={card.title} description={card.description} href={card.href} image={card.imageUrl} imagePosition={card.imagePosition} />)}
        </div>
      </section>

      <section className="hub-request-section">
        <div>
          <p className="eyebrow">MARKETING REQUESTS</p>
          <h2>Ready when you are.</h2>
        </div>
        <div className="request-grid">
          {content.requests.map((card) => <RequestCard key={card.id} title={card.title} category={card.category} description={card.description} href={card.href} image={card.imageUrl} imagePosition={card.imagePosition} />)}
        </div>
      </section>

      <HelpDirectory contacts={contacts} />
      <TeamMemberAdministration />
    </div>
  );
}

type ImageLinkCardProps = {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly image: string;
  readonly imagePosition: string;
};

function ImageLinkCard({ title, description, href, image, imagePosition }: ImageLinkCardProps): ReactNode {
  return (
    <Link className="hub-image-card" href={href}>
      <img src={image} alt="" style={{ objectPosition: imagePosition }} />
      <div><h2>{title}</h2><p>{description}</p><ArrowRight /></div>
    </Link>
  );
}

function RequestCard({ title, category, description, href, image, imagePosition }: ImageLinkCardProps & { readonly category: string }): ReactNode {
  return (
    <a className="request-card" href={href} target="_blank" rel="noreferrer">
      <img src={image} alt="" style={{ objectPosition: imagePosition }} />
      <div><span>{category}</span><h3>{title}</h3><p>{description}</p><strong>Submit request <ArrowRight size={17} /></strong></div>
    </a>
  );
}

type Contact = readonly [title: string, subtitle: string, email: string | readonly string[]];

function TeamMemberAdministration(): ReactNode {
  return (
    <section className="team-member-admin" id="team-member-administration">
      <div><p className="eyebrow">TEAM MEMBER ADMINISTRATION</p><h2>Manage team changes in one place.</h2><p>Use the appropriate form to begin the internal process for a new starter or an employee leaving NGU.</p></div>
      <div>
        <a href="https://flvihrc8zxz.typeform.com/to/LTS0KUMg" target="_blank" rel="noreferrer"><span>01</span><div><h3>Onboard a new team member</h3><p>Submit the details needed to prepare access, equipment and the employee&apos;s NGU setup.</p></div><ExternalLink size={22} /></a>
        <a href="https://flvihrc8zxz.typeform.com/to/gVFS3sL2" target="_blank" rel="noreferrer"><span>02</span><div><h3>Offboard a team member</h3><p>Notify the team about a departing employee so access and internal records can be closed correctly.</p></div><ExternalLink size={22} /></a>
      </div>
    </section>
  );
}

function HelpDirectory({ contacts }: { readonly contacts: readonly Contact[] }): ReactNode {
  return (
    <section className="help-directory">
      <div className="help-directory-heading"><Users /><div><p className="eyebrow">NEED HELP?</p><h2>The right person, right away.</h2><p>Please reach out to the relevant contact below for assistance.</p></div></div>
      <div className="contact-grid">
        {contacts.map(([title, subtitle, email]) => {
          const emails = typeof email === "string" ? [email] : email;
          return (
          <a href={`mailto:${emails[0]}`} className="contact-card" key={title}>
            <Mail size={19} />
            <div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}{emails.map((address) => <span key={address}>{address}</span>)}</div>
            <ArrowRight size={18} />
          </a>
          );
        })}
      </div>
    </section>
  );
}

type PreviewResource = {
  readonly title: string;
  readonly href: string;
  readonly preview: string;
  readonly label?: string;
};

const amlResources = [
  { title: "For Sellers — AML/CTF Fact Sheet", href: "https://drive.google.com/file/d/1rf2eNn80qV7jdm4u6GTusDYMU2dbpJlW/view", preview: "https://drive.google.com/file/d/1rf2eNn80qV7jdm4u6GTusDYMU2dbpJlW/preview" },
  { title: "For Buyers — AML/CTF Fact Sheet", href: "https://drive.google.com/file/d/1rtT8mZGeOSIaLi0evD3x8VdA2Jsq_vSL/view", preview: "https://drive.google.com/file/d/1rtT8mZGeOSIaLi0evD3x8VdA2Jsq_vSL/preview" },
  { title: "First AML — Common Complex Seller Scenarios", href: "https://drive.google.com/open?id=18kHTvz1hlen8TTxAnwpMLtfS9bv3IV5wieLUgiVEXJE", preview: "https://docs.google.com/document/d/18kHTvz1hlen8TTxAnwpMLtfS9bv3IV5wieLUgiVEXJE/preview" },
  { title: "Reporting Group — Risk Assessment", href: "https://drive.google.com/open?id=1O45tLqi3bD2uhUFB-jyaTOxI8LZAszuXFPtVNcB7Tjo", preview: "https://docs.google.com/document/d/1O45tLqi3bD2uhUFB-jyaTOxI8LZAszuXFPtVNcB7Tjo/preview" },
  { title: "Reporting Group — Policy", href: "https://drive.google.com/open?id=19DMdj4X_AAwZsk0M4yATGTy5Tydtrmbvg8bSSmyGUZc", preview: "https://docs.google.com/document/d/19DMdj4X_AAwZsk0M4yATGTy5Tydtrmbvg8bSSmyGUZc/preview" },
] satisfies readonly PreviewResource[];

function DocumentPreview({ resource, featured = false }: { readonly resource: PreviewResource; readonly featured?: boolean }): ReactNode {
  return (
    <article className={featured ? "document-preview document-preview-featured" : "document-preview"}>
      <div className="document-preview-frame"><iframe src={resource.preview} title={`${resource.title} preview`} loading="lazy" /></div>
      <div className="document-preview-copy">
        <span>{resource.label ?? "AML/CTF RESOURCE"}</span>
        <h3>{resource.title}</h3>
        <a href={resource.href} target="_blank" rel="noreferrer">Open document <ExternalLink size={16} /></a>
      </div>
    </article>
  );
}

export function AmlCtf(): ReactNode {
  const clientGuide = {
    title: "NGUxFirstAML | Client Guide",
    href: "https://drive.google.com/open?id=1tFGVt7iXwfnORxCLn_4dQw4eyVwGCcHoAnKbLPC5Teg",
    preview: "https://docs.google.com/document/d/1tFGVt7iXwfnORxCLn_4dQw4eyVwGCcHoAnKbLPC5Teg/preview",
    label: "START HERE",
  } satisfies PreviewResource;
  const training = [
    ["Compliance Team Training: NGU Real Estate and First AML", "12 June 2026", "https://drive.google.com/file/d/10IIt3MI956wgqAeKBdNEbrWFL4C97xO1/view?usp=sharing"],
    ["Agent Training: NGU Real Estate and First AML", "15 June 2026", "https://drive.google.com/file/d/1xcGeC6A-ra785DbdtXTBdPoEzTcHZOjk/view?usp=sharing"],
  ] as const;

  return (
    <div className="hub-resource-page aml-page">
      <section className="aml-explainer">
        <div><p className="eyebrow">WHAT IS THE AML/CTF ACT?</p><h2>Keeping crime out of our communities, professions and country.</h2></div>
        <div><p>Australia&apos;s Anti-Money Laundering and Counter-Terrorism Financing Act is designed to stop illegal funds from entering the financial system. From 1 July 2026, real estate firms will be required to:</p><ul><li>Verify client identity</li><li>Assess money laundering and terrorism-financing risk</li><li>Monitor client activity</li><li>Report suspicious behaviour</li></ul></div>
      </section>

      <section className="aml-document-section"><DocumentPreview resource={clientGuide} featured /></section>

      <section className="aml-section">
        <p className="eyebrow">TRAINING SESSIONS</p>
        <div className="training-link-grid">{training.map(([title, date, href]) => <a href={href} target="_blank" rel="noreferrer" key={title}><PlayCircle /><div><h3>{title}</h3><p>{date}</p></div><ArrowRight /></a>)}</div>
      </section>

      <section className="aml-platform-section">
        <div><p className="eyebrow">RECOMMENDED APP</p><img src="https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Assets/Intranet+Icon_FirstAML.png" alt="First AML" /><h2>First AML</h2><p>AML/CTF compliance platform</p><a href="https://app.firstaml.com/home" target="_blank" rel="noreferrer">Open First AML <ExternalLink size={16} /></a></div>
        <div><p className="eyebrow">PLATFORM TRAINING</p><h2>Your complete First AML onboarding room.</h2><p>Access system training, admin resources and general platform training from your First AML account.</p><a href="https://trumpet.app/pods/6a1949414615388bd7bb20f7/live?s=712437#welcome" target="_blank" rel="noreferrer">Open platform training <ArrowRight size={17} /></a></div>
      </section>

      <section className="aml-section aml-library">
        <div className="aml-library-heading"><ShieldCheck /><div><p className="eyebrow">AML/CTF COMPLIANCE RESOURCES</p><h2>Guidance you can open and use.</h2></div></div>
        <div className="document-preview-grid">{amlResources.map((resource) => <DocumentPreview resource={resource} key={resource.title} />)}</div>
      </section>

      <HelpDirectory contacts={[["AML/CTF Compliance Officer", "", "amlctf@ngurealestate.com.au"], ["First AML Platform", "", "help@firstaml.com"]]} />
    </div>
  );
}

export function OurPeople({ award, people }: { readonly award: CmsContent["award"]; readonly people: CmsContent["people"] }): ReactNode {
  return (
    <div className="content-stack people-page">
      <AwardDisplay award={award} />
      <PeopleGroup title="MEET OUR PRESTIGE AGENTS" badgeSrc="/images/prestige-agent-badge.png" people={people.prestige} />
      <PeopleGroup title="MEET OUR ELITE AGENTS" badgeSrc="/images/elite-agent-badge.png" people={people.elite} />
      <LiveDirectory kind="people" />
    </div>
  );
}

function PeopleGroup({ title, badgeSrc, people }: { readonly title: string; readonly badgeSrc: string; readonly people: CmsContent["people"]["prestige"] }): ReactNode {
  return (
    <section className="content-section">
      <div className="people-group-heading">
        <SectionHeading>{title}</SectionHeading>
        <img src={badgeSrc} alt="" />
      </div>
      <div className="people-grid">{people.map((person) => <article key={person.id}><img src={person.imageUrl} alt={person.name} loading="lazy" style={{ objectPosition: person.imagePosition }} /><h3>{person.name}</h3><p>{person.role}</p></article>)}</div>
    </section>
  );
}

const marketingSamples = [
  ["A4 Offer to Purchase Form", "https://drive.google.com/file/d/1KgtLJewtLucIn_gQB3Z3BHI2hjWRzM2e/view", "https://drive.google.com/file/d/1KgtLJewtLucIn_gQB3Z3BHI2hjWRzM2e/preview"],
  ["Business Cards", "https://drive.google.com/file/d/1Ya3wtaE4D7impeR_2e24Pai9XGg4nssk/view", "https://drive.google.com/file/d/1Ya3wtaE4D7impeR_2e24Pai9XGg4nssk/preview"],
  ["Signboards", "https://drive.google.com/file/d/123kKVyQuASt9xQxNN37i1VLk00rR6VbK/view", "https://drive.google.com/file/d/123kKVyQuASt9xQxNN37i1VLk00rR6VbK/preview"],
  ["NGU A-frame", "https://drive.google.com/file/d/1T7BM3bz8hm4XWPajo_svyxxHpBTWthLT/view", "https://drive.google.com/file/d/1T7BM3bz8hm4XWPajo_svyxxHpBTWthLT/preview"],
] as const;

export function NewToNgu(): ReactNode {
  return (
    <div className="new-ngu-page">
      <section className="new-ngu-welcome"><p className="eyebrow">01 / WELCOME TO NGU REAL ESTATE</p><div><h2>Welcome aboard.</h2><div><p>Welcome to NGU Real Estate. We&apos;re excited to have you joining a network built on energy, accountability and an unwavering commitment to excellent service.</p><p>Whether you&apos;re joining an existing office or establishing a new team, your first weeks are about getting connected, understanding the NGU way and building confidence in the systems that support your role.</p><p>Make the NGU Hub your starting point. It brings together your onboarding, training, resources and the people who can help.</p><strong>We&apos;re glad you&apos;re here.</strong></div></div></section>
      <FirstWeekChecklist />
      <section className="new-ngu-pathway"><div><p className="eyebrow">03 / YOUR ONBOARDING PATHWAY</p><h2>Everything you need, in one clear place.</h2><p>Complete your NGU profile and office setup, learn the Form 6 process, then choose the Sales Agent or Sales Admin pathway for role-specific software and training.</p><Link href="/new-to-ngu/onboarding">Start onboarding <ArrowRight size={18} /></Link></div><div className="new-ngu-pathway-preview"><article><span>01</span><h3>Core setup</h3><p>NGU Profile and Office Set-Up.</p></article><article><span>02</span><h3>Form 6</h3><p>The right process from the start.</p></article><article><span>03</span><h3>Your role</h3><p>Sales Agent or Sales Admin pathway.</p></article></div></section>
      <section className="new-ngu-team"><div><p className="eyebrow">04 / YOUR SUPPORT NETWORK</p><h2>Meet the people behind your first weeks.</h2></div><div>{[["NGU Leadership","Direction, standards and the vision for the network."],["HQ Support Team","Marketing, operations, accounts and compliance support."],["Your Principal","Local leadership, coaching and role expectations."],["Your Office Champion","Your first point of contact for day-to-day setup."]].map(([title, description], index) => <article key={title}><span>{String(index + 1).padStart(2,"0")}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
      <section className="new-ngu-induction"><div><p className="eyebrow">05 / NGU INDUCTION</p><h2>Your introduction to how we work.</h2><p>Induction connects the brand, the systems and the people who support your role.</p></div><ol>{["Our story, values and service standards","The NGU brand and professional presentation","Core systems and where to find resources","Compliance, communication and escalation pathways","Your team, training rhythm and next steps"].map((item, index) => <li key={item}><span>{String(index + 1).padStart(2,"0")}</span>{item}</li>)}</ol></section>
      <section className="new-ngu-essential-resources"><div><p className="eyebrow">06 / ESSENTIAL RESOURCES</p><h2>Your quickest routes into the Hub.</h2></div><div>{[["Your Apps","/your-work-apps"],["Welcome Pack","/info-hub/welcome-pack"],["AML/CTF","/amlctf"],["Sales Training","/info-hub/sales-training"],["NGU Calendar","/#ngu-calendar"],["Our People","/our-people"]].map(([title, href]) => <Link href={href} key={title}><h3>{title}</h3><ArrowRight /></Link>)}</div></section>
      <section className="new-ngu-faq"><div><p className="eyebrow">07 / COMMON QUESTIONS</p><h2>A few things new starters often ask.</h2></div><div><details><summary>Where should I begin?</summary><p>Start with the seven-day checklist above, then open your onboarding pathway and complete the core setup before the role-specific tasks.</p></details><details><summary>Who can help if I cannot access a system?</summary><p>Speak with your Office Champion first. They can confirm your setup and direct any access request to the right HQ contact.</p></details><details><summary>Does my progress save?</summary><p>Yes. Checklist progress is saved on this device so you can leave and return later.</p></details><details><summary>Can I print or save the checklists?</summary><p>Yes. Use the Print / save PDF button on each checklist for a clean, print-friendly copy.</p></details></div></section>
    </div>
  );
}

function OnboardingMarketingResources(): ReactNode {
  return <>
      <section className="marketing-system"><div><p className="eyebrow">MARKETING MATERIALS</p><h2>Two platforms, one consistent brand.</h2><p>RealHub brings Rex data into NGU templates. Use Basecamp for other creative requests and custom work.</p><div className="platform-links"><a href="https://launchpad.37signals.com/signin" target="_blank" rel="noreferrer">Open Basecamp <ExternalLink size={16} /></a><a href="https://realhub-frontend.realbase.io/" target="_blank" rel="noreferrer">Open RealHub <ExternalLink size={16} /></a></div></div><ul><li>Brochures — A3, A3 landscape and A4</li><li>Signboards — generic, vertical and three-photo</li><li>DL and DLX flyers</li><li>A4 flyers</li><li>Social media assets</li><li>Business cards</li></ul></section>
      <section className="initial-marketing-pack"><p className="eyebrow">INITIAL MARKETING MATERIAL PACK</p><h2>Request these through Basecamp.</h2><div>{["Offer to Purchase Form", "A-Frame", "Business Card", "Text Signboard", "Blank Letterhead", "Know What Your Home is Worth Letter", "Street Anniversary Letter", "Just Appraised DLs", "A5 Black Ribbon Card", "Marketing Schedule Annexure A"].map((item) => <span key={item}>{item}</span>)}</div></section>
      <section className="new-ngu-resources"><p className="eyebrow">BRAND RESOURCES</p><div><a href="https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/NGU+Real+Estate_Logo+and+Branding+Guidelines+2025_Edgar+NEW.pdf" target="_blank" rel="noreferrer"><FileText /><h3>Logo & Branding Guidelines</h3><ExternalLink /></a><a href="https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/Welcome+Package/NGU+Real+Estate+-+Marketing+Material+2025-2026.pdf" target="_blank" rel="noreferrer"><FileText /><h3>Marketing Materials 2025–2026</h3><ExternalLink /></a><a href="https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/Welcome+Package/Design+golden+rule+2025.pdf" target="_blank" rel="noreferrer"><FileText /><h3>Design Golden Rule</h3><ExternalLink /></a></div></section>
      <section className="sample-documents"><p className="eyebrow">SAMPLE MARKETING MATERIALS</p><div>{marketingSamples.map(([title, href, preview]) => <article key={title}><iframe src={preview} title={`${title} preview`} loading="lazy" /><a href={href} target="_blank" rel="noreferrer">{title} <ExternalLink size={16} /></a></article>)}</div></section>
    </>;
}

export function NewToNguOnboarding(): ReactNode {
  return <div className="new-ngu-page new-ngu-onboarding-page"><OnboardingChecklist /><OnboardingMarketingResources /></div>;
}

export function RealEstateCpd(): ReactNode {
  return (
    <div className="cpd-page">
      <section className="cpd-intro"><div><p className="eyebrow">CONTINUING PROFESSIONAL DEVELOPMENT</p><h2>Stay licensed. Stay current.</h2><p>Queensland real estate agents and salespeople must complete continuing professional development annually. The live requirements tool below helps you understand what is due and when.</p></div><a href="https://members.reiq.com/portal/library?fileTypes=&categoryOrdinal=12" target="_blank" rel="noreferrer"><strong>REIQ CPD online library</strong><span>Browse pre-recorded CPD training</span><ArrowRight /></a></section>
      <section className="cpd-requirements"><div><p className="eyebrow">LIVE CPD REQUIREMENTS</p><h2>REIQ CPD training</h2></div><iframe src="https://script.google.com/macros/s/AKfycbzmmJiDDSGqHVFogtPXqVv1xJqMdChESgrWLwsbnmbf-IWaxilnGRiYo4QxIK2GrJMP/exec" title="Live REIQ CPD requirements tool" loading="lazy" /></section>
    </div>
  );
}

export function AgentListingChecklists(): ReactNode {
  return (
    <div className="listing-checklist-index">
      <section className="listing-checklist-intro">
        <div><p className="eyebrow">SEVEN STAGES · ONE CONSISTENT PROCESS</p><h2>Every step. No guessing.</h2></div>
        <p>Use these checklists from the first appraisal preparation through to settlement and long-term follow-up. Each checklist saves progress on this device.</p>
      </section>
      <section className="listing-checklist-links" aria-label="Agent listing checklist stages">
        {listingChecklists.map((checklist, index) => (
          <Link href={`/info-hub/agent-listing-checklists/${checklist.slug}`} key={checklist.slug}>
            <span>{String(index + 1).padStart(2, "0")}</span><div><h3>{checklist.title}</h3><p>{checklist.description}</p></div><ArrowRight />
          </Link>
        ))}
      </section>
    </div>
  );
}

export function ListingChecklistPage({ checklist }: { readonly checklist: ListingChecklist }): ReactNode {
  const currentIndex = listingChecklists.findIndex((item) => item.slug === checklist.slug);
  const nextChecklist = listingChecklists[currentIndex + 1];
  return (
    <div className="listing-checklist-page">
      <StageChecklist title={checklist.title} instruction={checklist.instruction} sections={checklist.sections} storageKey={`ngu-listing-${checklist.slug}`} />
      <nav className="listing-checklist-nav" aria-label="Checklist navigation">
        <Link href="/info-hub/agent-listing-checklists">All seven checklists</Link>
        {nextChecklist && <Link href={`/info-hub/agent-listing-checklists/${nextChecklist.slug}`}>Next: {nextChecklist.title} <ArrowRight size={17} /></Link>}
      </nav>
    </div>
  );
}

export function TrainingList({ type, videos }: { readonly type: "sales" | "rex"; readonly videos?: readonly TrainingVideo[] }): ReactNode {
  return <TrainingPlaylist videos={videos ?? (type === "sales" ? salesTrainingVideos : rexTrainingVideos)} label={type === "sales" ? "Sales training" : "Rex training"} />;
}

const welcomeResources = [
  { title: "2025 Email Signatures — NGU Brisbane", description: "Google Doc template for your NGU email signature", href: "https://drive.google.com/open?id=1HpqdppItmw-JEK-Liyj1XrANCMTQaQW3XVPobmM6Dmg" },
  { title: "Basecamp User Guideline", description: "Open Basecamp and access your team projects", href: "https://launchpad.37signals.com/signin" },
  { title: "Step-by-step Guide to RealHub", description: "Access NGU templates and campaign collateral", href: "https://realhub-frontend.realbase.io/" },
  { title: "RealHub Video Tutorials", description: "Learn the core RealHub workflow", href: "https://realhub-frontend.realbase.io/" },
  { title: "Logo & Branding Guidelines", description: "Current NGU identity and logo standards", href: "https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/NGU+Real+Estate_Logo+and+Branding+Guidelines+2025_Edgar+NEW.pdf" },
  { title: "Marketing Materials", description: "NGU marketing material range for 2025–2026", href: "https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/Welcome+Package/NGU+Real+Estate+-+Marketing+Material+2025-2026.pdf" },
  { title: "Design Golden Rule", description: "The essential rule for consistent NGU design", href: "https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/Welcome+Package/Design+golden+rule+2025.pdf" },
  { title: "Social Media Best Practice", description: "Practical guidance for representing NGU online", href: "https://www.instagram.com/ngu_real_estate/" },
  { title: "2026 NGU Calendar", description: "Open the live company calendar", href: "https://calendar.google.com/" },
] as const;

export function WelcomePack(): ReactNode {
  return (
    <div className="welcome-pack-page">
      <section className="welcome-start-grid">
        <article><p className="eyebrow">NGU HEADSHOT</p><h2>Look like part of the team from day one.</h2><p>Your professional headshot will be taken at induction. You will receive versions for:</p><ul><li>NGU website — black curtain background</li><li>REA website — skyline background</li><li>Domain website — skyline background</li><li>Signboard and marketing — transparent background</li></ul></article>
        <article><p className="eyebrow">EMAIL SIGNATURE</p><h2>Set up your NGU signature.</h2><p>Use the Google Doc template below. If you would like your headshot included, submit a request to the Design Team through Basecamp.</p><a href="https://drive.google.com/open?id=1HpqdppItmw-JEK-Liyj1XrANCMTQaQW3XVPobmM6Dmg" target="_blank" rel="noreferrer">Open signature template <ExternalLink size={16} /></a></article>
      </section>
      <section className="welcome-library"><div><CalendarDays /><div><p className="eyebrow">WELCOME PACKAGE</p><h2>Everything you need to get started.</h2></div></div><div className="welcome-resource-grid">{welcomeResources.map((resource) => <a href={resource.href} target="_blank" rel="noreferrer" key={resource.title}><FileText /><span><strong>{resource.title}</strong><small>{resource.description}</small></span><ArrowRight size={18} /></a>)}</div></section>
    </div>
  );
}

export function Offices(): ReactNode {
  return (
    <section className="content-section">
      <SectionHeading>QUEENSLAND</SectionHeading>
      <div className="office-grid office-details">{officeDetails.map(([name, phone, address, slug, image]) => <article key={name}><img src={`https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/NGU+Offices/office-${image}.jpg`} alt={`NGU ${name} office`} loading="lazy" /><div><h3>NGU {name}</h3><p>{address}</p><a href={`tel:${phone.replaceAll(" ", "")}`}>{phone}</a><a className="office-link" href={`https://ngurealestate.com.au/agency/${slug}`} target="_blank" rel="noreferrer">Meet the team <ArrowRight size={16} /></a></div></article>)}</div>
    </section>
  );
}
