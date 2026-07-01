// Create a WTCHOUT release-announcement broadcast in Resend, to the mailing
// segment, using the branded template. Draft by default (review + send in the
// Resend dashboard); set `scheduledAt` to auto-schedule the send.
//
// Run (Node 20+):
//   node --env-file=.env.local scripts/schedule-release.mjs
// .env.local must contain RESEND_API_KEY=... (same key as Vercel / booking).
//
// Edit CONFIG per release. Everything is safe to re-run: each run creates a new
// draft you can review before anything goes out.

import { Resend } from "resend";
import { buildReleaseEmail } from "./release-email.mjs";

const CONFIG = {
  // WTCHOUT mailing segment (same id the signup form writes to).
  segmentId: "b5557628-b6f7-4fac-96a4-b2878638359e",
  // Any address on the verified wtchoutmusic.com domain.
  from: "WTCHOUT <hello@wtchoutmusic.com>",

  // ---- the release ----
  title: "DO IT",
  dateLabel: "Out 17 July 2026",
  tagline: "The one you heard the teaser of — DO IT lands 17 July. Pre-save it now so it's in your library the second it drops.",
  ctaLabel: "Pre-save now",
  ctaUrl: "https://distrokid.com/hyperfollow/wtchout/do-it",

  // Auto-schedule? Leave null to create a draft you send manually. To schedule,
  // set an ISO time, e.g. "2026-08-15T17:00:00Z", or relative e.g. "in 2 days".
  scheduledAt: null,
};

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "Missing RESEND_API_KEY. Run with:\n  node --env-file=.env.local scripts/schedule-release.mjs",
    );
    process.exit(1);
  }

  const resend = new Resend(apiKey);
  const { subject, previewText, html } = buildReleaseEmail(CONFIG);

  const schedule = CONFIG.scheduledAt
    ? { send: true, scheduledAt: CONFIG.scheduledAt }
    : {};

  const { data, error } = await resend.broadcasts.create({
    segmentId: CONFIG.segmentId,
    from: CONFIG.from,
    subject,
    previewText,
    html,
    name: `${CONFIG.title} — ${CONFIG.dateLabel}`,
    ...schedule,
  });

  if (error) {
    console.error("Resend error:", error);
    process.exit(1);
  }

  console.log("Broadcast created:", data?.id);
  if (CONFIG.scheduledAt) {
    console.log(`Scheduled to send: ${CONFIG.scheduledAt}`);
  } else {
    console.log(
      "Created as a DRAFT — open Resend → Broadcasts to preview, then Send or Schedule.",
    );
  }
  console.log("Subject:", subject);
}

main();
