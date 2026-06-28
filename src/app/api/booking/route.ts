import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 10;

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

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
  // Vercel preview deploys + local dev.
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app/i.test(candidate)) return true;
  if (process.env.NODE_ENV !== "production" && /^http:\/\/localhost/.test(candidate)) return true;
  return false;
}

function honeypotTriggered(body: Record<string, unknown>): boolean {
  const trap = body["website"];
  return typeof trap === "string" && trap.trim().length > 0;
}

function timingSuspicious(body: Record<string, unknown>): boolean {
  const ts = body["formStartedAt"];
  if (typeof ts !== "number" || !Number.isFinite(ts)) return true;
  const elapsed = Date.now() - ts;
  // Less than 3 s = scripted bot. More than 24 h = stale form replay.
  return elapsed < 3000 || elapsed > 24 * 60 * 60 * 1000;
}

const URL_PATTERN = /https?:\/\/|www\./gi;
function tooManyUrls(text: string, max = 4): boolean {
  return (text.match(URL_PATTERN)?.length ?? 0) > max;
}

const bookingSchema = z.object({
  category: z.literal("booking").optional().default("booking"),
  name: z.string().min(2, "Navn må ha minst 2 tegn").max(100),
  email: z.string().email("Ugyldig e-postadresse").max(255),
  phone: z.string().max(20).optional(),
  eventType: z.string().min(1, "Velg en arrangementstype").max(50),
  date: z.string().min(1, "Dato er påkrevd").max(20),
  venue: z.string().min(1, "Sted er påkrevd").max(200),
  budget: z.string().max(100).optional(),
  details: z.string().min(10, "Beskrivelse må ha minst 10 tegn").max(5000),
  whyFit: z.string().max(2000).optional(),
});

const productionSchema = z.object({
  category: z.literal("production"),
  name: z.string().min(2, "Navn må ha minst 2 tegn").max(100),
  email: z.string().email("Ugyldig e-postadresse").max(255),
  artistName: z.string().max(100).optional(),
  type: z.string().min(1, "Velg en type").max(50),
  description: z.string().min(10, "Beskrivelse må ha minst 10 tegn").max(5000),
  musicLink: z.string().max(500).optional(),
  budget: z.string().max(100).optional(),
});

