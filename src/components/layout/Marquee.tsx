type Props = {
  items: string[];
  reverse?: boolean;
  muted?: boolean;
  star?: string;
};

export default function Marquee({
  items,
  reverse = false,
  muted = false,
  star = "✻",
}: Props) {
  const doubled = [...items, ...items, ...items, ...items];

  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid rgba(245,240,232,0.1)",
        borderBottom: "1px solid rgba(245,240,232,0.1)",
        background: "var(--jungle-deep)",
        padding: "22px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "60px",
          whiteSpace: "nowrap",
          animation: `marquee 40s linear ${reverse ? "reverse" : "normal"} infinite`,
          fontFamily: "var(--font-anton), sans-serif",
          fontSize: muted ? "clamp(28px, 4vw, 56px)" : "clamp(36px, 5vw, 72px)",
          textTransform: "uppercase",
          color: muted ? "transparent" : "var(--bone)",
          WebkitTextStroke: muted ? "1px var(--bone-dim)" : undefined,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          width: "max-content",
        }}
      >
        {doubled.map((label, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "60px" }}>
            <span>{label}</span>
            <span
              style={{
                color: "var(--neon-lime)",
                animation: "spin 8s linear infinite",
                display: "inline-block",
              }}
            >
              {star}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
