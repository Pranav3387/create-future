"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { QUESTIONS, summarise, type Answers, type Summary } from "@/lib/estimate";
import { prefillContact } from "@/lib/events";
import { track } from "@/lib/analytics";
import { BUDGETS } from "./sections/Contact";
import { services } from "@/content/services";

const ease = [0.16, 1, 0.3, 1] as const;
type Msg = { from: "bot" | "user"; text: string };

const signageToService: Record<string, string> = {
  "3D lettering": "3D Lettering", "Illuminated / LED": "LED & Illuminated Signage", Neon: "Neon", "Shopfront fascia": "Shopfront Signage",
  Wayfinding: "Wayfinding", "Vehicle graphics": "Vehicle Graphics", "Window graphics": "Window Graphics", "Complete branding": "Complete Branding",
};
const businessToType: Record<string, string> = {
  "Restaurant / café": "Restaurant / café", "Retail store": "Retail store", Hotel: "Hotel", "Office / corporate": "Office / corporate",
  "Gym / fitness": "Gym / fitness", "Salon / barber": "Salon / barber", "Property developer": "Property developer", Other: "Other",
};

export function Consultant() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [input, setInput] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  const botSay = (text: string, delay = 700) =>
    new Promise<void>((res) => {
      setTyping(true);
      setTimeout(() => { setTyping(false); setMsgs((m) => [...m, { from: "bot", text }]); res(); }, delay);
    });

  const start = async () => {
    setMsgs([]); setAnswers({}); setStep(0); setSummary(null);
    await botSay("Hello, I'm the SIGNOVA signage consultant. Answer seven quick questions and I'll put together an indicative project summary.", 500);
    await botSay(QUESTIONS[0].q, 600);
  };

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("signova:consultant", onOpen);
    return () => window.removeEventListener("signova:consultant", onOpen);
  }, []);

  useEffect(() => {
    if (open && msgs.length === 0) { start(); track("consultant_open"); }
    if (open) setTimeout(() => panel.current?.querySelector<HTMLElement>("button, input")?.focus(), 400);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && open) { setOpen(false); opener.current?.focus(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" }); }, [msgs, typing, summary]);

  const answer = async (value: string) => {
    const v = value.trim();
    if (!v || typing || summary) return;
    const q = QUESTIONS[step];
    const next = { ...answers, [q.key]: v };
    setAnswers(next);
    setMsgs((m) => [...m, { from: "user", text: v }]);
    setInput("");
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
      await botSay(QUESTIONS[step + 1].q);
    } else {
      setStep(QUESTIONS.length);
      await botSay("Thank you. Analysing your requirements…", 600);
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        const s = summarise(next as Answers);
        setSummary(s);
        track("consultant_complete", { signage: next.signage ?? "", low: s.low, high: s.high });
      }, 1200);
    }
  };

  const q = QUESTIONS[step];

  const book = () => {
    if (!summary) return;
    const a = answers as Answers;
    prefillContact({
      signage: signageToService[a.signage] ?? (services.some((s) => s.title === a.signage) ? a.signage : "Not sure yet"),
      businessType: businessToType[a.business],
      location: a.location,
      budget: BUDGETS.includes(a.budget) ? a.budget : undefined,
      message: `AI consultant summary\n• Recommended: ${summary.recommendation}\n• Indicative range: ${summary.range}\n• Size: ${a.size} · ${a.illuminated} · Logo: ${a.logo}`,
    });
    setOpen(false);
  };

  return (
    <>
      <motion.button
        ref={opener}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Open AI Signage Consultant"
        aria-expanded={open}
        className="glass group fixed bottom-5 right-5 z-40 flex items-center gap-3 p-2 text-fg sm:py-3 sm:pl-4 sm:pr-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,.8)] transition-colors hover:border-blue sm:bottom-8 sm:right-8"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: open ? 100 : 0, opacity: open ? 0 : 1 }}
        transition={{ duration: 0.8, ease, delay: open ? 0 : 1.5 }}
      >
        <span className="relative grid h-8 w-8 place-items-center bg-blue text-white" title="AI Signage Consultant">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></svg>
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#4ade80] ring-2 ring-[var(--bg)]" />
        </span>
        <span className="label hidden !text-[0.65rem] !text-fg sm:inline">AI Signage Consultant</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label="AI Signage Consultant"
              className="glass fixed inset-x-0 bottom-0 z-[61] flex h-[92svh] flex-col !bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] sm:inset-x-auto sm:bottom-8 sm:right-8 sm:h-[min(760px,calc(100svh-4rem))] sm:w-[440px]"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ duration: 0.6, ease }}
            >
              <header className="flex items-center justify-between border-b border-line px-5 py-4">
                <div>
                  <p className="display text-base tracking-[0.1em]">AI Signage Consultant</p>
                  <p className="label mt-1 !text-[0.6rem]">
                    {summary ? "Summary ready" : `Question ${Math.min(step + 1, QUESTIONS.length)} of ${QUESTIONS.length}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={start} className="label border border-line px-3 py-2 !text-[0.6rem] hover:border-line-strong">Restart</button>
                  <button type="button" onClick={() => { setOpen(false); opener.current?.focus(); }} aria-label="Close consultant" className="grid h-9 w-9 place-items-center border border-line hover:border-line-strong">✕</button>
                </div>
              </header>
              <div className="h-px bg-line"><motion.div className="h-px bg-blue" animate={{ width: `${(Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100}%` }} transition={{ duration: 0.6, ease }} /></div>

              <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto px-5 py-6" aria-live="polite">
                {msgs.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className={`flex ${m.from === "user" ? "justify-end" : ""}`}>
                    <p className={`max-w-[85%] px-4 py-3 text-[0.94rem] leading-relaxed ${m.from === "user" ? "bg-fg text-bg" : "border border-line bg-surface/60"}`}>{m.text}</p>
                  </motion.div>
                ))}
                {typing && (
                  <div className="flex gap-1.5 px-1 py-2" aria-label="Consultant is typing">
                    {[0, 1, 2].map((i) => <motion.span key={i} className="h-1.5 w-1.5 bg-blue" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} />)}
                  </div>
                )}

                {summary && (
                  <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="border border-blue/40 bg-[var(--blue-soft)]">
                    <div className="border-b border-line px-5 py-4"><p className="label !text-blue">Project summary</p></div>
                    <dl className="divide-y divide-line text-[0.92rem]">
                      <div className="px-5 py-4"><dt className="label mb-1.5">Recommended signage</dt><dd>{summary.recommendation}</dd></div>
                      <div className="px-5 py-4">
                        <dt className="label mb-1.5">Estimated project range</dt>
                        <dd className="display text-2xl">{summary.range}</dd>
                        {summary.budgetNote && <dd className="mt-2 text-muted">{summary.budgetNote}</dd>}
                      </div>
                      <div className="px-5 py-4"><dt className="label mb-1.5">Recommended materials</dt><dd><ul className="space-y-1">{summary.materials.map((m) => <li key={m}>— {m}</li>)}</ul></dd></div>
                      <div className="px-5 py-4"><dt className="label mb-1.5">Installation considerations</dt><dd><ul className="space-y-1.5 text-muted">{summary.installation.map((m) => <li key={m}>— {m}</li>)}</ul></dd></div>
                      <div className="px-5 py-4"><dt className="label mb-1.5">Suggested next step</dt><dd>{summary.nextStep}</dd></div>
                    </dl>
                    <p className="border-t border-line px-5 py-3 text-xs leading-relaxed text-muted">
                      This is an indicative estimate for planning purposes only, not a quotation. Final pricing depends on survey, artwork, materials, access and consents.
                    </p>
                  </motion.article>
                )}
              </div>

              <footer className="border-t border-line p-4">
                {summary ? (
                  <button type="button" onClick={book} className="btn btn-primary w-full">Book my consultation <span className="arrow">→</span></button>
                ) : q?.options ? (
                  <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto">
                    {q.options.map((o) => (
                      <button key={o} type="button" disabled={typing} onClick={() => answer(o)} className="border border-line px-3 py-2 text-sm transition-colors hover:border-blue hover:text-blue disabled:opacity-40">{o}</button>
                    ))}
                  </div>
                ) : q ? (
                  <form onSubmit={(e) => { e.preventDefault(); answer(input); }} className="flex gap-2">
                    <label htmlFor="consultant-input" className="sr-only">{q.q}</label>
                    <input id="consultant-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={q.placeholder} className="field flex-1 !border !border-line !px-3" autoComplete="off" />
                    <button type="submit" className="btn btn-primary !px-5" disabled={typing || !input.trim()} aria-label="Send">→</button>
                  </form>
                ) : null}
              </footer>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
