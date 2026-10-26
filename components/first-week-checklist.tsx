"use client";

import { Check, Printer, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { firstWeekStages } from "@/lib/onboarding-data";

const STORAGE_KEY = "ngu-first-week-checklist-v1";

export function FirstWeekChecklist(): ReactNode {
  const [completed, setCompleted] = useState<readonly string[]>([]);
  const hasLoaded = useRef(false);
  const itemIds = useMemo(() => firstWeekStages.flatMap((stage, stageIndex) => stage.items.map((_, itemIndex) => `${stageIndex}-${itemIndex}`)), []);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
      const savedItems = Array.isArray(saved) && saved.every((value) => typeof value === "string") ? saved : [];
      const timer = window.setTimeout(() => { setCompleted(savedItems); hasLoaded.current = true; }, 0);
      return () => window.clearTimeout(timer);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      hasLoaded.current = true;
    }
  }, []);

  useEffect(() => { if (hasLoaded.current) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed)); }, [completed]);

  const toggle = (id: string): void => setCompleted((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const print = (): void => {
    document.body.classList.add("print-first-week");
    window.addEventListener("afterprint", () => document.body.classList.remove("print-first-week"), { once: true });
    window.print();
  };

  return (
    <section className="first-week-checklist" aria-labelledby="first-week-heading">
      <div className="first-week-inner">
        <div className="first-week-heading">
          <div><p className="eyebrow">02 / START HERE</p><h2 id="first-week-heading">Your first seven days.</h2><p>Use this simple checklist to get connected, set up and ready to work the NGU way.</p></div>
          <div className="first-week-actions"><button type="button" onClick={() => setCompleted([])}><RotateCcw size={16} /> Reset</button><button type="button" onClick={print}><Printer size={16} /> Print / save PDF</button></div>
        </div>
        <div className="first-week-progress"><span>{completed.length} / {itemIds.length} complete</span><div><i style={{ width: `${(completed.length / itemIds.length) * 100}%` }} /></div></div>
        <div className="first-week-grid">
          {firstWeekStages.map((stage, stageIndex) => <section key={stage.title}><span>{String(stageIndex + 1).padStart(2, "0")}</span><h3>{stage.title}</h3><p>{stage.description}</p><div>{stage.items.map((item, itemIndex) => { const id = `${stageIndex}-${itemIndex}`; const checked = completed.includes(id); return <label className={checked ? "checked" : ""} key={item}><input type="checkbox" checked={checked} onChange={() => toggle(id)} /><span><Check size={15} /></span><strong>{item}</strong></label>; })}</div></section>)}
        </div>
      </div>
    </section>
  );
}
