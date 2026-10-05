"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CONSENT_KEY, getConsent, type Consent } from "@/lib/analytics";

/**
 * Minimal, non-blocking consent controls (UK GDPR / PECR). Analytics and
 * marketing tags should only load after consent: see <Analytics />.
 */
export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [custom, setCustom] = useState(false);
  const [prefs, setPrefs] = useState<Consent>({ analytics: false, marketing: false });

  useEffect(() => {
    if (!getConsent()) setTimeout(() => setShow(true), 2500);
    const reopen = () => { setCustom(true); setShow(true); };
    window.addEventListener("signova:cookies", reopen);
    return () => window.removeEventListener("signova:cookies", reopen);
  }, []);

  const save = (c: Consent) => {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(c)); } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent("signova:consent", { detail: c }));
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="region"
          aria-label="Cookie preferences"
          className="glass fixed bottom-20 left-4 right-4 z-50 max-w-md p-5 !bg-[color-mix(in_srgb,var(--bg)_90%,transparent)] sm:bottom-8 sm:left-28 sm:right-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="label mb-2 !text-fg">Cookies</p>
          <p className="text-sm leading-relaxed text-muted">We use essential cookies to run this site and, with your permission, analytics to improve it. <a href="/privacy" className="underline hover:text-fg">Privacy policy</a></p>
          {custom && (
            <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              {(["analytics", "marketing"] as const).map((k) => (
                <label key={k} className="flex items-center justify-between gap-4 capitalize">
                  {k}
                  <input type="checkbox" checked={prefs[k]} onChange={(e) => setPrefs((p) => ({ ...p, [k]: e.target.checked }))} className="h-4 w-4 accent-[var(--blue)]" />
                </label>
              ))}
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary !px-4 !py-2.5" onClick={() => save({ analytics: true, marketing: true })}>Accept all</button>
            <button type="button" className="btn btn-ghost !px-4 !py-2.5" onClick={() => save({ analytics: false, marketing: false })}>Reject</button>
            <button type="button" className="btn btn-ghost !px-4 !py-2.5" onClick={() => (custom ? save(prefs) : setCustom(true))}>{custom ? "Save" : "Manage"}</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
