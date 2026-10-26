"use client";

import { Check, Plus, Printer, RotateCcw, Trash2, UserRound } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { generalOnboardingGroups, salesAdminGroups, salesAgentGroups, type ChecklistGroup } from "@/lib/onboarding-data";

type Role = "sales-agent" | "sales-admin";
type StaffChecklist = { readonly id: number; readonly name: string; readonly role: Role; readonly completed: readonly string[] };
const STORAGE_KEY = "ngu-onboarding-checklist-v2";

function isStaffChecklist(value: unknown): value is StaffChecklist {
  if (typeof value !== "object" || value === null) return false;
  if (!("id" in value) || !("name" in value) || !("role" in value) || !("completed" in value)) return false;
  return typeof value.id === "number" && typeof value.name === "string" && (value.role === "sales-agent" || value.role === "sales-admin") && Array.isArray(value.completed) && value.completed.every((item) => typeof item === "string");
}

function itemKey(scope: string, group: string, item: string): string { return `${scope}:${group}:${item}`; }

function ChecklistCard({ group, scope, completed, onToggle }: { readonly group: ChecklistGroup; readonly scope: string; readonly completed: readonly string[]; readonly onToggle: (key: string) => void }): ReactNode {
  const completeCount = group.items.filter((item) => completed.includes(itemKey(scope, group.title, item))).length;
  return <section className="onboarding-checklist-card"><div className="onboarding-card-heading"><div><h3>{group.title}</h3>{group.description && <p>{group.description}</p>}</div><span>{completeCount} / {group.items.length}</span></div><div>{group.items.map((item) => { const key = itemKey(scope, group.title, item); const checked = completed.includes(key); return <label className={checked ? "checked" : ""} key={item}><input type="checkbox" checked={checked} onChange={() => onToggle(key)} /><span><Check size={15} /></span><strong>{item}</strong></label>; })}</div></section>;
}

