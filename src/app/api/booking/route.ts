import { NextResponse } from "next/server";
import { z } from "zod";

const bookingSchema = z.object({
  name: z.string().min(2, "Navn må ha minst 2 tegn"),
  email: z.string().email("Ugyldig e-postadresse"),
  phone: z.string().optional(),
  eventType: z.string().min(1, "Velg en arrangementstype"),
  date: z.string().min(1, "Dato er påkrevd"),
  venue: z.string().min(1, "Sted er påkrevd"),
  budget: z.string().optional(),
  details: z.string().min(10, "Beskrivelse må ha minst 10 tegn"),
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

    // TODO: Integrer e-postutsending her
    console.log("Ny booking-forespørsel:", result.data);

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
