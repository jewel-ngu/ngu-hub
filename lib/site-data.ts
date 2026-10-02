export type NavItem = {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
};

export type SimplePage = {
  readonly title: string;
  readonly subtitle?: string;
  readonly hero?: string;
  readonly kind: "simple" | "toolkit" | "resources";
  readonly sections?: readonly {
    readonly title: string;
    readonly body?: string;
    readonly items?: readonly string[];
  }[];
};

export const navItems: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "AML/CTF", href: "/amlctf" },
  { label: "Your Work Apps", href: "/your-work-apps" },
  { label: "New to NGU", href: "/new-to-ngu" },
  { label: "Info Hub", href: "/info-hub" },
  { label: "Real Estate CPD", href: "/real-estate-cpd" },
  { label: "Our People", href: "/our-people" },
  { label: "Trusted Network", href: "/trusted-network" },
  { label: "Finance Services", href: "https://ngurealestate.com.au/finance-services", external: true },
  { label: "NGU Offices", href: "/ngu-offices" },
  { label: "Principal Access 🔒", href: "https://sites.google.com/ngurealestate.com.au/ngupricipals", external: true },
];

export const infoNavItems: readonly NavItem[] = [
  { label: "Pre-List", href: "/info-hub/agent-toolkit/pre-list" },
  { label: "Pre-Sale", href: "/info-hub/agent-toolkit/pre-sale" },
  { label: "Open Home", href: "/info-hub/agent-toolkit/open-home" },
  { label: "Welcome Pack", href: "/info-hub/welcome-pack" },
  { label: "Sales Training", href: "/info-hub/sales-training" },
  { label: "Rex Training", href: "/info-hub/rex-training" },
];

export const pages: Readonly<Record<string, SimplePage>> = {
  leaderboard: {
    title: "Leaderboard",
    subtitle: "Track performance across the network.",
    kind: "simple",
    sections: [
      {
        title: "NGU LEADERBOARD",
        body: "Rankings are based on GCI per agent (unconditional sales), total settled properties, and total listings per month.",
      },
      {
        title: "AUGUST RESULTS",
        items: ["Top settled commissions", "Top listings", "Top team performance"],
      },
    ],
  },
  amlctf: {
    title: "AML/CTF",
    subtitle: "Your centralised section for all training and documents.",
    kind: "resources",
    sections: [
      { title: "TRAINING SESSIONS", items: ["Compliance Team Training: NGU Real Estate and First AML", "Agent Training: NGU Real Estate and First AML"] },
      { title: "RECOMMENDED APPS", items: ["First AML", "NGUxFirstAML Client Guide"] },
      { title: "PLATFORM TRAINING", body: "Access system training, admin resources and general platform training from your First AML account." },
      { title: "AML/CTF COMPLIANCE RESOURCES", items: ["For Sellers – AML/CTF Fact Sheet", "For Buyers – AML/CTF Fact Sheet", "First AML – Common Complex Seller Scenarios", "Reporting Group – Risk Assessment", "Reporting Group – Policy"] },
      { title: "NEED HELP?", body: "Please reach out to the relevant compliance contact for assistance." },
    ],
  },
  "new-to-ngu": {
    title: "New to NGU",
    subtitle: "Welcome to the team. Here's everything you need to get started.",
    kind: "resources",
    sections: [
      { title: "YOUR ONBOARDING CHECKLIST", items: ["Complete your profile and email signature", "Access your core work apps", "Meet your office and support team", "Complete required training"] },
      { title: "TO COMPLETE A FORM 6", body: "Watch the tutorial to understand how NGU completes a Form 6, and why it is important." },
      { title: "SAMPLE MARKETING MATERIALS", items: ["A4 Offer to purchase form", "Business Cards", "Signboards", "NGU A-frame"] },
    ],
  },
  "real-estate-cpd": {
    title: "Real Estate CPD",
    subtitle: "Stay current with professional development and industry requirements.",
    kind: "resources",
    sections: [{ title: "CONTINUING PROFESSIONAL DEVELOPMENT", items: ["Upcoming CPD sessions", "Training resources", "Certificates and compliance records"] }],
  },
  "trusted-network": {
    title: "Trusted Network",
    subtitle: "People we trust. For work done right.",
    kind: "resources",
    sections: [{ title: "CONTACT DIRECTORY", body: "Browse our universal supplier list by service category.", items: ["Photography & videography", "Building & pest", "Legal & conveyancing", "Trades & maintenance", "Styling & staging", "Finance services"] }],
  },
};

