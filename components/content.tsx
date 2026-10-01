import { ArrowRight, CalendarDays, ExternalLink, FileText, Mail, PlayCircle, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { OnboardingChecklist } from "@/components/onboarding-checklist";
import { appGroups, people, rexTraining, salesTraining, type SimplePage } from "@/lib/site-data";
import { supportContacts } from "@/lib/support-contacts";
import { officeDetails } from "@/lib/office-details";
import { LiveDirectory } from "@/components/live-directory";

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
        <div>{appGroups.map((group) => <a href={`#${group.title.toLowerCase().replaceAll(" ", "-")}`} key={group.title}>{group.title}</a>)}</div>
        <p>NGU runs on a suite of software tools designed to keep every department connected and operating efficiently. Some platforms are used company-wide, while others are specific to your role. Browse by category below to find what you need.</p>
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

export function InfoHub(): ReactNode {
  const contacts = supportContacts;

  return (
    <div className="hub-resource-page">
      <section className="hub-feature-section">
        <p className="eyebrow">EXPLORE THE HUB</p>
        <div className="hub-image-grid">
          <ImageLinkCard title="Agent Toolkit" description="Essential marketing guides, templates, and resources." href="/info-hub/agent-toolkit" image="https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/-.png" />
          <ImageLinkCard title="Welcome Pack" description="Everything you need for your first weeks at NGU." href="/info-hub/welcome-pack" image="https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/DSC01401.jpg" />
          <ImageLinkCard title="Sales Training" description="Training resources for agents and sales teams." href="/info-hub/sales-training" image="https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/DSC00291.jpg" />
        </div>
      </section>

      <section className="hub-request-section">
        <div>
          <p className="eyebrow">MARKETING REQUESTS</p>
          <h2>Ready when you are.</h2>
        </div>
        <div className="request-grid">
          <RequestCard title="Social Media Post" category="Marketing" description="Request your listing or achievement to be featured on Instagram and Facebook." href="https://form.jotform.com/251597367345064" image="https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/socialmedia.png" />
          <RequestCard title="Blog Post Request" category="Content" description="Have a topic or suggestion for our weekly blog? Send it to the content team for review." href="https://form.jotform.com/251631287914864" image="https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/blogpost.png" />
        </div>
      </section>

      <HelpDirectory contacts={contacts} />
    </div>
  );
}

type ImageLinkCardProps = {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly image: string;
};

function ImageLinkCard({ title, description, href, image }: ImageLinkCardProps): ReactNode {
  return (
    <Link className="hub-image-card" href={href}>
      <img src={image} alt="" />
      <div><h2>{title}</h2><p>{description}</p><ArrowRight /></div>
    </Link>
  );
}

function RequestCard({ title, category, description, href, image }: ImageLinkCardProps & { readonly category: string }): ReactNode {
  return (
    <a className="request-card" href={href} target="_blank" rel="noreferrer">
      <img src={image} alt="" />
      <div><span>{category}</span><h3>{title}</h3><p>{description}</p><strong>Submit request <ArrowRight size={17} /></strong></div>
    </a>
  );
}

type Contact = readonly [title: string, subtitle: string, email: string | readonly string[]];

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

export function AgentToolkit(): ReactNode {
  return (
    <section className="content-section">
      <div className="feature-grid three">
        <LinkCard title="Pre-List Resources" description="Prepare for a strong appraisal and listing." href="/info-hub/agent-toolkit/pre-list" />
        <LinkCard title="Pre-Sale Resources" description="Set up every campaign for success." href="/info-hub/agent-toolkit/pre-sale" />
        <LinkCard title="Open Home Resources" description="Present, capture and follow up." href="/info-hub/agent-toolkit/open-home" />
      </div>
    </section>
  );
}

export function OurPeople(): ReactNode {
  const prestigeRoles = ["Chairman of NGU Real Estate", "Principal · NGU Ipswich", "Principal · NGU Ripley & Surrounds", "Principals · NGU Ipswich Karalee", "Co-Principal · NGU Toowoomba", "Principal · NGU South East", "Principal · NGU Logan", "Principal · NGU Lifestyle", "Principal · NGU Ipswich Central", "Principal · NGU Booval", "Principal · NGU Brisbane West", "Principal · The Jason Yang Group", "Principal · NGU Bundaberg", "Agent · NGU Brisbane", "Agent · NGU Springfield"] as const;
  const eliteRoles = ["Principal · NGU Toowoomba", "Agent · NGU Karalee", "Agent · NGU Karalee", "Agent · NGU Ripley & Surrounds", "Agent · NGU Ripley & Surrounds", "Agent · NGU Booval", "Sales & Marketing Specialist · NGU Logan", "Agent · NGU Ripley & Surrounds"] as const;
  return (
    <div className="content-stack people-page">
      <section className="winner">
        <img src="/images/agent-of-the-month.png" alt="Jason Yang" />
        <div><div className="award-stars" aria-hidden="true">★ <span>★</span> ★</div><h1>AGENT OF<br />THE MONTH</h1><p className="award-month">AUGUST 2026</p><div className="award-rule" /><h2>SALES AGENT<br />OF THE MONTH</h2><p className="award-category">BY SETTLED COMMISSIONS</p><strong className="award-name">JASON YANG</strong></div>
      </section>
      <PeopleGroup title="MEET OUR PRESTIGE AGENTS" names={people.prestige} roles={prestigeRoles} />
      <PeopleGroup title="MEET OUR ELITE AGENTS" names={people.elite} roles={eliteRoles} />
      <LiveDirectory kind="people" />
    </div>
  );
}

function PeopleGroup({ title, names, roles }: { readonly title: string; readonly names: readonly string[]; readonly roles: readonly string[] }): ReactNode {
  return (
    <section className="content-section">
      <SectionHeading>{title}</SectionHeading>
      <div className="people-grid">{names.map((name, index) => <article key={name}><img src={`/images/person-${index + (title.includes("PRESTIGE") ? 6 : 22)}.png`} alt={name} loading="lazy" /><h3>{name}</h3><p>{roles[index] ?? "NGU Agent"}</p></article>)}</div>
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
      <OnboardingChecklist />
      <section className="new-ngu-form-six"><div><p className="eyebrow">TO COMPLETE A FORM 6</p><h2>Start with the right process.</h2><p>Watch the tutorial to understand how NGU completes a Form 6, and why it is important.</p></div><iframe src="https://drive.google.com/file/d/1s5EN21opIJhJAMr_Lv3G6erHobP9Beew/preview" title="How to complete a Form 6" allow="autoplay" /></section>
      <section className="marketing-system"><div><p className="eyebrow">MARKETING MATERIALS</p><h2>Two platforms, one consistent brand.</h2><p>RealHub brings Rex data into NGU templates. Use Basecamp for other creative requests and custom work.</p><div className="platform-links"><a href="https://launchpad.37signals.com/signin" target="_blank" rel="noreferrer">Open Basecamp <ExternalLink size={16} /></a><a href="https://realhub-frontend.realbase.io/" target="_blank" rel="noreferrer">Open RealHub <ExternalLink size={16} /></a></div></div><ul><li>Brochures — A3, A3 landscape and A4</li><li>Signboards — generic, vertical and three-photo</li><li>DL and DLX flyers</li><li>A4 flyers</li><li>Social media assets</li><li>Business cards</li></ul></section>
      <section className="initial-marketing-pack"><p className="eyebrow">INITIAL MARKETING MATERIAL PACK</p><h2>Request these through Basecamp.</h2><div>{["Offer to Purchase Form", "A-Frame", "Business Card", "Text Signboard", "Blank Letterhead", "Know What Your Home is Worth Letter", "Street Anniversary Letter", "Just Appraised DLs", "A5 Black Ribbon Card", "Marketing Schedule Annexure A"].map((item) => <span key={item}>{item}</span>)}</div></section>
      <section className="new-ngu-resources"><p className="eyebrow">BRAND RESOURCES</p><div><a href="https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/NGU+Real+Estate_Logo+and+Branding+Guidelines+2025_Edgar+NEW.pdf" target="_blank" rel="noreferrer"><FileText /><h3>Logo & Branding Guidelines</h3><ExternalLink /></a><a href="https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/Welcome+Package/NGU+Real+Estate+-+Marketing+Material+2025-2026.pdf" target="_blank" rel="noreferrer"><FileText /><h3>Marketing Materials 2025–2026</h3><ExternalLink /></a><a href="https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/Welcome+Package/Design+golden+rule+2025.pdf" target="_blank" rel="noreferrer"><FileText /><h3>Design Golden Rule</h3><ExternalLink /></a></div></section>
      <section className="sample-documents"><p className="eyebrow">SAMPLE MARKETING MATERIALS</p><div>{marketingSamples.map(([title, href, preview]) => <article key={title}><iframe src={preview} title={`${title} preview`} loading="lazy" /><a href={href} target="_blank" rel="noreferrer">{title} <ExternalLink size={16} /></a></article>)}</div></section>
    </div>
  );
}

export function RealEstateCpd(): ReactNode {
  return (
    <div className="cpd-page">
      <section className="cpd-intro"><div><p className="eyebrow">CONTINUING PROFESSIONAL DEVELOPMENT</p><h2>Stay licensed. Stay current.</h2><p>Queensland real estate agents and salespeople must complete continuing professional development annually. The live requirements tool below helps you understand what is due and when.</p></div><a href="https://members.reiq.com/portal/library?fileTypes=&categoryOrdinal=12" target="_blank" rel="noreferrer"><strong>REIQ CPD online library</strong><span>Browse pre-recorded CPD training</span><ArrowRight /></a></section>
      <section className="cpd-requirements"><div><p className="eyebrow">LIVE CPD REQUIREMENTS</p><h2>REIQ CPD training</h2></div><iframe src="https://script.google.com/macros/s/AKfycbzmmJiDDSGqHVFogtPXqVv1xJqMdChESgrWLwsbnmbf-IWaxilnGRiYo4QxIK2GrJMP/exec" title="Live REIQ CPD requirements tool" loading="lazy" /></section>
    </div>
  );
}

export function TrainingList({ type }: { readonly type: "sales" | "rex" }): ReactNode {
  const entries = type === "sales" ? salesTraining : rexTraining;
  return (
    <section className="content-section training-section">
      <div className="training-grid">
        {entries.map((entry, index) => (
          <article className="training-card" key={entry}>
            <PlayCircle />
            <div><h3>{entry}{type === "rex" ? ` — #${String(entries.length - index).padStart(2, "0")}` : ""}</h3><p>{type === "sales" ? "Sales training" : "Rex webinar"} · 2026</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function WelcomePack(): ReactNode {
  return <section className="content-section"><div className="welcome-panel"><CalendarDays /><div><h2>Your onboarding package</h2><p>Everything you need to get started at NGU, including account access, brand standards and email signatures.</p></div></div><DocumentCard title="2025 Email Signatures – NGU Brisbane" /></section>;
}

export function Offices(): ReactNode {
  return (
    <section className="content-section">
      <SectionHeading>QUEENSLAND</SectionHeading>
      <div className="office-grid office-details">{officeDetails.map(([name, phone, address, slug, image]) => <article key={name}><img src={`https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/NGU+Offices/office-${image}.jpg`} alt={`NGU ${name} office`} loading="lazy" /><div><h3>NGU {name}</h3><p>{address}</p><a href={`tel:${phone.replaceAll(" ", "")}`}>{phone}</a><a className="office-link" href={`https://ngurealestate.com.au/agency/${slug}`} target="_blank" rel="noreferrer">Meet the team <ArrowRight size={16} /></a></div></article>)}</div>
    </section>
  );
}
