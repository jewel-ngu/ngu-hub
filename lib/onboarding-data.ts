export type ChecklistGroup = {
  readonly title: string;
  readonly description?: string;
  readonly items: readonly string[];
};

export const firstWeekStages = [
  { title: "Day 1", description: "Get connected", items: ["Access NGU Hub and your email", "Set up your calendar", "Confirm required systems access"] },
  { title: "Days 2–3", description: "Get set up", items: ["Complete your email signature", "Review NGU branding", "Finalise your profiles and systems"] },
  { title: "Days 3–5", description: "Learn the NGU way", items: ["Explore your training pathway", "Review compliance requirements", "Understand marketing processes"] },
  { title: "By Day 7", description: "Ready to go", items: ["Complete your onboarding checklist", "Meet your key support contacts", "Confirm outstanding requirements"] },
] satisfies readonly ChecklistGroup[];

export const generalOnboardingGroups = [
  {
    title: "NGU Profile",
    description: "Complete the core profile and employment setup.",
    items: ["Employment Agreement (Contract)", "Staff Details Form", "TFN Declaration", "Headshots (taken after Induction)", "Staff Profile on Website", "Bio on Website", "Contact Details for Contact List", "Social Media Pages Rebranded to NGU", "Set Up NGU Email Address"],
  },
  {
    title: "Office Set-Up",
    description: "Get the essentials ready for the first working week.",
    items: ["Registration / Licence saved to CPD Tracker", "Registration / Licence printed and filed at Admin's Desk", "Calendar Reminder for Licence Renewal", "Attend Induction at HQ", "Set Up Printer", "Add to Internal Chat", "Cost of Purchasing Equipment"],
  },
] satisfies readonly ChecklistGroup[];

export const salesAgentGroups = [
  { title: "Software — Sales Agent", description: "Confirm access to each platform used by the sales team.", items: ["REA", "Domain", "DocuSign", "Rex", "Homepass", "Realworks", "PriceFinder", "RP Data", "RealHub", "Basecamp"] },
  { title: "Sales Agent Essentials", description: "Build confidence in NGU processes, your team and your daily routine.", items: ["Meet your principal, lead agent, office champion and HQ contacts", "Review NGU Hub, the weekly sales training calendar and induction resources", "Understand prospecting, appraisal, listing and buyer follow-up responsibilities", "Review client communication, professional presentation and NGU service standards", "Confirm coaching and supervised appraisal / open-home opportunities"] },
  { title: "Appraisal & Listing Preparation", description: "Learn what needs to happen before meeting a seller and launching a listing.", items: ["Review the pre-appraisal checklist and listing pack requirements", "Learn how to prepare and review a CMA with your lead agent", "Locate the current approved Form 6, marketing schedule and listing paperwork", "Learn photography, floor plan, trades and vendor-approval workflow", "Practise checking listing details and photos in Rex with a supervisor"] },
  { title: "Open Homes & Buyer Management", description: "Understand inspections, buyer data and follow-up.", items: ["Review open-home schedules, keys, signage and property packs", "Learn property attributes and how to answer buyer enquiries", "Practise Rex check-in and buyer follow-up notes", "Understand same-day feedback and vendor-reporting expectations", "Review auction preparation and registration as relevant"] },
  { title: "Contracts, Compliance & Settlement", description: "Understand approvals, critical dates and handover responsibilities.", items: ["Locate the current approved compliance, Form 6 and disclosure guidance", "Review offer and contract escalation with a lead agent", "Learn how finance, building and pest and settlement dates are monitored", "Understand listing status changes and office admin / accounts handovers", "Review settlement inspection, key-release and post-sale follow-up procedures"] },
] satisfies readonly ChecklistGroup[];

export const salesAdminGroups = [
  { title: "Software — Sales Admin", description: "Confirm access to the platforms used in the administration workflow.", items: ["RealHub", "Basecamp"] },
  { title: "Sales Admin Essentials", description: "Orientation to the admin role and internal processes.", items: ["Meet principal, office champion and key HQ contacts", "Review the Sales Administration Manual", "Understand daily admin inbox and request handover", "Review central filing structure and document naming", "Review the sales administration process from Form 6 to settlement", "Confirm training schedule with supervising staff member"] },
  { title: "Compliance & Documentation", description: "Supervisor-guided learning, not a property compliance sign-off.", items: ["Locate the current approved Form 6 checklist", "Understand how to check completed Form 6s and marketing authority", "Review vendor ID, disclosure and document handling expectations", "Understand when to flag missing or incorrect paperwork", "Review confidentiality and secure document handling"] },
  { title: "Marketing & Workflow", description: "Introduction to marketing coordination and handovers.", items: ["Understand vendor paid advertising and approval workflow", "Review requests for signboards and marketing collateral", "Practise a RealHub template workflow with a supervisor", "Learn when to request creative work through Basecamp", "Understand listing launch checks and authorisation", "Review contract condition and settlement handover process"] },
] satisfies readonly ChecklistGroup[];
