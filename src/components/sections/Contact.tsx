"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { getAttribution, track } from "@/lib/analytics";
import type { PrefillDetail } from "@/lib/events";
import { SplitLines, Reveal } from "../ui/Reveal";

export const BUSINESS_TYPES = ["Restaurant / café", "Bar / hospitality", "Retail store", "Hotel", "Office / corporate", "Property developer", "Gym / fitness", "Salon / barber", "Architect / interior designer", "Other"];
export const BUDGETS = ["Under £2,500", "£2,500 – £5,000", "£5,000 – £10,000", "£10,000 – £25,000", "£25,000+", "Not sure yet"];
const TIMELINES = ["As soon as possible", "Within 1 month", "1–3 months", "3–6 months", "Just planning"];
const MAX_FILE_MB = 10;

type Status = "idle" | "sending" | "done" | "error";

function Field({ id, label, required, children, error }: { id: string; label: string; required?: boolean; children: React.ReactNode; error?: string }) {
  return (
    <div className="relative">
      <label htmlFor={id} className="label block">
        {label} {required && <span className="text-blue" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && <p id={`${id}-err`} className="mt-1.5 text-xs text-[#ff8a8a]">{error}</p>}
    </div>
  );
}

function FileDrop({ name, label, multiple, accept }: { name: string; label: string; multiple?: boolean; accept: string }) {
  const [files, setFiles] = useState<string[]>([]);
  return (
    <label className="group flex cursor-pointer flex-col justify-between gap-6 border border-dashed border-line-strong p-5 transition-colors hover:border-blue focus-within:border-blue">
      <span className="label">{label}</span>
      <span className="text-sm text-muted">{files.length ? files.join(", ") : `Drop or browse · max ${MAX_FILE_MB}MB${multiple ? " each" : ""}`}</span>
      <input
        type="file" name={name} multiple={multiple} accept={accept} className="sr-only"
        onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))}
      />
    </label>
  );
}

