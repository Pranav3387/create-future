# SIGNOVA: We Build What Gets Noticed.

Premium website for SIGNOVA, a London architectural signage studio.
Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion**.

```bash
npm install
cp .env.example .env.local   # add integration keys
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## What's inside

| Section | File |
| --- | --- |
| Sticky nav + full-screen mobile menu, dark/light toggle | `src/components/Nav.tsx` |
| Cinematic hero: drifting camera, pointer parallax, perspective grid, light particles | `sections/Hero.tsx`, `scenes/HeroScene.tsx`, `ui/Particles.tsx` |
| 8 interactive service cards | `sections/Services.tsx` |
| Pinned horizontal-scroll portfolio (native swipe on mobile) | `sections/Work.tsx` |
| Before / after slider (mouse, touch, keyboard) | `sections/BeforeAfter.tsx` |
| Materials Lab with 3D swatches | `sections/MaterialsLab.tsx` |
| 5-step scroll-animated process | `sections/Process.tsx` |
| "Build your sign" configurator with live 3D preview | `sections/Configurator.tsx` |
| Stats, client logo wall, testimonials | `sections/Trust.tsx`, `sections/Testimonials.tsx` |
| Interactive London coverage map + click-to-load Google Map | `sections/Coverage.tsx` |
| Consultation form with uploads → `/api/lead` | `sections/Contact.tsx`, `app/api/lead/route.ts` |
| AI Signage Consultant (7-question chat → project summary) | `Consultant.tsx`, `lib/estimate.ts` |
| WhatsApp button, cookie controls, consent-gated analytics | `WhatsApp.tsx`, `CookieBanner.tsx`, `Analytics.tsx` |
| SEO: metadata, Open Graph image, LocalBusiness schema, sitemap, robots | `app/layout.tsx`, `app/opengraph-image.tsx`, `app/sitemap.ts` |

All copy and data live in `src/content/`, typed and shaped for a headless CMS.
`getProjects()` in `content/projects.ts` is the single place to swap in Sanity, Contentful or Payload.

## Lead integrations

`/api/lead` sends every enquiry to **every integration you configure** in `.env.local`:

- **Email** (Resend) with links to the uploaded logo/photos: `RESEND_API_KEY`, `LEAD_EMAIL_TO`
- **CRM** via Zapier / Make / n8n webhook: `LEAD_WEBHOOK_URL`
- **Google Sheets**: deploy `docs/google-sheets-apps-script.js`, set `GOOGLE_SHEETS_WEBHOOK_URL`
- **HubSpot** Forms API: `HUBSPOT_PORTAL_ID`, `HUBSPOT_FORM_GUID`
- **WhatsApp** Cloud API notification to the studio: `WHATSAPP_*`. Meta only allows free-form messages inside a 24-hour window, so for always-on alerts switch the payload to an approved template.

**File uploads** go from the browser straight to **Vercel Blob** (`/api/upload` issues short-lived upload tokens), which avoids Vercel's 4.5MB request limit. Limits: 25MB per file, 1 logo + up to 10 photos, images/PDF/AI/EPS only. To enable, go to **Vercel → Storage → Create → Blob** and connect the store to this project; Vercel sets `BLOB_READ_WRITE_TOKEN` for you. Uploaded files get long random URLs, but anyone with a link can open the file, so only share leads internally. Without Blob (e.g. locally), files are sent with the form and attached to the email instead.

Each lead includes UTM / `fbclid` / `gclid` attribution captured on landing. In production, if no integration delivers, the API returns an error rather than silently dropping the lead. The form has a honeypot and basic rate limiting.

## The AI Signage Consultant

The consultant is a guided conversation backed by a **transparent rule-based estimator** (`src/lib/estimate.ts`), so every figure can be explained and nothing is invented. Ranges are labelled as indicative, never as quotes. **Tune `BASE`, `SIZE` and the multipliers to SIGNOVA's real pricing before launch.**

## Before launch checklist

- [ ] **Photography**: scenes are illustrated SVG placeholders. Add real project photos to `/public/images/…` and set `image` on items in `content/projects.ts` and `content/services.ts`.
- [ ] **Contact details**: phone, WhatsApp number, email and socials in `content/site.ts`.
- [ ] **Statistics**: set `verified: true` in `content/site.ts` only for figures you can prove. Unverified stats are flagged in dev and **hidden in production**.
- [ ] **Testimonials & client logos**: `content/testimonials.ts` holds placeholders. Publishing invented reviews is illegal in the UK (DMCC Act 2024), so replace them with real, permitted reviews.
- [ ] **Projects**: placeholder names in `content/projects.ts` must be replaced with real work.
- [ ] **Pricing** in `lib/estimate.ts`.
- [ ] **Privacy policy & terms**: templates in `app/privacy` and `app/terms` need a legal review.
- [ ] Analytics IDs (`NEXT_PUBLIC_GTM_ID` / `GA_ID` / `META_PIXEL_ID`). These only load after cookie consent.
- [ ] `NEXT_PUBLIC_SITE_URL` for canonical URLs, Open Graph and schema.

## Deploy

Works out of the box on Vercel (import the repo, add the env vars). Any Node 20+ host running `npm run build && npm start` also works.
