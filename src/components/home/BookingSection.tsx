"use client";

import { useState } from "react";

type Side = "Dusk — golden hour" | "Dawn — into the dark" | "Both — full arc" | "Surprise me" | "";

const eventTypes = [
  "Booking — festival",
  "Booking — club",
  "Booking — private event",
  "Production / collab",
  "General / press",
];

export default function BookingSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    eventType: "",
    side: "" as Side,
    date: "",
    venue: "",
    details: "",
  });

  const onChange = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2 || !form.email.includes("@")) {
      setStatus("error");
      setErrorMessage("Fill out at least name + email.");
      return;
    }
    if (form.details.trim().length < 10) {
      setStatus("error");
      setErrorMessage("Tell me a bit more in the message field (≥ 10 chars).");
      return;
    }
    if (!form.eventType) {
      setStatus("error");
      setErrorMessage("Pick a type.");
      return;
    }
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "booking",
          name: form.name,
          email: form.email,
          eventType: form.eventType,
          date: form.date || "flexible",
          venue: form.venue || "TBD",
          details: `${form.details}\n\nSide: ${form.side || "—"}`,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Could not send.");
      }

      setStatus("success");
      setForm({ name: "", email: "", eventType: "", side: "" as Side, date: "", venue: "", details: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section
      id="booking"
      style={{
        background: "var(--jungle-deep)",
        padding: "140px 24px 160px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div className="booking-grid">
          <div className="reveal">
            <h2
              style={{
                fontFamily: "var(--font-anton), sans-serif",
                fontSize: "clamp(60px, 9vw, 160px)",
                lineHeight: 0.85,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                marginBottom: "32px",
                color: "var(--bone)",
              }}
            >
              Book
              <br />
              the{" "}
              <em
                style={{
                  fontFamily: "var(--font-instrument-serif), serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "var(--neon-lime)",
                }}
              >
                booth
              </em>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-instrument-serif), serif",
                fontStyle: "italic",
                fontSize: "22px",
                lineHeight: 1.4,
                color: "var(--bone-dim)",
                maxWidth: "480px",
              }}
            >
              Got a room, a festival, a sunset, or a basement that needs the right sound?
              Tell me what you&apos;re building and I&apos;ll tell you which side fits.
            </p>

            <div
              style={{
                marginTop: "60px",
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {[
                { n: "[001]", t: "Booking", c: "Festivals, clubs, private events. EU + NO available year-round." },
                { n: "[002]", t: "Production", c: "Collabs, co-production, ghost work, beats. Dusk or Dawn." },
                { n: "[003]", t: "General", c: "Interviews, label inquiries, press, anything else worth a reply." },
              ].map((ch, i) => (
                <div
                  key={ch.n}
                  style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "flex-start",
                    padding: "20px 0",
                    borderTop: "1px solid rgba(245,240,232,0.15)",
                    borderBottom:
                      i === 2 ? "1px solid rgba(245,240,232,0.15)" : undefined,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "12px",
                      color: "var(--neon-lime)",
                      letterSpacing: "0.2em",
                    }}
                  >
                    {ch.n}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        fontFamily: "var(--font-anton), sans-serif",
                        fontSize: "28px",
                        lineHeight: 1,
                        textTransform: "uppercase",
                        letterSpacing: "-0.02em",
                        marginBottom: "6px",
                        color: "var(--bone)",
                      }}
                    >
                      {ch.t}
                    </h4>
                    <p
                      style={{
                        fontFamily: "var(--font-bricolage), sans-serif",
                        fontSize: "14px",
                        color: "var(--bone-dim)",
                        lineHeight: 1.5,
                      }}
                    >
                      {ch.c}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {status === "success" ? (
            <div
              className="reveal"
              style={{
                padding: "60px 32px",
                border: "1px solid rgba(245,240,232,0.15)",
                fontFamily: "var(--font-bricolage), sans-serif",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-anton), sans-serif",
                  fontSize: "48px",
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  color: "var(--neon-lime)",
                  marginBottom: "16px",
                }}
              >
                Sent.
              </h3>
              <p style={{ color: "var(--bone-dim)", lineHeight: 1.6 }}>
                Reply within 48h. If the vibe is right, you&apos;ll hear from me soon.
              </p>
            </div>
          ) : (
            <form className="reveal form" onSubmit={onSubmit}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px",
                  paddingBottom: "16px",
                }}
              >
                <span
                  style={{
                    width: "32px",
                    height: "1px",
                    background: "var(--neon-lime)",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "11px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "var(--neon-lime)",
                  }}
                >
                  — Fill the brief ↓ click any line to type
                </span>
              </div>
              <FormRow label="Name">
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                />
              </FormRow>
              <FormRow label="Email">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                />
              </FormRow>
              <FormRow label="Type">
                <select
                  value={form.eventType}
                  onChange={(e) => onChange("eventType", e.target.value)}
                >
                  <option value="">— Choose one</option>
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </FormRow>
              <FormRow label="Side">
                <select
                  value={form.side}
                  onChange={(e) => onChange("side", e.target.value as Side)}
                >
                  <option value="">— Dusk or Dawn?</option>
                  <option>Dusk — golden hour</option>
                  <option>Dawn — into the dark</option>
                  <option>Both — full arc</option>
                  <option>Surprise me</option>
                </select>
              </FormRow>
              <FormRow label="Date">
                <input
                  type="text"
                  placeholder="DD.MM.YY (or flexible)"
                  value={form.date}
                  onChange={(e) => onChange("date", e.target.value)}
                />
              </FormRow>
              <FormRow label="Place">
                <input
                  type="text"
                  placeholder="City, venue, country"
                  value={form.venue}
                  onChange={(e) => onChange("venue", e.target.value)}
                />
              </FormRow>
              <FormRow label="Message" alignTop>
                <textarea
                  placeholder="Capacity, vibe, sunset time, your favorite track of mine — whatever helps me say yes."
                  value={form.details}
                  onChange={(e) => onChange("details", e.target.value)}
                />
              </FormRow>

              {status === "error" && (
                <div
                  style={{
                    margin: "16px 0",
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "12px",
                    color: "var(--clay)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <div
                className="form-actions"
                style={{
                  marginTop: "32px",
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={status === "loading"}
                  style={{
                    background: "var(--neon-lime)",
                    color: "var(--jungle-deep)",
                    padding: "22px 40px",
                    fontFamily: "var(--font-anton), sans-serif",
                    fontSize: "32px",
                    letterSpacing: 0,
                    textTransform: "uppercase",
                    lineHeight: 1,
                    border: 0,
                    cursor: "none",
                    opacity: status === "loading" ? 0.6 : 1,
                  }}
                >
                  {status === "loading" ? "Sending…" : "Send the brief"}
                </button>
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    color: "var(--bone-dim)",
                    textTransform: "uppercase",
                    maxWidth: "240px",
                    lineHeight: 1.5,
                  }}
                >
                  — Reply within 48h.
                  <br />
                  Direct: wtchoutmusic@gmail.com
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .booking-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 60px;
          align-items: start;
        }
        @media (min-width: 900px) {
          .booking-grid { grid-template-columns: 1.1fr 1fr; gap: 80px; }
        }
        .form { display: flex; flex-direction: column; gap: 0; }
        .form-row {
          display: grid;
          grid-template-columns: 100px 1fr 24px;
          gap: 24px;
          padding: 22px 0;
          border-bottom: 1px solid rgba(245,240,232,0.15);
          align-items: center;
          transition: border-color .25s, background-color .25s;
        }
        .form-row::before {
          content: "→";
          grid-column: 3;
          grid-row: 1;
          font-family: var(--font-jetbrains), monospace;
          font-size: 14px;
          color: var(--bone-dim);
          opacity: 0.4;
          text-align: right;
          transition: opacity .25s, color .25s, transform .25s;
        }
        .form-row:hover { border-bottom-color: rgba(200,255,42,0.5); }
        .form-row:hover::before { opacity: 1; color: var(--neon-lime); transform: translateX(4px); }
        .form-row:focus-within { border-bottom-color: var(--neon-lime); }
        .form-row:focus-within::before { opacity: 1; color: var(--neon-lime); }
        .form-row.first { border-top: 1px solid rgba(245,240,232,0.15); }
        .form-row.align-top { align-items: start; }
        .form-row label {
          font-family: var(--font-jetbrains), monospace;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--bone-dim);
        }
        .form-row input,
        .form-row select,
        .form-row textarea {
          width: 100%;
          background: transparent;
          border: 0;
          font-family: var(--font-anton), sans-serif;
          font-size: 26px;
          color: var(--bone);
          padding: 0;
          outline: none;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          cursor: text;
        }
        .form-row select { cursor: pointer; }
        .form-row textarea {
          font-family: var(--font-bricolage), sans-serif;
          font-size: 16px;
          text-transform: none;
          letter-spacing: 0;
          resize: none;
          min-height: 80px;
          cursor: text;
        }
        .form-row input::placeholder,
        .form-row textarea::placeholder {
          font-family: var(--font-instrument-serif), serif;
          font-style: italic;
          font-weight: 300;
          font-size: 20px;
          color: rgba(216,210,196,0.4);
          text-transform: none;
          letter-spacing: 0;
        }
        .form-row textarea::placeholder { font-size: 16px; }
        .form-row select { -webkit-appearance: none; appearance: none; }
        .form-row select option { background: var(--jungle-deep); color: var(--bone); }
        @media (max-width: 700px) {
          .form-row {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
            padding: 16px 0 !important;
          }
          .form-row::before { display: none; }
          .form-row input, .form-row select { font-size: 22px; }
        }
      `}</style>
    </section>
  );
}

function FormRow({
  label,
  children,
  alignTop = false,
}: {
  label: string;
  children: React.ReactNode;
  alignTop?: boolean;
}) {
  return (
    <div className={`form-row${alignTop ? " align-top" : ""}`}>
      <label>{label}</label>
      <div>{children}</div>
    </div>
  );
}