const generalSchema = z.object({
  category: z.literal("general"),
  name: z.string().min(2, "Navn må ha minst 2 tegn").max(100),
  email: z.string().email("Ugyldig e-postadresse").max(255),
  organization: z.string().max(200).optional(),
  type: z.string().min(1, "Velg en type").max(50),
  message: z.string().min(10, "Melding må ha minst 10 tegn").max(5000),
});

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// In-memory rate limiting. Note: serverless instances are ephemeral, so
// these counters reset frequently. Good enough to slow casual abuse;
// dedicated attackers need distributed storage (Vercel KV / Upstash).
const ipRateLimit = new Map<string, { count: number; reset: number }>();
const IP_LIMIT_MAX = 5;
const IP_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function isIpRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateLimit.get(ip);
  if (!entry || now > entry.reset) {
    ipRateLimit.set(ip, { count: 1, reset: now + IP_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > IP_LIMIT_MAX;
}

const emailRateLimit = new Map<string, { count: number; reset: number }>();
const EMAIL_LIMIT_MAX = 2;
const EMAIL_LIMIT_WINDOW = 60 * 60 * 1000;

function isEmailRateLimited(email: string): boolean {
  const key = email.toLowerCase().trim();
  const now = Date.now();
  const entry = emailRateLimit.get(key);
  if (!entry || now > entry.reset) {
    emailRateLimit.set(key, { count: 1, reset: now + EMAIL_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > EMAIL_LIMIT_MAX;
}

// Periodic cleanup so the Maps don't grow unbounded.
function pruneRateLimits() {
  const now = Date.now();
  for (const [k, v] of ipRateLimit) if (now > v.reset) ipRateLimit.delete(k);
  for (const [k, v] of emailRateLimit) if (now > v.reset) emailRateLimit.delete(k);
}

type Row = { label: string; value: string; href?: string };
type Section = { heading: string; body: string };

const FONT_DISPLAY = `'Impact','Arial Black','Helvetica Neue',Helvetica,sans-serif`;
const FONT_MONO = `'SF Mono','JetBrains Mono','Courier New',Courier,monospace`;
const FONT_BODY = `'Helvetica Neue',Helvetica,Arial,sans-serif`;
const FONT_SERIF = `Georgia,'Times New Roman',serif`;

function renderEmail(opts: {
  kicker: string;
  title: string;
  subtitle?: string;
  rows: Row[];
  sections: Section[];
}): string {
  const rowsHtml = opts.rows
    .map(
      (r) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid rgba(0,0,0,0.08);width:38%;vertical-align:top;font-family:${FONT_MONO};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#666;">${r.label}</td>
          <td style="padding:14px 0;border-bottom:1px solid rgba(0,0,0,0.08);font-family:${FONT_BODY};font-size:15px;color:#1a1a1a;line-height:1.5;">${r.href ? `<a href="${r.href}" style="color:#1a1a1a;text-decoration:underline;text-decoration-color:#ef7d38;text-decoration-thickness:2px;text-underline-offset:3px;">${r.value}</a>` : r.value}</td>
        </tr>`,
    )
    .join("");

  const sectionsHtml = opts.sections
    .map(
      (s) => `
        <div style="margin-top:36px;">
          <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#2d5a35;margin-bottom:14px;">— ${s.heading}</div>
          <div style="font-family:${FONT_SERIF};font-size:18px;line-height:1.55;color:#1a1a1a;font-style:italic;">${s.body.replace(/\n/g, "<br/>")}</div>
        </div>`,
    )
    .join("");

  const subtitleHtml = opts.subtitle
    ? `<div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#ef7d38;margin-top:18px;">— ${opts.subtitle} —</div>`
    : "";

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${opts.title}</title>
  </head>
  <body style="margin:0;padding:0;background:#0a1a0f;font-family:${FONT_BODY};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a1a0f;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
            <!-- HERO -->
            <tr>
              <td style="background:#050d08;padding:56px 40px 48px;border-radius:2px;">
                <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.4em;text-transform:uppercase;color:#ef7d38;">— ${opts.kicker} —</div>
                <div style="font-family:${FONT_DISPLAY};font-size:64px;line-height:0.9;font-weight:900;letter-spacing:-0.04em;text-transform:uppercase;color:#f5f0e8;margin-top:24px;">${opts.title}</div>
                ${subtitleHtml}
              </td>
            </tr>
            <!-- BODY -->
            <tr>
              <td style="background:#f5f0e8;padding:44px 40px;">
                <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#2d5a35;margin-bottom:8px;">— Sender details</div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid rgba(0,0,0,0.08);">
                  ${rowsHtml}
                </table>
                ${sectionsHtml}
              </td>
            </tr>
            <!-- FOOTER -->
            <tr>
              <td style="background:#050d08;padding:32px 40px;color:#d8d2c4;">
                <div style="font-family:${FONT_DISPLAY};font-size:28px;font-weight:900;letter-spacing:-0.03em;text-transform:uppercase;color:#f5f0e8;line-height:1;">WTCHOUT</div>
                <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#d8d2c4;margin-top:14px;line-height:1.7;">
                  Sent via wtchoutmusic.com<br/>
                  Reply directly — goes to the sender
                </div>
                <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#ef7d38;margin-top:18px;">— Norwegian house &amp; rave —</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildBookingEmail(data: z.infer<typeof bookingSchema>) {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const eventType = escapeHtml(data.eventType);

  const rows: Row[] = [
    { label: "Name", value: name },
    { label: "Email", value: email, href: `mailto:${email}` },
  ];
  if (data.phone) rows.push({ label: "Phone", value: escapeHtml(data.phone) });
  rows.push({ label: "Event type", value: eventType });
  rows.push({ label: "Date", value: escapeHtml(data.date) });
  rows.push({ label: "Venue", value: escapeHtml(data.venue) });
  if (data.budget) rows.push({ label: "Budget", value: escapeHtml(data.budget) });

  const sections: Section[] = [{ heading: "The brief", body: escapeHtml(data.details) }];
  if (data.whyFit) sections.push({ heading: "Why WTCHOUT", body: escapeHtml(data.whyFit) });

  return {
    subject: `Booking — ${eventType} · ${name}`,
    html: renderEmail({
      kicker: "Booking request",
      title: eventType,
      subtitle: name,
      rows,
      sections,
    }),
  };
}

function buildProductionEmail(data: z.infer<typeof productionSchema>) {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const type = escapeHtml(data.type);

  const rows: Row[] = [
    { label: "Name", value: name },
    { label: "Email", value: email, href: `mailto:${email}` },
  ];
  if (data.artistName) rows.push({ label: "Artist name", value: escapeHtml(data.artistName) });
  rows.push({ label: "Type", value: type });
  if (data.musicLink) {
    const link = escapeHtml(data.musicLink);
    rows.push({ label: "Reference", value: link, href: link });
  }
  if (data.budget) rows.push({ label: "Budget", value: escapeHtml(data.budget) });

  return {
    subject: `Production — ${type} · ${name}`,
    html: renderEmail({
      kicker: "Production request",
      title: type,
      subtitle: name,
      rows,
      sections: [{ heading: "Project brief", body: escapeHtml(data.description) }],
    }),
  };
}

function buildGeneralEmail(data: z.infer<typeof generalSchema>) {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const type = escapeHtml(data.type);

  const rows: Row[] = [
    { label: "Name", value: name },
    { label: "Email", value: email, href: `mailto:${email}` },
  ];
  if (data.organization) rows.push({ label: "Organisation", value: escapeHtml(data.organization) });
  rows.push({ label: "Type", value: type });

  return {
    subject: `Inquiry — ${type} · ${name}`,
    html: renderEmail({
      kicker: "New inquiry",
      title: type,
      subtitle: name,
      rows,
      sections: [{ heading: "Message", body: escapeHtml(data.message) }],
    }),
  };
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName.trim();
}

function buildConfirmationEmail(opts: {
  fullName: string;
  kind: "booking" | "production" | "general";
}): { subject: string; html: string } {
  const fname = escapeHtml(firstName(opts.fullName));
  const copy = {
    booking: {
      subject: "WTCHOUT — your booking request landed",
      kicker: "Booking received",
      headline: "Heard.",
      message:
        "Your booking request is in. I read every one personally and reply within 48 hours, often faster. If your timeline is tight, mention it in a follow-up reply and it'll move to the top of the stack.",
    },
    production: {
      subject: "WTCHOUT — your production request landed",
      kicker: "Production received",
      headline: "Got it.",
      message:
        "Your production request is in. I'll listen through the references and come back with a personal note within 48 hours.",
    },
    general: {
      subject: "WTCHOUT — message received",
      kicker: "Message received",
      headline: "Heard.",
      message:
        "Your message is in. I'll reply personally within 48 hours.",
    },
  }[opts.kind];

  const html = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${copy.subject}</title>
  </head>
  <body style="margin:0;padding:0;background:#0a1a0f;font-family:${FONT_BODY};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a1a0f;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
            <!-- HERO -->
            <tr>
              <td style="background:#050d08;padding:56px 40px 48px;border-radius:2px;">
                <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.4em;text-transform:uppercase;color:#ef7d38;">— ${copy.kicker} —</div>
                <div style="font-family:${FONT_DISPLAY};font-size:80px;line-height:0.9;font-weight:900;letter-spacing:-0.04em;text-transform:uppercase;color:#f5f0e8;margin-top:24px;">${copy.headline}</div>
                <div style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#d8d2c4;margin-top:18px;">— ${fname} —</div>
              </td>
            </tr>
            <!-- BODY -->
            <tr>
              <td style="background:#f5f0e8;padding:48px 40px;">
                <div style="font-family:${FONT_SERIF};font-size:20px;line-height:1.55;color:#1a1a1a;font-style:italic;">${copy.message}</div>
                <div style="margin-top:36px;font-family:${FONT_MONO};font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#2d5a35;">— Oscar · WTCHOUT</div>
              </td>
            </tr>
            <!-- FOOTER -->
            <tr>
              <td style="background:#050d08;padding:32px 40px;color:#d8d2c4;">
                <div style="font-family:${FONT_DISPLAY};font-size:28px;font-weight:900;letter-spacing:-0.03em;text-transform:uppercase;color:#f5f0e8;line-height:1;">WTCHOUT</div>
                <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#d8d2c4;margin-top:14px;line-height:1.7;">
                  Hustadvika · Norway<br/>
                  <a href="https://wtchoutmusic.com" style="color:#d8d2c4;text-decoration:none;">wtchoutmusic.com</a>
                </div>
                <div style="font-family:${FONT_MONO};font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#ef7d38;margin-top:18px;">— Norwegian house &amp; rave —</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject: copy.subject, html };
}

// Silent-success response. Used when we want bots to think the submit
// worked so they stop retrying, without actually sending email.
// Must be a fresh Response each call — Response bodies are single-use streams,
// and a shared constant would return an empty body on the second hit in a
// warm serverless instance.
const silentOk = () =>
  NextResponse.json({ success: true, message: "Forespørsel mottatt" });

export async function POST(request: Request) {
  try {
    // 1. Origin / Referer check. Stops curl scripts and cross-site POSTs.
    if (!originAllowed(request)) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    // 2. IP rate limit (cheap to check, do it before parsing body).
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    pruneRateLimits();

    if (isIpRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: "For mange forespørsler. Prøv igjen senere." },
        { status: 429 },
      );
    }

    // 3. Body must be JSON, max ~64KB to defend against payload-bombing.
    const raw = await request.text();
    if (raw.length > 64_000) {
      return NextResponse.json({ success: false, message: "Payload for stor" }, { status: 413 });
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ success: false, message: "Ugyldig JSON" }, { status: 400 });
    }

    // 4. Honeypot — bots fill all fields including hidden ones.
    if (honeypotTriggered(body)) return silentOk();

    // 5. Timing — formStartedAt must come from a real form mount.
    if (timingSuspicious(body)) return silentOk();

    const category = body.category ?? "booking";

    let emailData: { subject: string; html: string };
    let confirmation: { subject: string; html: string };
    let senderEmail: string;
    let longText: string;

    if (category === "production") {
      const result = productionSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: "Ugyldig data", errors: result.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })) },
          { status: 400 },
        );
      }
      emailData = buildProductionEmail(result.data);
      confirmation = buildConfirmationEmail({ fullName: result.data.name, kind: "production" });
      senderEmail = result.data.email;
      longText = `${result.data.description} ${result.data.musicLink ?? ""}`;
    } else if (category === "general") {
      const result = generalSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: "Ugyldig data", errors: result.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })) },
          { status: 400 },
        );
      }
      emailData = buildGeneralEmail(result.data);
      confirmation = buildConfirmationEmail({ fullName: result.data.name, kind: "general" });
      senderEmail = result.data.email;
      longText = result.data.message;
    } else {
      const result = bookingSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: "Ugyldig data", errors: result.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })) },
          { status: 400 },
        );
      }
      emailData = buildBookingEmail(result.data);
      confirmation = buildConfirmationEmail({ fullName: result.data.name, kind: "booking" });
      senderEmail = result.data.email;
      longText = `${result.data.details} ${result.data.whyFit ?? ""}`;
    }

    // 6. Per-email rate limit. Stops one address from spamming itself
    // (or being used to spam someone else via the auto-confirmation).
    if (isEmailRateLimited(senderEmail)) {
      return NextResponse.json(
        { success: false, message: "Du har nylig sendt en henvendelse. Prøv igjen senere." },
        { status: 429 },
      );
    }

    // 7. Content heuristic — link-stuffed messages are almost always spam.
    if (tooManyUrls(longText)) return silentOk();

    const resend = getResend();

    // Internal notification to Oscar
    await resend.emails.send({
      from: "WTCHOUT Kontakt <bookings@wtchoutmusic.com>",
      to: "wtchoutmusic@gmail.com",
      replyTo: senderEmail,
      subject: emailData.subject,
      html: emailData.html,
    });

    // Auto-confirmation back to the sender. Failures here are logged but
    // don't block the success response — the form already worked.
    try {
      await resend.emails.send({
        from: "WTCHOUT <bookings@wtchoutmusic.com>",
        to: senderEmail,
        replyTo: "wtchoutmusic@gmail.com",
        subject: confirmation.subject,
        html: confirmation.html,
      });
    } catch (confirmError) {
      console.error("Confirmation send failed:", confirmError);
    }

    return NextResponse.json({
      success: true,
      message: "Forespørsel mottatt",
    });
  } catch (error) {
    // Log only the error type / message — never the request body, so user
    // input never leaks into server logs even on unexpected failures.
    const safeMessage = error instanceof Error ? error.message : "unknown";
    console.error("Contact API error:", safeMessage);
    return NextResponse.json(
      { success: false, message: "Kunne ikke behandle forespørselen" },
      { status: 500 },
    );
  }
}
