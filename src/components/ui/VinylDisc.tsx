// Pure-CSS vinyl disc that tucks behind a release cover and slides out +
// spins on row hover. Server-renderable — all visuals/animation live in
// globals.css (.vinyl-disc), hidden on mobile and under reduced motion.
export default function VinylDisc() {
  return (
    <span className="vinyl-disc" aria-hidden="true">
      <span className="vinyl-disc__face" />
    </span>
  );
}
