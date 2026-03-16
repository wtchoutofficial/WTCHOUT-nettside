import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
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

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.reset) {
    rateLimit.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

function buildBookingEmail(data: z.infer<typeof bookingSchema>) {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const phone = data.phone ? escapeHtml(data.phone) : "";
  const eventType = escapeHtml(data.eventType);
  const date = escapeHtml(data.date);
  const venue = escapeHtml(data.venue);
  const budget = data.budget ? escapeHtml(data.budget) : "";
  const details = escapeHtml(data.details);
  const whyFit = data.whyFit ? escapeHtml(data.whyFit) : "";

  return {
    subject: `Ny booking-forespørsel: ${eventType} — ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b2c;">Ny booking-forespørsel</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Navn</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">E-post</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${phone ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Telefon</td><td style="padding: 8px 0;">${phone}</td></tr>` : ""}
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Type</td>
            <td style="padding: 8px 0;">${eventType}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Dato</td>
            <td style="padding: 8px 0;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Sted</td>
            <td style="padding: 8px 0;">${venue}</td>
          </tr>
          ${budget ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Budsjett</td><td style="padding: 8px 0;">${budget}</td></tr>` : ""}
        </table>
        <h3 style="margin-top: 24px; color: #333;">Detaljer</h3>
        <p style="color: #444; line-height: 1.6;">${details}</p>
        ${whyFit ? `<h3 style="margin-top: 24px; color: #333;">Hvorfor passer dette for WTCHOUT?</h3><p style="color: #444; line-height: 1.6;">${whyFit}</p>` : ""}
      </div>
    `,
  };
}

function buildProductionEmail(data: z.infer<typeof productionSchema>) {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const artistName = data.artistName ? escapeHtml(data.artistName) : "";
  const type = escapeHtml(data.type);
  const description = escapeHtml(data.description);
  const musicLink = data.musicLink ? escapeHtml(data.musicLink) : "";
  const budget = data.budget ? escapeHtml(data.budget) : "";

  return {
    subject: `Ny produksjonsforespørsel: ${type} — ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b2c;">Ny produksjonsforespørsel</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Navn</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">E-post</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${artistName ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Artistnavn</td><td style="padding: 8px 0;">${artistName}</td></tr>` : ""}
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Type</td>
            <td style="padding: 8px 0;">${type}</td>
          </tr>
          ${musicLink ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Musikk-link</td><td style="padding: 8px 0;"><a href="${musicLink}">${musicLink}</a></td></tr>` : ""}
          ${budget ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Budsjett</td><td style="padding: 8px 0;">${budget}</td></tr>` : ""}
        </table>
        <h3 style="margin-top: 24px; color: #333;">Prosjektbeskrivelse</h3>
        <p style="color: #444; line-height: 1.6;">${description}</p>
      </div>
    `,
  };
}

function buildGeneralEmail(data: z.infer<typeof generalSchema>) {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const organization = data.organization ? escapeHtml(data.organization) : "";
  const type = escapeHtml(data.type);
  const message = escapeHtml(data.message);

  return {
    subject: `Ny henvendelse: ${type} — ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b2c;">Ny henvendelse</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Navn</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">E-post</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${organization ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Organisasjon</td><td style="padding: 8px 0;">${organization}</td></tr>` : ""}
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Type</td>
            <td style="padding: 8px 0;">${type}</td>
          </tr>
        </table>
        <h3 style="margin-top: 24px; color: #333;">Melding</h3>
        <p style="color: #444; line-height: 1.6;">${message}</p>
      </div>
    `,
  };
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: "For mange forespørsler. Prøv igjen senere." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const category = body.category ?? "booking";

    let emailData: { subject: string; html: string };
    let replyTo: string;

    if (category === "production") {
      const result = productionSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: "Ugyldig data", errors: result.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })) },
          { status: 400 },
        );
      }
      emailData = buildProductionEmail(result.data);
      replyTo = result.data.email;
    } else if (category === "general") {
      const result = generalSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: "Ugyldig data", errors: result.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })) },
          { status: 400 },
        );
      }
      emailData = buildGeneralEmail(result.data);
      replyTo = result.data.email;
    } else {
      const result = bookingSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: "Ugyldig data", errors: result.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })) },
          { status: 400 },
        );
      }
      emailData = buildBookingEmail(result.data);
      replyTo = result.data.email;
    }

    await getResend().emails.send({
      from: "WTCHOUT Kontakt <onboarding@resend.dev>",
      to: "wtchoutmusic@gmail.com",
      replyTo,
      subject: emailData.subject,
      html: emailData.html,
    });

    return NextResponse.json({
      success: true,
      message: "Forespørsel mottatt",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, message: "Kunne ikke behandle forespørselen" },
      { status: 500 },
    );
  }
}
