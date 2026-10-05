/** Tiny cross-component event bus so sections can talk without prop drilling. */
export type PrefillDetail = { signage?: string; message?: string; budget?: string; businessType?: string; location?: string };

export const openConsultant = () => window.dispatchEvent(new CustomEvent("signova:consultant"));

export function prefillContact(detail: PrefillDetail) {
  window.dispatchEvent(new CustomEvent<PrefillDetail>("signova:prefill", { detail }));
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}
