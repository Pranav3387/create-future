import { NextResponse } from "next/server";

/**
 * Consultation lead handler.
 *
 * Fans each enquiry out to whichever integrations are configured via env vars
 * (see .env.example). Any number can be enabled at once:
 *   - Email (Resend) with logo/photo attachments
 *   - Generic webhook: Zapier / Make / n8n → any CRM
 *   - Google Sheets (Apps Script web-app URL)
 *   - HubSpot Forms API
 *   - WhatsApp Cloud API notification to the studio
 */

export const runtime = "nodejs";

const MAX_FILE = 10 * 1024 * 1024;
const MAX_TOTAL = 25 * 1024 * 1024;

type Lead = {
  name: string; company: string; email: string; phone: string; businessType: string; location: string;
  signage: string; budget: string; timeline: string; message: string; attribution: Record<string, string>;
  submittedAt: string; files: { name: string; type: string; size: number }[];
};

const str = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? "").trim().slice(0, max);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Best-effort in-memory rate limit (per instance). Use a shared store (Upstash/Redis) at scale.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

async function sendEmail(lead: Lead, files: File[]) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL_TO;
  if (!key || !to) return null;
  const attachments = await Promise.all(files.map(async (f) => ({ filename: f.name, content: Buffer.from(await f.arrayBuffer()).toString("base64") })));
  const rows = Object.entries({ Name: lead.name, Company: lead.company, Email: lead.email, Phone: lead.phone, "Business type": lead.businessType, Location: lead.location, Signage: lead.signage, Budget: lead.budget, Timeline: lead.timeline })
    .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#666">${k}</td><td style="padding:6px 0">${esc(v || "—")}</td></tr>`).join("");
  const html = `<h2 style="font-family:sans-serif">New consultation request</h2><table style="font-family:sans-serif;font-size:14px">${rows}</table><p style="font-family:sans-serif;white-space:pre-wrap">${esc(lead.message)}</p><p style="font-family:monospace;font-size:12px;color:#888">${esc(JSON.stringify(lead.attribution))}</p>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.LEAD_EMAIL_FROM ?? "SIGNOVA Website <leads@signova.co.uk>",
      to: to.split(",").map((s) => s.trim()),
      reply_to: lead.email,
      subject: `New consultation: ${lead.name}${lead.company ? ` (${lead.company})` : ""} · ${lead.signage}`,
      html,
      attachments,
    }),
  });
  if (!res.ok) throw new Error(`email ${res.status}`);
  return "email";
}

async function postJson(url: string | undefined, body: unknown, label: string) {
  if (!url) return null;
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`${label} ${res.status}`);
  return label;
}

async function sendHubSpot(lead: Lead, pageUri: string) {
  const portal = process.env.HUBSPOT_PORTAL_ID;
  const form = process.env.HUBSPOT_FORM_GUID;
  if (!portal || !form) return null;
  const [firstname, ...rest] = lead.name.split(" ");
  const fields = { firstname, lastname: rest.join(" "), email: lead.email, phone: lead.phone, company: lead.company, message: `${lead.signage} · ${lead.budget} · ${lead.timeline}\n${lead.location}\n\n${lead.message}` };
  const res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portal}/${form}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: Object.entries(fields).map(([name, value]) => ({ name, value })), context: { pageUri, pageName: "Consultation" } }),
  });
  if (!res.ok) throw new Error(`hubspot ${res.status}`);
  return "hubspot";
}

async function sendWhatsApp(lead: Lead) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_NOTIFY_TO;
  if (!token || !phoneId || !to) return null;
  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: `New SIGNOVA lead\n${lead.name}${lead.company ? ` · ${lead.company}` : ""}\n${lead.phone} · ${lead.email}\n${lead.signage} · ${lead.budget || "budget n/a"}\n${lead.location}` },
    }),
  });
  if (!res.ok) throw new Error(`whatsapp ${res.status}`);
  return "whatsapp";
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success.
  if (str(fd, "company_website")) return NextResponse.json({ ok: true });

  let attribution: Record<string, string> = {};
  try { attribution = JSON.parse(str(fd, "attribution", 4000) || "{}"); } catch { /* ignore */ }

  const files = [...fd.getAll("logo"), ...fd.getAll("photos")].filter((f): f is File => f instanceof File && f.size > 0);
  if (files.some((f) => f.size > MAX_FILE) || files.reduce((n, f) => n + f.size, 0) > MAX_TOTAL) {
    return NextResponse.json({ error: "Files too large" }, { status: 413 });
  }

  const lead: Lead = {
    name: str(fd, "name", 120), company: str(fd, "company", 160), email: str(fd, "email", 200), phone: str(fd, "phone", 40),
    businessType: str(fd, "businessType", 80), location: str(fd, "location", 120), signage: str(fd, "signage", 80),
    budget: str(fd, "budget", 40), timeline: str(fd, "timeline", 40), message: str(fd, "message", 5000),
    attribution, submittedAt: new Date().toISOString(),
    files: files.map((f) => ({ name: f.name, type: f.type, size: f.size })),
  };

  if (!lead.name || !/^\S+@\S+\.\S+$/.test(lead.email) || lead.phone.replace(/\D/g, "").length < 10 || !lead.signage || fd.get("consent") !== "yes") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 422 });
  }

  const pageUri = req.headers.get("referer") ?? "";
  const results = await Promise.allSettled([
    sendEmail(lead, files),
    postJson(process.env.LEAD_WEBHOOK_URL, lead, "webhook"),
    postJson(process.env.GOOGLE_SHEETS_WEBHOOK_URL, lead, "sheets"),
    sendHubSpot(lead, pageUri),
    sendWhatsApp(lead),
  ]);

  const delivered = results.flatMap((r) => (r.status === "fulfilled" && r.value ? [r.value] : []));
  const failed = results.flatMap((r) => (r.status === "rejected" ? [String(r.reason)] : []));
  if (failed.length) console.error("[lead] integration failures:", failed);

  if (delivered.length === 0) {
    if (process.env.NODE_ENV !== "production" && failed.length === 0) {
      console.info("[lead] no integrations configured; lead received in dev:", lead);
      return NextResponse.json({ ok: true, delivered: ["dev-log"] });
    }
    // Never silently drop a lead in production.
    return NextResponse.json({ error: "Lead could not be delivered" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered });
}
