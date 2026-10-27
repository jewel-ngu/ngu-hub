import { rexTrainingVideos, salesTrainingVideos, type TrainingVideo } from "@/lib/training-data";

export const EDITABLE_PAGE_KEYS = [
  "home",
  "leaderboard",
  "amlctf",
  "your-work-apps",
  "new-to-ngu",
  "new-to-ngu/onboarding",
  "info-hub",
  "info-hub/agent-listing-checklists",
  "info-hub/agent-listing-checklists/pre-appraisal",
  "info-hub/agent-listing-checklists/pre-launch",
  "info-hub/agent-listing-checklists/launch-open-home",
  "info-hub/agent-listing-checklists/post-open-home",
  "info-hub/agent-listing-checklists/auction",
  "info-hub/agent-listing-checklists/under-contract",
  "info-hub/agent-listing-checklists/settlement",
  "info-hub/welcome-pack",
  "info-hub/sales-training",
  "info-hub/rex-training",
  "real-estate-cpd",
  "our-people",
  "trusted-network",
  "ngu-offices",
] as const;

export type EditablePageKey = (typeof EDITABLE_PAGE_KEYS)[number];

export type EditablePage = {
  readonly label: string;
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly imagePosition: string;
};

export type EditablePerson = {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly imageUrl: string;
  readonly imagePosition: string;
};

export type EditableImageCard = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly imageUrl: string;
  readonly imagePosition: string;
};

export type CmsContent = {
  readonly schemaVersion: 1;
  readonly announcement: {
    readonly enabled: boolean;
    readonly message: string;
    readonly linkLabel: string;
    readonly href: string;
  };
  readonly home: {
    readonly kicker: string;
    readonly welcomeHeading: string;
    readonly welcomeText: string;
    readonly companyVideoUrl: string;
  };
  readonly pages: Readonly<Record<EditablePageKey, EditablePage>>;
  readonly award: {
    readonly name: string;
    readonly month: string;
    readonly heading: string;
    readonly category: string;
    readonly imageUrl: string;
    readonly imagePosition: string;
    readonly imageScale?: number;
    readonly imageOffsetX?: number;
    readonly imageOffsetY?: number;
    readonly mobileImageScale?: number;
    readonly mobileImageOffsetX?: number;
    readonly mobileImageOffsetY?: number;
  };
  readonly people: {
    readonly prestige: readonly EditablePerson[];
    readonly elite: readonly EditablePerson[];
  };
  readonly infoHub: {
    readonly cards: readonly EditableImageCard[];
    readonly requests: readonly (EditableImageCard & { readonly category: string })[];
  };
  readonly training: {
    readonly sales: readonly TrainingVideo[];
    readonly rex: readonly TrainingVideo[];
  };
};