export function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [firstName, setFirstName] = useState("");
  const pending = useRef<PrefillDetail | null>(null);

  const applyPrefill = (d: PrefillDetail) => {
    const f = form.current;
    if (!f) return false;
    const setVal = (n: string, v?: string) => {
      const el = f.elements.namedItem(n) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
      if (el && v) el.value = v;
    };
    setVal("signage", d.signage);
    setVal("budget", d.budget);
    setVal("businessType", d.businessType);
    setVal("location", d.location);
    setVal("message", d.message);
    return true;
  };

  // If the thank-you state was showing, apply the prefill once the form remounts.
  useEffect(() => {
    if (status === "idle" && pending.current && applyPrefill(pending.current)) pending.current = null;
  }, [status]);

  useEffect(() => {
    getAttribution();
    const onPrefill = (e: Event) => {
      const d = (e as CustomEvent<PrefillDetail>).detail;
      if (!applyPrefill(d)) pending.current = d;
      setStatus("idle");
    };
    window.addEventListener("signova:prefill", onPrefill);
    return () => window.removeEventListener("signova:prefill", onPrefill);
  }, []);

  const validate = (fd: FormData) => {
    const e: Record<string, string> = {};
    if (!String(fd.get("name") || "").trim()) e.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(String(fd.get("email") || ""))) e.email = "Please enter a valid email.";
    if (String(fd.get("phone") || "").replace(/\D/g, "").length < 10) e.phone = "Please enter a valid phone number.";
    if (!fd.get("signage")) e.signage = "Please choose an option.";
    if (!fd.get("consent")) e.consent = "Please confirm so we can contact you.";
    for (const f of [...fd.getAll("logo"), ...fd.getAll("photos")]) {
      if (f instanceof File && f.size > MAX_FILE_MB * 1024 * 1024) e.files = `Each file must be under ${MAX_FILE_MB}MB.`;
    }
    return e;
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = ev.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`);
      first?.focus();
      return;
    }
    fd.append("attribution", JSON.stringify(getAttribution()));
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", { method: "POST", body: fd });
      if (!res.ok) throw new Error(String(res.status));
      setFirstName(String(fd.get("name")).split(" ")[0]);
      setStatus("done");
      track("generate_lead", { form: "consultation", signage: String(fd.get("signage")), budget: String(fd.get("budget") || "") });
    } catch {
      setStatus("error");
    }
  };

  const err = (k: string) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${k}-err` } : {});

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line py-[clamp(6rem,14vw,12rem)]" aria-labelledby="contact-title">
      <div className="pointer-events-none absolute -right-[20vw] top-0 h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,var(--blue-soft),transparent_65%)]" />
      <div className="wrap relative grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal className="mb-8 flex items-center gap-4">
            <span className="label text-blue">09</span><span className="h-px w-12 bg-line-strong" /><span className="label">Consultation</span>
          </Reveal>
          <SplitLines lines={["Let's build", "something", "people", "remember."]} className="display text-[clamp(2.8rem,6.2vw,6rem)] metal-text" />
          <span id="contact-title" className="sr-only">Book a consultation</span>
          <Reveal delay={0.2} className="mt-10 space-y-6 text-muted">
            <p className="max-w-md text-lg leading-relaxed">Tell us about your space. A senior designer will review it and come back within one working day to arrange a site survey or video consultation.</p>
            <ul className="space-y-3 border-t border-line pt-6 text-fg">
              {["Free consultation, no obligation", "Design visuals before you commit", "Fixed, itemised quotation", "Planning & landlord consent support"].map((x) => (
                <li key={x} className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-blue" />{x}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-fg hover:text-blue">{site.phoneDisplay}</a>
              <a href={`mailto:${site.email}`} className="text-fg hover:text-blue">{site.email}</a>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {status === "done" ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="glass flex min-h-[600px] flex-col justify-center p-10 sm:p-16" role="status">
                <div className="mb-10 h-px w-24 bg-blue shadow-[0_0_20px_var(--blue)]" />
                <p className="display text-[clamp(2.2rem,4.5vw,4rem)]">Thank you. Your project is on its way.</p>
                <p className="mt-6 max-w-md text-lg text-muted">{firstName ? `${firstName}, our` : "Our"} studio team will be in touch within one working day. In the meantime, feel free to send more photos to {site.email}.</p>
                <button type="button" className="btn btn-ghost mt-10 self-start" onClick={() => { form.current?.reset(); setStatus("idle"); }}>Send another enquiry</button>
              </motion.div>
            ) : (
              <motion.form key="form" ref={form} onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass grid gap-x-8 gap-y-8 p-6 sm:grid-cols-2 sm:p-10">
                {/* Honeypot: real users never see or fill this */}
                <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                <Field id="name" label="Full name" required error={errors.name}><input id="name" name="name" autoComplete="name" className="field" {...err("name")} /></Field>
                <Field id="company" label="Company name"><input id="company" name="company" autoComplete="organization" className="field" /></Field>
                <Field id="email" label="Email" required error={errors.email}><input id="email" name="email" type="email" autoComplete="email" className="field" {...err("email")} /></Field>
                <Field id="phone" label="Phone" required error={errors.phone}><input id="phone" name="phone" type="tel" autoComplete="tel" className="field" {...err("phone")} /></Field>
                <Field id="businessType" label="Business type">
                  <select id="businessType" name="businessType" className="field" defaultValue=""><option value="">Select</option>{BUSINESS_TYPES.map((b) => <option key={b}>{b}</option>)}</select>
                </Field>
                <Field id="location" label="Project location"><input id="location" name="location" placeholder="Postcode or area" autoComplete="postal-code" className="field" /></Field>
                <Field id="signage" label="Signage required" required error={errors.signage}>
                  <select id="signage" name="signage" className="field" defaultValue="" {...err("signage")}><option value="">Select</option>{services.map((s) => <option key={s.id}>{s.title}</option>)}<option>Not sure yet</option></select>
                </Field>
                <Field id="budget" label="Approximate budget">
                  <select id="budget" name="budget" className="field" defaultValue=""><option value="">Select</option>{BUDGETS.map((b) => <option key={b}>{b}</option>)}</select>
                </Field>
                <Field id="timeline" label="Project timeline">
                  <select id="timeline" name="timeline" className="field" defaultValue=""><option value="">Select</option>{TIMELINES.map((b) => <option key={b}>{b}</option>)}</select>
                </Field>
                <div className="hidden sm:block" />
                <FileDrop name="logo" label="Upload logo" accept=".png,.jpg,.jpeg,.svg,.pdf,.ai,.eps" />
                <FileDrop name="photos" label="Upload photos of site" multiple accept="image/*" />
                {errors.files && <p className="text-xs text-[#ff8a8a] sm:col-span-2">{errors.files}</p>}
                <div className="sm:col-span-2">
                  <Field id="message" label="Additional information"><textarea id="message" name="message" rows={4} className="field resize-none" placeholder="Sizes, deadlines, landlord requirements, inspiration…" /></Field>
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-start gap-3 text-sm text-muted">
                    <input type="checkbox" name="consent" value="yes" className="mt-1 h-4 w-4 accent-[var(--blue)]" {...err("consent")} />
                    <span>I agree to SIGNOVA contacting me about this enquiry and processing my details in line with the <a href="/privacy" className="underline hover:text-fg">privacy policy</a>.</span>
                  </label>
                  {errors.consent && <p id="consent-err" className="mt-1.5 text-xs text-[#ff8a8a]">{errors.consent}</p>}
                </div>
                <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : <>Request my consultation <span className="arrow">→</span></>}
                  </button>
                  {status === "error" && <p role="alert" className="text-sm text-[#ff8a8a]">Something went wrong. Please call {site.phoneDisplay} or try again.</p>}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
