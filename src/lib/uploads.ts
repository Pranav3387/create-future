/** Shared upload rules for the browser, the token route and the lead route. */
export const MAX_UPLOAD_MB = 25;
export const MAX_PHOTOS = 10;
export const ALLOWED_EXT = /\.(png|jpe?g|webp|heic|heif|gif|svg|pdf|ai|eps)$/i;

export type UploadedFile = { field: "logo" | "photos"; name: string; url: string; size: number; type: string };

/** Only accept public Vercel Blob links under leads/, so the form can't be used to inject arbitrary URLs. */
export function isBlobUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.endsWith(".public.blob.vercel-storage.com") && u.pathname.startsWith("/leads/");
  } catch {
    return false;
  }
}