const defaultPages: Readonly<Record<EditablePageKey, EditablePage>> = {
  home: { label: "Home", title: "Everything NGU.", subtitle: "Resources, tools, people and what’s happening next — all in one place.", imageUrl: "/images/home-city-v2.png", imagePosition: "50% 50%" },
  leaderboard: { label: "Leaderboard", title: "Leaderboard", subtitle: "Track performance across the network.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  amlctf: { label: "AML/CTF", title: "AML/CTF", subtitle: "Your centralised section for all training and documents.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "your-work-apps": { label: "Your Work Apps", title: "Your Work Apps", subtitle: "All your tools and platforms in one place.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "new-to-ngu": { label: "New to NGU", title: "New to NGU", subtitle: "Welcome to the team. Here's everything you need to get started.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "new-to-ngu/onboarding": { label: "New to NGU · Onboarding", title: "Your Onboarding Checklist", subtitle: "Core setup and role-specific pathways for new NGU team members.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "info-hub": { label: "Info Hub", title: "Info Hub", subtitle: "Your central resource for guides, training, and key contacts.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "info-hub/agent-listing-checklists": { label: "Agent Checklists", title: "Agent Checklists", subtitle: "Seven practical checklists from appraisal to settlement.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "info-hub/agent-listing-checklists/pre-appraisal": { label: "Agent Checklists · Pre-Appraisal", title: "Pre-Appraisal Checklist", subtitle: "Prepare the agent and listing pack before the appraisal.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "info-hub/agent-listing-checklists/pre-launch": { label: "Agent Checklists · Pre-Launch", title: "Pre-Launch Checklist", subtitle: "Complete the listing setup and approvals before going live.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "info-hub/agent-listing-checklists/launch-open-home": { label: "Agent Checklists · Launch / Open Home", title: "Launch / Open Home Checklist", subtitle: "Prepare the documents, schedule, property and open-home pack.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "info-hub/agent-listing-checklists/post-open-home": { label: "Agent Checklists · Post Open Home", title: "Post Open Home Checklist", subtitle: "Close the property, follow up buyers and report results.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "info-hub/agent-listing-checklists/auction": { label: "Agent Checklists · Auction", title: "Auction Checklist", subtitle: "Prepare documents, registration and auction-day follow-up.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "info-hub/agent-listing-checklists/under-contract": { label: "Agent Checklists · Under Contract", title: "Under Contract Checklist", subtitle: "Manage signing, notifications, critical dates and conditions.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "info-hub/agent-listing-checklists/settlement": { label: "Agent Checklists · Settlement", title: "Settlement Checklist", subtitle: "Coordinate inspection, settlement, handover and closeout.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "info-hub/welcome-pack": { label: "Welcome Package", title: "Welcome Package", subtitle: "Everything you need to get started at NGU.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "info-hub/sales-training": { label: "Sales Training", title: "Sales Training Hub", subtitle: "Training resources for all agents and sales teams.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "info-hub/rex-training": { label: "Rex Training", title: "Rex Training", subtitle: "Recorded webinars from Rex on getting the most out of your CRM.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "real-estate-cpd": { label: "Real Estate CPD", title: "Real Estate CPD", subtitle: "Stay current with professional development and industry requirements.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "our-people": { label: "Our People", title: "Our People", subtitle: "", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "trusted-network": { label: "Trusted Network", title: "Trusted Network", subtitle: "People we trust. For work done right.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
  "ngu-offices": { label: "NGU Offices", title: "NGU Offices", subtitle: "Our offices across Queensland.", imageUrl: "/images/work-apps-hero.png", imagePosition: "50% 50%" },
};

const prestigeNames = ["Emil Juresic", "Steve Athanates", "Charles Kimmorley", "Gillian & Rob Dargusch", "Matt Hawkins", "Todd Gerhardt", "Rebecca Cuderman", "Amie Tarrant", "Daniel Parsons", "Laney McQueen", "John Karlecik", "Jason Yang", "Nhan Tran", "Leo Liu", "Dan Holmes"] as const;
const prestigeRoles = ["Chairman of NGU Real Estate", "Principal · NGU Ipswich", "Principal · NGU Ripley & Surrounds", "Principals · NGU Ipswich Karalee", "Co-Principal · NGU Toowoomba", "Principal · NGU South East", "Principal · NGU Logan", "Principal · NGU Lifestyle", "Principal · NGU Ipswich Central", "Principal · NGU Booval", "Principal · NGU Brisbane West", "Principal · The Jason Yang Group", "Principal · NGU Bundaberg", "Agent · NGU Brisbane", "Agent · NGU Springfield"] as const;
const eliteNames = ["Robbie Witt", "Madison Miller", "Taylor Barnard", "Bryce Lee", "Leanne Arifovic", "Hayley Picker", "Rachel Hobbs", "Brady Chant"] as const;
const eliteRoles = ["Principal · NGU Toowoomba", "Agent · NGU Karalee", "Agent · NGU Karalee", "Agent · NGU Ripley & Surrounds", "Agent · NGU Ripley & Surrounds", "Agent · NGU Booval", "Sales & Marketing Specialist · NGU Logan", "Agent · NGU Ripley & Surrounds"] as const;

function peopleGroup(names: readonly string[], roles: readonly string[], imageOffset: number): readonly EditablePerson[] {
  return names.map((name, index) => ({
    id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${index}`,
    name,
    role: roles[index] ?? "NGU Agent",
    imageUrl: `/images/person-${index + imageOffset}.png`,
    imagePosition: "50% 0%",
  }));
}

export const DEFAULT_CMS_CONTENT: CmsContent = {
  schemaVersion: 1,
  announcement: { enabled: true, message: "Learn more about AML/CTF", linkLabel: "Explore the latest resources", href: "/amlctf" },
  home: {
    kicker: "CONNECTED BY AMBITION.",
    welcomeHeading: "WELCOME TO NGU REAL ESTATE",
    welcomeText: "NGU Real Estate is one of Queensland's fastest-growing independent real estate groups. Whether you're new to the team or a long-standing member, this Hub is your go-to for tools, resources, contacts, and company updates — everything you need in one place.",
    companyVideoUrl: "https://www.youtube.com/watch?v=mOGl90k7F1M",
  },
  pages: defaultPages,
  award: {
    name: "JASON YANG",
    month: "AUGUST 2026",
    heading: "SALES AGENT OF THE MONTH",
    category: "BY SETTLED COMMISSIONS",
    imageUrl: "/images/agent-of-the-month.png",
    imagePosition: "right bottom",
    imageScale: 100,
    imageOffsetX: 0,
    imageOffsetY: 0,
    mobileImageScale: 100,
    mobileImageOffsetX: 0,
    mobileImageOffsetY: 0,
  },
  people: {
    prestige: peopleGroup(prestigeNames, prestigeRoles, 6),
    elite: peopleGroup(eliteNames, eliteRoles, 22),
  },
  infoHub: {
    cards: [
      { id: "agent-listing-checklists", title: "Agent Checklists", description: "Seven practical checklists from appraisal to settlement.", href: "/info-hub/agent-listing-checklists", imageUrl: "https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/-.png", imagePosition: "50% 50%" },
      { id: "welcome-pack", title: "Welcome Pack", description: "Everything you need for your first weeks at NGU.", href: "/info-hub/welcome-pack", imageUrl: "https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/DSC01401.jpg", imagePosition: "50% 50%" },
      { id: "sales-training", title: "Sales Training", description: "Training resources for agents and sales teams.", href: "/info-hub/sales-training", imageUrl: "https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/DSC00291.jpg", imagePosition: "50% 50%" },
      { id: "rex-training", title: "Rex Training", description: "Recorded webinars to help you get more from Rex.", href: "/info-hub/rex-training", imageUrl: "https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/DSC01401.jpg", imagePosition: "50% 50%" },
    ],
    requests: [
      { id: "social-media-post", category: "Marketing", title: "Social Media Post", description: "Request your listing or achievement to be featured on Instagram and Facebook.", href: "https://form.jotform.com/251597367345064", imageUrl: "https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/socialmedia.png", imagePosition: "50% 50%" },
      { id: "blog-post-request", category: "Content", title: "Blog Post Request", description: "Have a topic or suggestion for our weekly blog? Send it to the content team for review.", href: "https://form.jotform.com/251631287914864", imageUrl: "https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/blogpost.png", imagePosition: "50% 50%" },
    ],
  },
  training: { sales: salesTrainingVideos, rex: rexTrainingVideos },
};

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLimitedString(value: unknown, maximumLength: number): value is string {
  return typeof value === "string" && value.length <= maximumLength;
}

function isSafeLink(value: unknown): value is string {
  if (!isLimitedString(value, 2_000)) return false;
  if (value.startsWith("/")) return true;
  try {
    const protocol = new URL(value).protocol;
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

function isVideo(value: unknown): value is TrainingVideo {
  return isRecord(value) && isLimitedString(value.title, 200) && isLimitedString(value.date, 80) && isSafeLink(value.href);
}

function isPerson(value: unknown): value is EditablePerson {
  return isRecord(value) && isLimitedString(value.id, 120) && isLimitedString(value.name, 160) && isLimitedString(value.role, 240) && isSafeLink(value.imageUrl) && isLimitedString(value.imagePosition, 40);
}

function isImageCard(value: unknown, request = false): boolean {
  return isRecord(value) && isLimitedString(value.id, 120) && isLimitedString(value.title, 160) && isLimitedString(value.description, 500) && isSafeLink(value.href) && isSafeLink(value.imageUrl) && isLimitedString(value.imagePosition, 40) && (!request || isLimitedString(value.category, 80));
}

export function isCmsContent(value: unknown): value is CmsContent {
  if (!isRecord(value) || value.schemaVersion !== 1 || !isRecord(value.announcement) || !isRecord(value.home) || !isRecord(value.pages) || !isRecord(value.award) || !isRecord(value.people) || !isRecord(value.infoHub) || !isRecord(value.training)) return false;
  const announcement = value.announcement;
  const home = value.home;
  const award = value.award;
  const training = value.training;
  const people = value.people;
  const infoHub = value.infoHub;
  const pageRecords = value.pages;
  const validPages = EDITABLE_PAGE_KEYS.every((key) => {
    const page = pageRecords[key];
    return isRecord(page) && isLimitedString(page.label, 80) && isLimitedString(page.title, 160) && isLimitedString(page.subtitle, 500) && isSafeLink(page.imageUrl) && isLimitedString(page.imagePosition, 40);
  });

  return validPages && typeof announcement.enabled === "boolean" && isLimitedString(announcement.message, 160) && isLimitedString(announcement.linkLabel, 160) && isSafeLink(announcement.href)
    && isLimitedString(home.kicker, 100) && isLimitedString(home.welcomeHeading, 160) && isLimitedString(home.welcomeText, 2_000) && isSafeLink(home.companyVideoUrl)
    && isLimitedString(award.name, 120) && isLimitedString(award.month, 80) && isLimitedString(award.heading, 160) && isLimitedString(award.category, 160) && isSafeLink(award.imageUrl) && isLimitedString(award.imagePosition, 40) && (award.imageScale === undefined || (typeof award.imageScale === "number" && Number.isFinite(award.imageScale) && award.imageScale >= 50 && award.imageScale <= 180))
    && (award.imageOffsetX === undefined || (typeof award.imageOffsetX === "number" && Number.isFinite(award.imageOffsetX) && award.imageOffsetX >= -100 && award.imageOffsetX <= 100))
    && (award.imageOffsetY === undefined || (typeof award.imageOffsetY === "number" && Number.isFinite(award.imageOffsetY) && award.imageOffsetY >= -100 && award.imageOffsetY <= 100))
    && (award.mobileImageScale === undefined || (typeof award.mobileImageScale === "number" && Number.isFinite(award.mobileImageScale) && award.mobileImageScale >= 50 && award.mobileImageScale <= 180))
    && (award.mobileImageOffsetX === undefined || (typeof award.mobileImageOffsetX === "number" && Number.isFinite(award.mobileImageOffsetX) && award.mobileImageOffsetX >= -100 && award.mobileImageOffsetX <= 100))
    && (award.mobileImageOffsetY === undefined || (typeof award.mobileImageOffsetY === "number" && Number.isFinite(award.mobileImageOffsetY) && award.mobileImageOffsetY >= -100 && award.mobileImageOffsetY <= 100))
    && Array.isArray(people.prestige) && people.prestige.length <= 100 && people.prestige.every(isPerson)
    && Array.isArray(people.elite) && people.elite.length <= 100 && people.elite.every(isPerson)
    && Array.isArray(infoHub.cards) && infoHub.cards.length <= 50 && infoHub.cards.every((card) => isImageCard(card))
    && Array.isArray(infoHub.requests) && infoHub.requests.length <= 50 && infoHub.requests.every((card) => isImageCard(card, true))
    && Array.isArray(training.sales) && training.sales.length <= 500 && training.sales.every(isVideo)
    && Array.isArray(training.rex) && training.rex.length <= 500 && training.rex.every(isVideo);
}
