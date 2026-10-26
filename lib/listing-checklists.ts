export type ListingChecklistSection = {
  readonly title: string;
  readonly items: readonly string[];
};

export type ListingChecklist = {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly instruction: string;
  readonly sections: readonly ListingChecklistSection[];
};

export const listingChecklists = [
  {
    slug: "pre-appraisal",
    title: "Pre-Appraisal Checklist",
    description: "Prepare the agent and listing pack before the appraisal.",
    instruction: "Complete all items before the agent leaves the office for an appraisal.",
    sections: [
      { title: "Listing Pack Preparation", items: ["Listing pack printed and assembled (neat, professional, no creased pages)", "Agent's business cards in the pack (minimum 5)", "Recent sold flyers included (comparable sales in the area)", "Agent's personal booklet / bio included in pack", "Agency marketing brochure included"] },
      { title: "CMA (Comparative Market Analysis)", items: ["CMA prepared using Rex or RP Data — correct property address confirmed", "CMA includes recent comparable sales (within 6 months, similar property type)", "CMA includes current competing listings in the area", "CMA printed and placed in listing pack", "Agent has reviewed and approved the CMA before leaving"] },
      { title: "Form 6 (Appointment to Act)", items: ["Blank Form 6 printed and included in listing pack", "Agent's details pre-filled on the Form 6 (name, licence number, agency)", "Commission structure confirmed with agent and noted on Form 6", "Marketing schedule / costs noted if applicable"] },
      { title: "Agent Readiness", items: ["Agent's phone is charged", "Agent has the property address and owner's contact details", "Agent has directions / knows the route", "Agent is aware of any special circumstances (deceased estate, divorce, tenant-occupied, etc.)", "Agent has confirmed the appointment time with the seller"] },
      { title: "Final Check", items: ["All documents are in a professional folder / satchel", "Nothing is missing — do a final count of all items in the pack"] },
    ],
  },
  {
    slug: "pre-launch",
    title: "Pre-Launch Checklist",
    description: "Complete the listing setup and approvals before going live.",
    instruction: "Complete all items after the listing is signed and before the property goes live.",
    sections: [
      { title: "Form 6 & Paperwork", items: ["Signed Form 6 received from the agent", "Signed Form 6 sent to the seller (their copy for their records)", "Signed Form 6 sent to the admin team / office manager", "Signed Form 6 filed in the property's listing folder (digital & physical)"] },
      { title: "Photography & Trades", items: ["Professional photographer booked — date & time confirmed with seller", "Seller advised on presentation tips before the shoot (declutter, clean, style)", "Floor plan provider booked (if applicable)", "Videographer / drone operator booked (if applicable)", "Trades scheduled if needed (lawn mowing, window cleaning, minor repairs)", "All trades confirmed and completion date is before photo day"] },
      { title: "Listing Setup in Rex", items: ["Property created in Rex CRM with correct address and property details", "Ad text written — engaging, accurate, highlights key features", "Ad text checked for spelling and grammar", "Photos uploaded to Rex in the correct order (hero image first)", "Floor plan uploaded", "Price / price guide entered as per agent's instruction", "All listing fields populated (bedrooms, bathrooms, car spaces, land size, etc.)"] },
      { title: "Vendor Approval", items: ["Draft listing sent to vendor (seller) for review and approval", "Vendor has approved the ad text, photos, and price guide IN WRITING (email/text)", "Any requested changes have been made"] },
      { title: "Launch", items: ["Listing published on realestate.com.au", "Listing published on domain.com.au", "Listing published on agency website", "Social media post drafted and scheduled / posted", "Signboard ordered and installation date confirmed", "Just Listed flyer / DL card sent to print (if applicable)"] },
      { title: "Keys & Access", items: ["Keys collected from the seller", "Key location recorded in Rex (e.g., office key box, lockbox on site)", "Lockbox code noted if applicable", "Key tagged with property address"] },
    ],
  },
  {
    slug: "launch-open-home",
    title: "Launch / Open Home Checklist",
    description: "Prepare the documents, schedule, property and open-home pack.",
    instruction: "Complete all items when preparing for and running open homes.",
    sections: [
      { title: "Contract & Documentation", items: ["Blank contract of sale created (check with agent for any special conditions)", "Property brochures designed and printed", "Seller's Disclosure Statement (Form 2) — request sent to seller's solicitor", "Seller's Disclosure Statement received and reviewed", "Contract printed (minimum 5 copies for open home pack)", "Brochures printed (minimum 20 copies)"] },
      { title: "Open Home Schedule", items: ["Open home day and time confirmed with the agent", "Open home schedule created in Rex", "Open home time approved by the owners", "Open home listed on realestate.com.au and domain.com.au"] },
      { title: "Tenant Notification (if applicable)", items: ["Check if the property is tenant-occupied", "Entry Notice (Form 9) sent to tenants — minimum 24 hours' notice required", "Entry Notice includes correct date, time window, and reason (open inspection)", "Copy of Entry Notice saved in property file"] },
      { title: "Property Attributes Sheet", items: ["Property attributes sheet created (key facts about the property)", "Includes: bedrooms, bathrooms, car spaces, land size, build year, council rates, body corp fees", "Includes: school catchment, public transport, nearby amenities", "Includes: any recent renovations or special features", "MEMORISE the key attributes — you must be able to answer buyer questions on the spot"] },
      { title: "Open Home Pack — Assemble Before You Leave the Office", items: ["Blank contracts (5+ copies)", "Property brochures (20+ copies)", "Offer to purchase forms", "Agent's business cards (20+)", "Open home sign-in sheet or iPad for digital sign-in", "Property attributes sheet (for your reference)", "Directional signs / flags loaded in car", "Keys collected from office key box"] },
      { title: "At the Property — Before Buyers Arrive", items: ["Arrive 15 minutes early", "Unlock all doors and turn on all lights", "Open blinds and curtains for natural light", "Turn on air conditioning / fans (weather dependent)", "Set up directional signs on nearby streets", "Set up sign-in table at the front entry", "Walk through the property — check for anything out of place"] },
    ],
  },
  {
    slug: "post-open-home",
    title: "Post Open Home Checklist",
    description: "Close the property, follow up buyers and report results.",
    instruction: "Complete all items immediately after every open home.",
    sections: [
      { title: "At the Property — After Buyers Leave", items: ["Lock all doors and windows", "Turn off all lights and air conditioning", "Close blinds and curtains (as they were)", "Collect directional signs and flags", "Collect all materials (sign-in sheet, leftover brochures, etc.)"] },
      { title: "Back at the Office", items: ["Return keys to the office key box IMMEDIATELY", "Confirm keys are in the correct key box slot / tagged correctly"] },
      { title: "Buyer Follow-Up — Same Day, Do Not Delay", items: ["Enter all buyer details from sign-in sheet into Rex CRM", "Call every buyer who attended — record their feedback", "Log all feedback in Rex under the property listing", "Note any serious interest or offer indications — flag to lead agent immediately", "Send follow-up text or email to all attendees thanking them for coming"] },
      { title: "Report to Agent / Vendor", items: ["Prepare open home summary for the lead agent (number of groups, hot buyers, feedback themes)", "Agent to update the vendor with open home results"] },
    ],
  },
  {
    slug: "auction",
    title: "Auction Checklist",
    description: "Prepare documents, registration and auction-day follow-up.",
    instruction: "Complete all items when preparing for auction day.",
    sections: [
      { title: "Pre-Auction Preparation (1 Week Before)", items: ["Auction date, time, and location confirmed (on-site or in-rooms)", "Auctioneer booked and confirmed", "Auction listed on realestate.com.au and domain.com.au", "Vendor reserve price discussed and confirmed with lead agent"] },
      { title: "Documents — Print and Prepare", items: ["Blank contract of sale printed (minimum 3 copies)", "Seller's Disclosure Statement (Form 2) printed", "Bidder registration forms printed (minimum 20)", "Bid-on-behalf (proxy bidder) forms printed", "Auction terms and conditions printed (minimum 20 copies)", "Bidder paddles / numbered cards prepared", "Building and pest inspection reports printed (if available)", "Body corporate documents available (if applicable)"] },
      { title: "Auction Day Setup", items: ["Arrive at least 30 minutes before auction start", "Registration table set up with all forms, pens, and ID checking capability", "Bidder registration process ready — check ID (driver's licence or passport)", "Bidder paddles numbered and ready to hand out", "All printed documents laid out and accessible", "Auctioneer has copy of contract and reserve price details", "Agent has phone ready to call vendor if reserve needs adjusting during auction"] },
      { title: "Post-Auction (Sold at Auction)", items: ["Winning bidder signs the contract on the spot", "Deposit collected (usually 5-10%) — confirm payment method with agent", "Contract fully executed and copies distributed", "Proceed to Under Contract checklist (Section 6)"] },
      { title: "Post-Auction (Passed In)", items: ["Highest bidder given first right to negotiate", "Agent begins negotiation with interested parties", "All registered bidders followed up within 24 hours", "Update listing status as instructed by lead agent"] },
    ],
  },
  {
    slug: "under-contract",
    title: "Under Contract Checklist",
    description: "Manage signing, notifications, critical dates and conditions.",
    instruction: "Complete all items once a property is under contract.",
    sections: [
      { title: "Contract Creation", items: ["Receive buyer's full legal name(s) — exactly as they want on the contract", "Receive buyer's solicitor / conveyancer details (name, firm, phone, email)", "Receive seller's solicitor / conveyancer details (if not already on file)", "Create contract based on agreed conditions (price, settlement date, special conditions)", "Double-check ALL contract details with the lead agent before sending", "Lead agent approves the contract — do NOT send without their sign-off"] },
      { title: "DocuSign / Signing Process", items: ["Contract sent to BUYERS first via DocuSign for signature", "Buyers have signed — confirm all signatures and initials are complete", "Contract sent to SELLERS via DocuSign for signature", "Sellers have signed — contract is now fully executed"] },
      { title: "Notifications", items: ["\"Congratulations on your purchase\" email sent to the buyers", "\"Congratulations on your sale\" email sent to the sellers", "CC buyer's solicitor on the buyer's congratulations email", "CC seller's solicitor on the seller's congratulations email", "Fully executed contract sent to BOTH solicitors", "Office admin / accounts team notified of the sale and contract price"] },
      { title: "Diary Critical Dates", items: ["Finance approval date — diarise with a reminder 2 days before", "Building & pest condition date — diarise with a reminder 2 days before", "Any other special condition dates — diarise each one", "Settlement date — diarise with reminders at 14 days, 7 days, and 2 days before", "Set reminders in Rex CRM for each critical date"] },
      { title: "Condition Management", items: ["Track each contract condition — has it been satisfied, extended, or is there an issue?", "If a condition needs extending, notify the lead agent immediately", "If a condition may fail (e.g., finance issue), alert lead agent ASAP", "Get written confirmation when each condition is satisfied", "File all condition satisfaction notices in the property file"] },
      { title: "Listing Status", items: ["Keep listing showing as AVAILABLE on all portals until lead agent instructs otherwise", "Ensure website / portal overrides are on to keep property visible", "Only change to 'Under Contract' when lead agent confirms"] },
      { title: "Contract Price Changes", items: ["If contract price changes (e.g., B&P renegotiation), notify office admin / accounts immediately", "Update the contract price in Rex CRM", "Ensure amended contract is signed by all parties and sent to both solicitors"] },
    ],
  },
  {
    slug: "settlement",
    title: "Settlement Checklist",
    description: "Coordinate inspection, settlement, handover and closeout.",
    instruction: "Complete all items in the lead-up to and on settlement day.",
    sections: [
      { title: "Pre-Settlement (1-2 Weeks Before)", items: ["Schedule pre-settlement inspection with the buyer — date and time confirmed", "Notify the seller of the pre-settlement inspection date and time", "If tenant-occupied, send Entry Notice to tenant for the inspection", "Organise settlement gift for the buyer (check with agent on budget/preference)", "Settlement gift purchased / ordered and ready"] },
      { title: "Pre-Settlement Inspection", items: ["Meet the buyer at the property at the agreed time", "Walk through the property with the buyer — check everything is as per contract", "Check all inclusions are present (appliances, fixtures as listed in contract)", "Check property is in same condition as at contract signing (no new damage)", "Note any issues — report to lead agent immediately if something is wrong", "Buyer confirms they are satisfied with the property condition"] },
      { title: "Settlement Day", items: ["Confirm with buyer's solicitor that settlement has been COMPLETED", "Confirm with seller's solicitor that settlement has been COMPLETED", "DO NOT hand over keys until you have confirmation from BOTH solicitors"] },
      { title: "Key Handover", items: ["Organise key handover to the buyer (at the property or office — confirm preference)", "Hand over ALL keys, remotes, garage openers, security codes, etc.", "Have the buyer sign a key receipt if applicable", "Present the settlement gift"] },
      { title: "Post-Settlement Admin", items: ["Update listing status to SOLD in Rex CRM", "Arrange for SOLD sticker / sold sign to go on the property signboard", "Organise for signboard to be REMOVED within 1-2 weeks of settlement", "Create and post SOLD social media post — congratulate both buyer and seller", "Get approval from buyer and seller before tagging them in any social media post"] },
      { title: "Anniversary & Long-Term Follow-Up", items: ["Set up annual purchase anniversary reminder in Rex CRM for the buyer", "Set up annual sale anniversary reminder in Rex CRM for the seller", "This is your future listing pipeline — never skip this step"] },
      { title: "File Closeout", items: ["Ensure all documents are saved in the digital property file", "Physical file archived as per office procedure", "Commission split confirmed with accounts team", "Lead agent confirmed all tasks are complete"] },
    ],
  },
] as const satisfies readonly ListingChecklist[];

export function getListingChecklist(slug: string): ListingChecklist | undefined {
  return listingChecklists.find((checklist) => checklist.slug === slug);
}
