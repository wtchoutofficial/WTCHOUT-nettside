import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { releases } from "@/data/releases";
import { formatDate } from "@/lib/utils";
import { SpotifyEmbed } from "@/components/music/SpotifyEmbed";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const typeBadgeLabel: Record<string, string> = {
  single: "Single",
  ep: "EP",
  album: "Album",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return releases.map((release) => ({ slug: release.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const release = releases.find((r) => r.slug === slug);

  if (!release) {
    return { title: "Release not found | WTCHOUT" };
  }

  return {
    title: `${release.title} | WTCHOUT`,
    description:
      release.description ??
      `${typeBadgeLabel[release.type]} by WTCHOUT — ${release.title}`,
  };
}

export default async function ReleasePage({ params }: PageProps) {
  const { slug } = await params;
  const release = releases.find((r) => r.slug === slug);

  if (!release) {
    notFound();
  }

  return (
    <main
      className="min-h-screen px-6 py-24 sm:px-12 lg:px-24"
      style={{ backgroundColor: "#1a1410" }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Back link */}
        <RevealOnScroll>
          <Link
            href="/#music"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#ff6b2c]"
            style={{ color: "#b8a690" }}
          >
            <span aria-hidden="true">&larr;</span> Back to music
          </Link>
        </RevealOnScroll>

        {/* Hero: cover + info */}
        <RevealOnScroll>
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            {/* Cover image */}
            <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl lg:w-[420px]">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, #2a2118 0%, #1a1410 50%, #ff6b2c20 100%)",
                }}
              />
              <Image
                src={release.coverImage}
                alt={release.title}
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
                priority
              />
            </div>

            {/* Release info */}
            <div className="flex flex-col justify-center">
              <span
                className="mb-3 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                style={{ backgroundColor: "#ff6b2c", color: "#1a1410" }}
              >
                {typeBadgeLabel[release.type]}
              </span>

              <h1
                className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
                style={{ color: "#f5efe6" }}
              >
                {release.title}
              </h1>

              <p className="mb-6 text-sm" style={{ color: "#b8a690" }}>
                {formatDate(release.releaseDate)}
              </p>

              {release.description && (
                <p
                  className="mb-8 max-w-lg text-base leading-relaxed"
                  style={{ color: "#d4a574" }}
                >
                  {release.description}
                </p>
              )}

              {/* Streaming links */}
              <div className="flex flex-wrap gap-3">
                {release.spotifyUrl && (
                  <a
                    href={release.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "#1DB954", color: "#fff" }}
                  >
                    Spotify
                  </a>
                )}
                {release.appleMusicUrl && (
                  <a
                    href={release.appleMusicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "#fc3c44", color: "#fff" }}
                  >
                    Apple Music
                  </a>
                )}
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Track listing */}
        <RevealOnScroll>
          <section className="mt-16">
            <h2
              className="mb-6 text-xl font-bold"
              style={{ color: "#f5efe6" }}
            >
              Tracks
            </h2>

            <div
              className="overflow-hidden rounded-xl"
              style={{ backgroundColor: "#2a2118" }}
            >
              {release.tracks.map((track, index) => (
                <div
                  key={track.title}
                  className="flex items-center justify-between border-b px-5 py-4 last:border-b-0"
                  style={{ borderColor: "#1a141080" }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="w-6 text-right text-sm tabular-nums"
                      style={{ color: "#b8a690" }}
                    >
                      {index + 1}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#f5efe6" }}
                    >
                      {track.title}
                    </span>
                  </div>
                  <span
                    className="text-sm tabular-nums"
                    style={{ color: "#b8a690" }}
                  >
                    {track.duration}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </RevealOnScroll>

        {/* Spotify embed */}
        {release.spotifyUrl && (
          <RevealOnScroll>
            <section className="mt-16">
              <h2
                className="mb-6 text-xl font-bold"
                style={{ color: "#f5efe6" }}
              >
                Listen
              </h2>
              <SpotifyEmbed spotifyUrl={release.spotifyUrl} />
            </section>
          </RevealOnScroll>
        )}
      </div>
    </main>
  );
}
