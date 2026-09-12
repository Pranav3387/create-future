# create-future

Hello, I am Pranav Bhatia. I am currently studying BE Civil Engineering from Baroda PU.

## AURA — Product Launch Website

This repo contains a complete, ready-to-deploy product launch landing page for **AURA**, a concept
titanium smart ring with solar-assist charging, health tracking, and tap-to-pay. It's built as a
template: the goal is not just to market one product, but to show — on the page itself — exactly
how it would be manufactured, what it costs to build, what margin it carries, and the step-by-step
plan to run it as a real business.

### What's on the page

- **Hero** — product pitch, live countdown to a launch date, animated 3D ring visual.
- **Product** — feature breakdown (solar-assist charging, sensors, payments, materials).
- **How It's Made** — a real supply-chain walkthrough (ODM sourcing, MOQs, assembly, QC/certification, freight, fulfillment).
- **Cost & Pricing** — itemized landed cost per unit vs. retail/wholesale pricing and gross margin.
- **Run This Business** — a 16-week blueprint (validate → source → fund → scale) and 3 sales channels (D2C, marketplace, B2B).
- **FAQ** — including honest caveats about the "solar charging" claim and legal/certification requirements.
- **Waitlist form** — captures name + email locally in the browser (see below to wire it to a real backend).

No fabricated testimonials or fake press mentions are included — all numbers are clearly labeled as
planning estimates for a concept product.

### Run it locally

No build step or dependencies required — it's plain HTML/CSS/JS.

```bash
# from the repo root
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` directly in a browser.

### Deploy it (free options)

- **GitHub Pages**: Settings → Pages → Deploy from branch → root. Your site goes live at
  `https://<username>.github.io/create-future/`.
- **Netlify / Vercel**: drag-and-drop the repo folder or connect the GitHub repo — zero config needed
  since there's no build step.

### Making the waitlist form actually collect leads

Right now `js/main.js` saves signups to the visitor's own browser (`localStorage`) so the demo works
with zero backend. Before you launch for real, replace the `initReserveForm()` body in
`js/main.js` with a call to one of these (all have free tiers):

- [Formspree](https://formspree.io) — add `action="https://formspree.io/f/your-id"` to the form and drop the JS handler.
- Google Sheets via a small Apps Script web app.
- Mailchimp / ConvertKit signup API.

### Customizing for your own product

Everything specific to AURA lives in `index.html` (copy, numbers) and can be swapped section by
section: hero headline, feature cards, the manufacturing timeline, and the cost table under
`#cost`. The cost/pricing figures are illustrative — get real quotes from suppliers (Alibaba, 1688,
Global Sources) before committing capital to a production run.
