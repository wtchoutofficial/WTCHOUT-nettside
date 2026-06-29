import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 10;

const ALLOWED_ORIGINS = [
  "https://wtchoutmusic.com",
  "https://www.wtchoutmusic.com",
];

function originAllowed(req: Request): boolean {
  const origin = req.headers.get("origin") ?? "";
  const referer = req.headers.get("referer") ?? "";
  const candidate = origin || referer;
  if (!candidate) return false;
  if (ALLOWED_ORIGINS.some((a) => candidate.startsWith(a))) return true;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app/i.test(candidate)) return true;
  if (process.env.NODE_ENV !== "production" && /^http:\/\/localhost/.test(candidate))
    return true;
  return false;
}

// In-memory rate limit — ephemeral on serverless, enough to slow casual abuse.
const ipHits = new Map<string, { count: number; reset: number }>();
const IP_MAX = 8;
const IP_WINDOW = 60 * 60 * 1000;
function ipLimited(ip: string): boolean {
  const now = Date.now();
  const e = ipHits.get(ip);
  if (!e || now > e.reset) {
    ipHits.set(ip, { count: 1, reset: now + IP_WINDOW });
    return false;
  }
  e.count++;
  return e.count > IP_MAX;
}

const schema = z.object({
  email: z.string().email("Invalid email").max(255),
  website: z.string().optional(), // honeypot
  formStartedAt: z.number().optional(),
});

export async function POST(req: Request) {
  if (!originAllowed(req)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid email" },
      { status: 400 },
    );
  }
  const { email, website, formStartedAt } = parsed.data;

  // Honeypot — a filled hidden field means a bot.
  if (typeof website === "string" && website.trim().length > 0) {
    return NextResponse.json({ ok: true }); // silently accept, do nothing
  }
  // Timing — submitted suspiciously fast = scripted.
  if (typeof formStartedAt === "number" && Date.now() - formStartedAt < 1500) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (ipLimited(ip)) {
    return NextResponse.json({ message: "Too many requests." }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  // Resend "Segment" (a.k.a. Audience) for the WTCHOUT mailing list. Not a
  // secret — the API key is what authorises writes. Env vars override.
  const listId =
    process.env.RESEND_SEGMENT_ID ||
    process.env.RESEND_AUDIENCE_ID ||
    "b5557628-b6f7-4fac-96a4-b2878638359e";

  // Dev fallback: with no Resend config, accept locally so the UI / share flow
  // is testable. Production requires real config so signups are never dropped.
  if (!apiKey || !listId) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[newsletter] No Resend config — dev fallback accepted:", email);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { message: "Newsletter is not configured yet." },
      { status: 500 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const res = await resend.contacts.create({
      email,
      unsubscribed: false,
      segments: [{ id: listId }],
    });
    // Resend returns an error object (not a throw) on some failures; a contact
    // that already exists is fine — they're on the list either way.
    if (res.error && !/exist/i.test(res.error.message ?? "")) {
      console.error("[newsletter] Resend error:", res.error);
      return NextResponse.json({ message: "Could not subscribe." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter] Unexpected error:", err);
    return NextResponse.json({ message: "Could not subscribe." }, { status: 500 });
  }
}
