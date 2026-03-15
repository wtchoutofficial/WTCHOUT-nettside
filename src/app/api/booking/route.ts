import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const bookingSchema = z.object({
  name: z.string().min(2, "Navn må ha minst 2 tegn"),
  email: z.string().email("Ugyldig e-postadresse"),
  phone: z.string().optional(),
  eventType: z.string().min(1, "Velg en arrangementstype"),
  date: z.string().min(1, "Dato er påkrevd"),
  venue: z.string().min(1, "Sted er påkrevd"),
  budget: z.string().optional(),
  details: z.string().min(10, "Beskrivelse må ha minst 10 tegn"),
  whyFit: z.string().optional(),
});

export async function POST(request: Request) {
  try {
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

    await resend.emails.send({
      from: "WTCHOUT Booking <onboarding@resend.dev>",
      to: "wtchoutmusic@gmail.com",
      subject: `Ny booking-forespørsel: ${data.eventType} — ${data.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b2c;">Ny booking-forespørsel</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Navn</td>
              <td style="padding: 8px 0;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">E-post</td>
              <td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            ${data.phone ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Telefon</td><td style="padding: 8px 0;">${data.phone}</td></tr>` : ""}
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Type</td>
              <td style="padding: 8px 0;">${data.eventType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Dato</td>
              <td style="padding: 8px 0;">${data.date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Sted</td>
              <td style="padding: 8px 0;">${data.venue}</td>
            </tr>
            ${data.budget ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Budsjett</td><td style="padding: 8px 0;">${data.budget}</td></tr>` : ""}
          </table>
          <h3 style="margin-top: 24px; color: #333;">Detaljer</h3>
          <p style="color: #444; line-height: 1.6;">${data.details}</p>
          ${data.whyFit ? `<h3 style="margin-top: 24px; color: #333;">Hvorfor passer dette for WTCHOUT?</h3><p style="color: #444; line-height: 1.6;">${data.whyFit}</p>` : ""}
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Forespørsel mottatt",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Kunne ikke behandle forespørselen" },
      { status: 500 },
    );
  }
}