export function OnboardingChecklist(): ReactNode {
  const [staff, setStaff] = useState<readonly StaffChecklist[]>([{ id: 1, name: "New team member", role: "sales-agent", completed: [] }]);
  const [activeId, setActiveId] = useState(1);
  const hasLoaded = useRef(false);
  const activeStaff = staff.find((entry) => entry.id === activeId) ?? staff[0];

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
      const savedStaff = Array.isArray(saved) && saved.length > 0 && saved.every(isStaffChecklist) ? saved : null;
      const timer = window.setTimeout(() => { if (savedStaff) { setStaff(savedStaff); setActiveId(savedStaff[0].id); } hasLoaded.current = true; }, 0);
      return () => window.clearTimeout(timer);
    } catch { window.localStorage.removeItem(STORAGE_KEY); hasLoaded.current = true; }
  }, []);
  useEffect(() => { if (hasLoaded.current) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(staff)); }, [staff]);

  const roleGroups = activeStaff?.role === "sales-admin" ? salesAdminGroups : salesAgentGroups;
  const visibleKeys = useMemo(() => [...generalOnboardingGroups.flatMap((group) => group.items.map((item) => itemKey("general", group.title, item))), ...roleGroups.flatMap((group) => group.items.map((item) => itemKey(activeStaff?.role ?? "sales-agent", group.title, item)))], [activeStaff?.role, roleGroups]);
  if (!activeStaff) return null;

  const updateActive = (update: (entry: StaffChecklist) => StaffChecklist): void => setStaff((entries) => entries.map((entry) => entry.id === activeStaff.id ? update(entry) : entry));
  const addStaff = (): void => { const id = Math.max(0, ...staff.map((entry) => entry.id)) + 1; setStaff((entries) => [...entries, { id, name: `New team member ${id}`, role: "sales-agent", completed: [] }]); setActiveId(id); };
  const removeStaff = (): void => { if (staff.length === 1) { updateActive(() => ({ id: 1, name: "New team member", role: "sales-agent", completed: [] })); return; } const remaining = staff.filter((entry) => entry.id !== activeStaff.id); setStaff(remaining); setActiveId(remaining[0]?.id ?? 1); };
  const toggle = (key: string): void => updateActive((entry) => ({ ...entry, completed: entry.completed.includes(key) ? entry.completed.filter((value) => value !== key) : [...entry.completed, key] }));
  const visibleComplete = visibleKeys.filter((key) => activeStaff.completed.includes(key)).length;
  const print = (): void => { document.body.classList.add("print-onboarding"); window.addEventListener("afterprint", () => document.body.classList.remove("print-onboarding"), { once: true }); window.print(); };

  return <section className="onboarding-checklist" aria-labelledby="onboarding-heading">
    <div className="checklist-heading"><div><p className="eyebrow">YOUR ONBOARDING CHECKLIST</p><h2 id="onboarding-heading">One clear path into NGU.</h2><p>Complete the core setup, Form 6 learning and the pathway for this team member.</p></div><div className="checklist-actions"><button type="button" onClick={addStaff}><Plus size={16} /> Add staff</button><button type="button" onClick={() => updateActive((entry) => ({ ...entry, completed: [] }))}><RotateCcw size={16} /> Clear</button><button type="button" onClick={print}><Printer size={16} /> Print / save PDF</button></div></div>
    <div className="staff-tabs" role="tablist" aria-label="Team members">{staff.map((entry) => <button type="button" role="tab" aria-selected={entry.id === activeStaff.id} className={entry.id === activeStaff.id ? "active" : ""} onClick={() => setActiveId(entry.id)} key={entry.id}><UserRound size={15} /> {entry.name}</button>)}</div>
    <div className="checklist-person"><label htmlFor="staff-name">Team member</label><input id="staff-name" value={activeStaff.name} onChange={(event) => updateActive((entry) => ({ ...entry, name: event.target.value }))} /><div className="checklist-progress" aria-hidden="true"><span style={{ width: `${(visibleComplete / visibleKeys.length) * 100}%` }} /></div><strong>{visibleComplete} / {visibleKeys.length}</strong><button type="button" onClick={removeStaff} aria-label={`Remove ${activeStaff.name}`}><Trash2 size={16} /></button></div>
    <div className="onboarding-general-grid">{generalOnboardingGroups.map((group) => <ChecklistCard key={group.title} group={group} scope="general" completed={activeStaff.completed} onToggle={toggle} />)}</div>
    <section className="onboarding-form-six"><div><p className="eyebrow">TO COMPLETE A FORM 6</p><h2>Start with the right process.</h2><p>Watch the tutorial to understand how NGU completes a Form 6, and why it is important.</p></div><iframe src="https://drive.google.com/file/d/1s5EN21opIJhJAMr_Lv3G6erHobP9Beew/preview" title="How to complete a Form 6" allow="autoplay" /></section>
    <div className="onboarding-role-heading"><div><p className="eyebrow">CHOOSE A PATHWAY</p><h2>Role-specific onboarding.</h2></div><div className="role-checklist-tabs" role="tablist" aria-label="Onboarding role"><button type="button" role="tab" aria-selected={activeStaff.role === "sales-agent"} className={activeStaff.role === "sales-agent" ? "active" : ""} onClick={() => updateActive((entry) => ({ ...entry, role: "sales-agent" }))}>Sales Agent</button><button type="button" role="tab" aria-selected={activeStaff.role === "sales-admin"} className={activeStaff.role === "sales-admin" ? "active" : ""} onClick={() => updateActive((entry) => ({ ...entry, role: "sales-admin" }))}>Sales Admin</button></div></div>
    <div className={`onboarding-role-grid onboarding-role-grid-${activeStaff.role}`}>{roleGroups.map((group) => <ChecklistCard key={group.title} group={group} scope={activeStaff.role} completed={activeStaff.completed} onToggle={toggle} />)}</div>
  </section>;
}
