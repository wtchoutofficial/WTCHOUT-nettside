// Branded WTCHOUT release-announcement email (sunset-orange on near-black,
// email-client-safe: table layout + inline styles only). Reusable per release.
//
// Personalisation/compliance tokens Resend fills in:
//   {{{RESEND_UNSUBSCRIBE_URL}}}  — required unsubscribe link

const BG = "#070706";
const FG = "#f2efe9";
const DIM = "#b9b4ab";
const ORANGE = "#ef7d38";
const ON_ORANGE = "#0a0a0a";
const FONT = "Arial, Helvetica, sans-serif";

/**
 * @param {object} o
 * @param {string} o.title        Track title, e.g. "DO IT"
 * @param {string} o.dateLabel    Eyebrow, e.g. "Out now" or "Dropping 15 Aug"
 * @param {string} o.tagline      One line of body copy
 * @param {string} o.ctaLabel     Button label, e.g. "Listen now"
 * @param {string} o.ctaUrl       Button link (Spotify / pre-save / site)
 * @param {string} [o.siteUrl]    Footer link
 * @returns {{subject: string, previewText: string, html: string}}
 */
export function buildReleaseEmail({
  title,
  dateLabel,
  tagline,
  ctaLabel,
  ctaUrl,
  siteUrl = "https://wtchoutmusic.com",
}) {
  const subject = `${title} — ${dateLabel}`;
  const previewText = tagline;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:${BG};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background-color:${BG};">
  <tr>
    <td align="center" style="padding:48px 20px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

        <!-- wordmark -->
        <tr><td align="center" style="padding-bottom:8px;">
          <span style="font-family:${FONT};font-size:34px;font-weight:900;letter-spacing:4px;color:${FG};">WTCHOUT</span>
        </td></tr>

        <!-- eyebrow / date -->
        <tr><td align="center" style="padding:18px 0 6px;">
          <span style="font-family:${FONT};font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${ORANGE};">${dateLabel}</span>
        </td></tr>

        <!-- track title -->
        <tr><td align="center" style="padding:0 0 22px;">
          <span style="font-family:${FONT};font-size:72px;line-height:1;font-weight:900;letter-spacing:-1px;color:${FG};">${title}</span>
        </td></tr>

        <!-- tagline -->
        <tr><td align="center" style="padding:0 24px 34px;">
          <p style="margin:0;font-family:${FONT};font-size:17px;line-height:1.55;color:${DIM};">${tagline}</p>
        </td></tr>

        <!-- CTA -->
        <tr><td align="center" style="padding:0 0 40px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center" bgcolor="${ORANGE}" style="background-color:${ORANGE};">
              <a href="${ctaUrl}" target="_blank"
                 style="display:inline-block;font-family:${FONT};font-size:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${ON_ORANGE};text-decoration:none;padding:16px 40px;">
                ${ctaLabel} &rarr;
              </a>
            </td></tr>
          </table>
        </td></tr>

        <!-- divider -->
        <tr><td style="border-top:1px solid rgba(255,255,255,0.12);font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- footer -->
        <tr><td align="center" style="padding:26px 0 0;">
          <p style="margin:0 0 10px;font-family:${FONT};font-size:12px;letter-spacing:1px;color:${DIM};">
            <a href="${siteUrl}" target="_blank" style="color:${ORANGE};text-decoration:none;">wtchoutmusic.com</a>
          </p>
          <p style="margin:0;font-family:${FONT};font-size:11px;line-height:1.6;color:#6c6760;">
            You're getting this because you joined the WTCHOUT list.<br>
            <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" target="_blank" style="color:#6c6760;text-decoration:underline;">Unsubscribe</a>
            &nbsp;·&nbsp; © 2026 WTCHOUT
          </p>
        </td></tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  return { subject, previewText, html };
}
