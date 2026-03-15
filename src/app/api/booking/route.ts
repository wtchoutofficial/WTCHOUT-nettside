import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const bookingSchema = z.object({
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
    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return NextResponse.json(
        { success: false, message: "Ugyldig data", errors: fieldErrors },
        { status: 400 },
      );
    }

    const data = result.data;

    const name = escapeHtml(data.name);
    const email = escapeHtml(data.email);
    const phone = data.phone ? escapeHtml(data.phone) : "";
    const eventType = escapeHtml(data.eventType);
    const date = escapeHtml(data.date);
    const venue = escapeHtml(data.venue);
    const budget = data.budget ? escapeHtml(data.budget) : "";
    const details = escapeHtml(data.details);
    const whyFit = data.whyFit ? escapeHtml(data.whyFit) : "";

    await getResend().emails.send({
      from: "WTCHOUT Booking <onboarding@resend.dev>",
      to: "wtchoutmusic@gmail.com",
      replyTo: data.email,
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
    });

    return NextResponse.json({
      success: true,
      message: "Forespørsel mottatt",
    });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { success: false, message: "Kunne ikke behandle forespørselen" },
      { status: 500 },
    );
  }
}
