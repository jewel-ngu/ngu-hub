"use client";

import { Check, Plus, Printer, RotateCcw, Trash2, UserRound } from "lucide-react";
import { useState, type ReactNode } from "react";

const checklistGroups = [
  {
    title: "NGU Profile",
    note: "All positions are added per contract. Any changes must be approved by the CEO.",
    items: ["Employment Agreement (Contract)", "Staff Details Form", "TFN Declaration", "Headshots (taken after Induction)", "Staff Profile on Website", "Bio on Website", "Contact Details for Contact List", "Social Media Pages Rebranded to NGU", "Set Up NGU Email Address"],
  },
  {
    title: "Office Set-Up",
    items: ["Registration / Licence saved to CPD Tracker", "Registration / Licence printed and filed at Admin's Desk", "Calendar Reminder for Licence Renewal", "Attend Induction at HQ", "Set Up Printer", "Basecamp Training", "Social Media Training", "Add to Internal Chat", "Cost of Purchasing Equipment", "Request Fob (if needed)"],
  },
  {
    title: "Software — Sales Team",
    items: ["REA", "Domain", "DocuSign", "Rex", "Homepass", "Realworks", "PriceFinder", "RP Data", "RealHub", "Basecamp"],
  },
] as const;

const allItems = checklistGroups.flatMap((group) => group.items);

type StaffChecklist = {
  readonly id: number;
  readonly name: string;
  readonly completed: readonly string[];
};

export function OnboardingChecklist(): ReactNode {
  const [staff, setStaff] = useState<readonly StaffChecklist[]>([{ id: 1, name: "New team member", completed: [] }]);
  const [activeId, setActiveId] = useState(1);
  const activeStaff = staff.find((entry) => entry.id === activeId) ?? staff[0];

  if (!activeStaff) {
    return null;
  }

  const updateActive = (update: (entry: StaffChecklist) => StaffChecklist): void => {
    setStaff((entries) => entries.map((entry) => entry.id === activeStaff.id ? update(entry) : entry));
  };

  const addStaff = (): void => {
    const id = Math.max(0, ...staff.map((entry) => entry.id)) + 1;
    setStaff((entries) => [...entries, { id, name: `New team member ${id}`, completed: [] }]);
    setActiveId(id);
  };

  const removeStaff = (): void => {
    if (staff.length === 1) {
      updateActive((entry) => ({ ...entry, name: "New team member", completed: [] }));
      return;
    }

    const remaining = staff.filter((entry) => entry.id !== activeStaff.id);
    setStaff(remaining);
    setActiveId(remaining[0]?.id ?? 1);
  };

  const toggleItem = (item: string): void => {
    updateActive((entry) => ({
      ...entry,
      completed: entry.completed.includes(item) ? entry.completed.filter((value) => value !== item) : [...entry.completed, item],
    }));
  };

  const completedCount = activeStaff.completed.length;
  const completion = Math.round((completedCount / allItems.length) * 100);

  return (
    <section className="onboarding-checklist" aria-labelledby="onboarding-heading">
      <div className="checklist-heading">
        <div><p className="eyebrow">YOUR ONBOARDING CHECKLIST</p><h2 id="onboarding-heading">One clear path into NGU.</h2><p>Complete every section for each new team member.</p></div>
        <div className="checklist-actions">
          <button type="button" onClick={addStaff}><Plus size={16} /> Add staff</button>
          <button type="button" onClick={() => updateActive((entry) => ({ ...entry, completed: [] }))}><RotateCcw size={16} /> Clear</button>
          <button type="button" onClick={() => window.print()}><Printer size={16} /> Export / print PDF</button>
        </div>
      </div>

      <div className="staff-tabs" aria-label="Team members">
        {staff.map((entry) => <button type="button" className={entry.id === activeStaff.id ? "active" : ""} onClick={() => setActiveId(entry.id)} key={entry.id}><UserRound size={16} /> {entry.name}</button>)}
      </div>

      <div className="checklist-person">
        <label htmlFor="staff-name">Team member</label>
        <input id="staff-name" value={activeStaff.name} onChange={(event) => updateActive((entry) => ({ ...entry, name: event.target.value }))} />
        <div className="checklist-progress"><span style={{ width: `${completion}%` }} /></div>
        <strong>{completedCount} of {allItems.length} complete</strong>
        <button type="button" onClick={removeStaff} aria-label={`Remove ${activeStaff.name}`}><Trash2 size={17} /> Remove</button>
      </div>

      <div className="checklist-groups">
        {checklistGroups.map((group) => (
          <section key={group.title}>
            <h3>{group.title}</h3>
            {"note" in group && <p>{group.note}</p>}
            <div>
              {group.items.map((item) => {
                const checked = activeStaff.completed.includes(item);
                return <label className={checked ? "checked" : ""} key={item}><input type="checkbox" checked={checked} onChange={() => toggleItem(item)} /><span><Check size={15} /></span>{item}</label>;
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
