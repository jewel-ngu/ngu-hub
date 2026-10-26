"use client";

import { Check, RotateCcw, Printer } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { ListingChecklistSection } from "@/lib/listing-checklists";

type StageChecklistProps = {
  readonly title: string;
  readonly instruction: string;
  readonly sections: readonly ListingChecklistSection[];
  readonly storageKey: string;
};

export function StageChecklist({ title, instruction, sections, storageKey }: StageChecklistProps): ReactNode {
  const items = sections.flatMap((section) => section.items);
  const [checked, setChecked] = useState<readonly boolean[]>(() => items.map(() => false));
  const loaded = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === items.length && parsed.every((value) => typeof value === "boolean")) setChecked(parsed);
        } catch {
          window.localStorage.removeItem(storageKey);
        }
      }
      loaded.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, [items.length, storageKey]);

  useEffect(() => {
    if (loaded.current) window.localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, storageKey]);

  const completed = checked.filter(Boolean).length;
  const progress = Math.round((completed / items.length) * 100);

  return (
    <section className="stage-checklist">
      <div className="stage-checklist-heading">
        <div><p className="eyebrow">AGENT LISTING CHECKLIST</p><h2>{title}</h2><p>{instruction} Your progress is saved on this device.</p></div>
        <div className="stage-progress"><strong>{completed}/{items.length}</strong><span>complete</span></div>
      </div>
      <div className="stage-progress-bar" aria-label={`${progress}% complete`}><span style={{ width: `${progress}%` }} /></div>
      <div className="stage-checklist-groups">
        {sections.map((section, sectionIndex) => {
          const offset = sections.slice(0, sectionIndex).reduce((total, current) => total + current.items.length, 0);
          return (
            <section className="stage-checklist-group" key={section.title}>
              <h3>{section.title}</h3>
              <div className="stage-checklist-grid">
                {section.items.map((item, itemIndex) => {
                  const index = offset + itemIndex;
                  return (
                    <label className={checked[index] ? "complete" : ""} key={item}>
                      <input type="checkbox" checked={checked[index] ?? false} onChange={() => setChecked((current) => current.map((value, currentIndex) => currentIndex === index ? !value : value))} />
                      <span><Check size={17} /></span><strong>{item}</strong>
                    </label>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      <div className="stage-checklist-actions">
        <button type="button" onClick={() => setChecked(items.map(() => false))}><RotateCcw size={16} /> Clear</button>
        <button type="button" onClick={() => window.print()}><Printer size={16} /> Print / save PDF</button>
      </div>
    </section>
  );
}