const appAssetRoot = "https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Assets";

export type WorkApp = {
  readonly name: string;
  readonly description: string;
  readonly href: string;
  readonly image: string;
};

const workApp = (name: string, description: string, href: string, image: string): WorkApp => ({ name, description, href, image: `${appAssetRoot}/${image}` });

export const appGroups = [
  { title: "COMMUNICATION", apps: [
    workApp("Gmail", "Receive and send emails", "https://mail.google.com/", "Gmail.png"),
    workApp("Facebook", "Company-wide communication", "https://www.facebook.com/", "Facebook.png"),
    workApp("WhatsApp", "Team communication", "https://www.whatsapp.com/", "Whatsapp.png"),
  ] },
  { title: "SOFTWARE", apps: [
    workApp("Google Suite", "Access Google apps", "https://workspace.google.com/dashboard", "G+Suite.png"),
    workApp("CoreLogic / RP Data", "CMAs and rental appraisals", "https://rpp.corelogic.com.au/", "CoreLogic.png"),
    workApp("Realworks", "Create contracts and forms", "https://app.realworks.com.au/", "Realworks.png"),
    workApp("Pricefinder", "Order title searches and CMAs", "https://www.pricefinder.com.au/", "Pricefinder.png"),
    workApp("DocuSign", "Send forms to be signed", "https://account.docusign.com/", "Docusign.png"),
    workApp("Rex CRM", "Input listings and contacts", "https://app.rexsoftware.com/", "Rex+Website.png"),
    workApp("Homepass", "Check in open-home attendees", "https://app.homepass.com/login", "Homepass.png"),
    workApp("Monday.com", "Workflow and project management", "https://auth.monday.com/auth/login_monday", "Monday.png"),
    workApp("QBCC", "Check pool safety certificates", "https://my.qbcc.qld.gov.au/", "Qbcc.png"),
    workApp("ChatGPT", "Content writing", "https://chatgpt.com/", "Chatgpt.png"),
    workApp("Strata Assist", "Order community management statements", "https://strataassistqld.com.au/log-in/", "Strata+Assist+QLD.png"),
    workApp("Cognito Forms", "Create e-appraisal forms", "https://www.cognitoforms.com/login", "Cognito+Forms.png"),
    workApp("Rate My Agent", "Performance data", "https://www.ratemyagent.com.au/profile/login", "RMA.png"),
    workApp("Titles Queensland", "Lodgement and title ownership searches", "https://www.titlesqld.com.au/", "Titles+QLD.png"),
    workApp("ID4me", "Search tool for sales", "https://id4me.me/", "ID+for+me.png"),
    workApp("Local Agent Finder", "Connect with interested clients", "https://agents.localagentfinder.com.au/Access/Login", "Local+Agent+Finder.png"),
  ] },
  { title: "SOCIAL MEDIA", apps: [
    workApp("Facebook", "Connect and promote", "https://www.facebook.com/", "Facebook.png"),
    workApp("Instagram", "Collaborate and share photos or videos", "https://www.instagram.com/ngu_real_estate/", "Instagram.png"),
    workApp("TikTok", "Post short-form videos", "https://www.tiktok.com/login", "TikTok.png"),
    workApp("WeChat", "Reach Chinese-speaking audiences", "https://web.wechat.com/", "WeChat.png"),
  ] },
  { title: "PROPERTY MANAGEMENT", apps: [
    workApp("PropertyMe", "Rent portfolio management", "https://manager.propertyme.com/", "Prop+Me.png"),
    workApp("TICA", "Process checks on applications", "https://members6.tica.com.au/login.php", "Tica+Check.png"),
    workApp("Inspect Real Estate", "Process applications", "https://app.inspectrealestate.com.au/Identity/Account/LogIn", "Inspect+Realestate.png"),
    workApp("RTA", "Rental bonds, issues and disputes", "https://www.rta.qld.gov.au/", "RTA.png"),
  ] },
  { title: "MARKETING", apps: [
    workApp("REA", "List properties", "https://www.realestate.com.au/", "REA.png"),
    workApp("Domain", "List properties", "https://www.domain.com.au/", "Domain.png"),
    workApp("Ignite", "Coming soon, leads and Audience Maximiser", "https://ignite.realestate.com.au/", "Ignite.png"),
    workApp("Prolist", "Order signboards", "https://prolist.net.au/Auth/Login.aspx", "Prolist.png"),
    workApp("Basecamp", "Assign creative tasks", "https://launchpad.37signals.com/signin", "Basecamp.png"),
    workApp("RealHub", "Generate marketing materials from templates", "https://realhub-frontend.realbase.io/", "Realhub-137.png"),
    workApp("Realty Assist", "Marketing invoices", "https://app.realtyassist.com.au/auth/login", "RealtyAssist.png"),
    workApp("Rex CRM", "Access data and listings", "https://app.rexsoftware.com/", "Rex+Website.png"),
    workApp("Heyzine", "Upload and view e-brochures", "https://heyzine.com/#login", "HeyZine.png"),
    { name: "Amplifies AI", description: "Turn images into property videos", href: "https://www.amplifiles.ai/", image: "https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/Amplies+AI_Intranet+Icon.png" },
  ] },
  { title: "ADMIN", apps: [
    workApp("TelTel", "Phone requirements", "https://teltel.com.au/", "TelTel.png"),
    workApp("BBC Digital", "Printer requirements", "https://www.bbcdigital.com.au/", "BBC+Printer.png"),
    workApp("Officeworks", "Stationery supplies", "https://www.officeworks.com.au/", "Office+Work.png"),
    workApp("Otter", "AI voice notes and notetaking", "https://otter.ai/signin/", "Otter+Voice.png"),
    workApp("Google Calendar", "Scheduling and events", "https://calendar.google.com/", "GG+calendar.png"),
    workApp("Google Admin Console", "Manage Google services", "https://admin.google.com/", "GG+Admin+Console.png"),
    workApp("Google Business", "Manage the business profile in Google", "https://business.google.com/", "Google+Business.png"),
    workApp("REIQ", "Training and advice for real estate professionals", "https://members.reiq.com/portal/sign-in.aspx", "REIQ.png"),
    workApp("REB", "Real estate market intelligence", "https://www.realestatebusiness.com.au/login", "REB.png"),
    workApp("First AML", "AML/CTF compliance platform", "https://app.firstaml.com/home", "Intranet+Icon_FirstAML.png"),
  ] },
  { title: "ACCOUNTS", apps: [
    workApp("Xero Me", "Accounting software", "https://login.xero.com/", "XeroMe.png"),
    workApp("Property Tree", "Task management and tenant communication", "https://agent.propertytree.com/", "Prop+Tree.png"),
    workApp("Rex CRM", "Access data and listings", "https://app.rexsoftware.com/", "Rex+Website.png"),
    workApp("CommBiz", "Authorise payments and view balances", "https://www1.my.commbiz.commbank.com.au/Business/login", "Common+Bank-171.png"),
  ] },
  { title: "STORAGE", apps: [
    workApp("Dropbox", "File hosting service", "https://www.dropbox.com/login", "Dropbox.png"),
    workApp("Google Drive", "Manage and share content across devices", "https://drive.google.com/", "Drive.png"),
  ] },
] as const;

export const people = {
  prestige: ["Emil Juresic", "Steve Athanates", "Charles Kimmorley", "Gillian & Rob Dargusch", "Matt Hawkins", "Todd Gerhardt", "Rebecca Cuderman", "Amie Tarrant", "Daniel Parsons", "Laney McQueen", "John Karlecik", "Jason Yang", "Nhan Tran", "Leo Liu", "Dan Holmes"],
  elite: ["Robbie Witt", "Madison Miller", "Taylor Barnard", "Bryce Lee", "Leanne Arifovic", "Hayley Picker", "Rachel Hobbs", "Brady Chant"],
} as const;

export const offices = ["Brisbane", "Ipswich", "Ripley & Surrounds", "Karalee", "Toowoomba", "South East", "Logan", "Lifestyle", "Ipswich Central", "Booval", "Brisbane West", "Bundaberg", "Springfield"] as const;
