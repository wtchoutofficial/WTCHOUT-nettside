// Thin drifting fog at a section seam — continues the hero's jungle
// atmosphere between sections. Pure CSS (compositor-only), zero main-thread
// cost. Hidden on mobile and under reduced motion. Place between two sections.
export default function SectionHaze() {
  return (
    <div className="section-haze" aria-hidden="true">
      <span />
      <span />
    </div>
  );
}
