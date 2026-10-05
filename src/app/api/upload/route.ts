import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { ALLOWED_EXT, MAX_UPLOAD_MB } from "@/lib/uploads";

/**
 * Issues short-lived client tokens so the browser can upload logos and site
 * photos straight to Vercel Blob. This bypasses Vercel's 4.5MB request-body
 * limit on functions; /api/lead then only receives the resulting URLs.
 *
 * Needs BLOB_READ_WRITE_TOKEN, which Vercel adds automatically when a Blob
 * store is connected to the project.
 */

export const runtime = "nodejs";

// Best-effort per-instance throttle on token requests.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 30;
}

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    // The form falls back to sending files with the enquiry (fine locally).
    return NextResponse.json({ error: "Blob storage not configured" }, { status: 501 });
  }

  const body = (await req.json()) as HandleUploadBody;

  // Rate-limit token generation only; Blob's upload-completed callback has no client IP.
  if (body.type === "blob.generate-client-token") {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (limited(ip)) return NextResponse.json({ error: "Too many uploads" }, { status: 429 });
  }

  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("leads/") || pathname.includes("..") || !ALLOWED_EXT.test(pathname)) {
          throw new Error("File type not allowed");
        }
        return {
          allowedContentTypes: ["image/*", "application/pdf", "application/postscript", "application/illustrator", "application/octet-stream"],
          maximumSizeInBytes: MAX_UPLOAD_MB * 1024 * 1024,
          addRandomSuffix: true,
          validUntil: Date.now() + 10 * 60_000,
        };
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
