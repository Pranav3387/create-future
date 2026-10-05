/**
 * Analytics-ready event helper. Pushes to GTM's dataLayer and to gtag/Meta
 * Pixel if they are present, and only after the visitor has granted
 * analytics consent via the cookie banner.
 */
type Payload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export const CONSENT_KEY = "signova-consent";

export type Consent = { analytics: boolean; marketing: boolean };

export function getConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export function track(event: string, payload: Payload = {}) {
  if (typeof window === "undefined") return;
  const consent = getConsent();
  if (!consent?.analytics) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
  window.gtag?.("event", event, payload);
  if (consent.marketing && event === "generate_lead") window.fbq?.("track", "Lead", payload);
}

/** UTM / click IDs captured on landing so leads can be attributed to campaigns. */
export function getAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];
  const out: Record<string, string> = {};
  try {
    const stored = JSON.parse(sessionStorage.getItem("signova-attr") || "{}") as Record<string, string>;
    Object.assign(out, stored);
    const params = new URLSearchParams(window.location.search);
    for (const k of keys) {
      const v = params.get(k);
      if (v) out[k] = v.trim();
    }
    sessionStorage.setItem("signova-attr", JSON.stringify(out));
  } catch {
    /* storage unavailable */
  }
  out.landing_page = window.location.pathname;
  return out;
}
