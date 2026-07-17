import { releases } from "@/data/releases";
import type { CatalogItem } from "@/types/music";
import { getSpotifyCatalog } from "./spotify";
import { getSoundCloudCatalog } from "./soundcloud";

export type CatalogDegradation = "none" | "spotify" | "soundcloud" | "all";

/** Normalize for cross-platform title matching. */
export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/^\s*wtchout\s*[-–—]\s*/, "")
    .replace(/\((original mix|extended mix|radio edit)\)/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/**
 * One chronological list: SoundCloud tracks matching a Spotify release by
 * normalized title merge into it (source "both"); the rest stand alone.
 */
export function mergeCatalog(
  spotify: CatalogItem[],
  soundcloud: CatalogItem[],
): CatalogItem[] {
  const merged = spotify.map((item) => ({ ...item }));
  const byTitle = new Map(merged.map((item) => [normalizeTitle(item.title), item]));

  for (const scItem of soundcloud) {
    const match = byTitle.get(normalizeTitle(scItem.title));
    if (match) {
      match.soundcloudUrl = scItem.soundcloudUrl;
      match.source = "both";
    } else {
      merged.push(scItem);
    }
  }

  return merged.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
}

/** "m:ss" → milliseconds. */
function parseDuration(duration: string): number | undefined {
  const parts = duration.split(":").map(Number);
  if (parts.some(Number.isNaN)) return undefined;
  return parts.reduce((total, part) => total * 60 + part, 0) * 1000;
}

/** Map the hardcoded releases so the page still works if both sources fail. */
export function fallbackCatalog(): CatalogItem[] {
  return releases.map((r) => ({
    id: `fb:${r.slug}`,
    title: r.title,
    type: r.type,
    releaseDate: r.releaseDate,
    coverImage: r.coverImage,
    durationMs:
      r.type === "single" && r.tracks[0]
        ? parseDuration(r.tracks[0].duration)
        : undefined,
    trackCount: r.tracks.length,
    spotifyUrl: r.spotifyUrl,
    source: "fallback" as const,
    description: r.description,
  }));
}

export async function getCatalog(): Promise<{
  items: CatalogItem[];
  degraded: CatalogDegradation;
}> {
  const [spotify, soundcloud] = await Promise.allSettled([
    getSpotifyCatalog(),
    getSoundCloudCatalog(),
  ]);

  if (spotify.status === "rejected") {
    console.warn("Spotify catalog unavailable:", spotify.reason);
  }
  if (soundcloud.status === "rejected") {
    console.warn("SoundCloud catalog unavailable:", soundcloud.reason);
  }

  if (spotify.status === "rejected" && soundcloud.status === "rejected") {
    return { items: fallbackCatalog(), degraded: "all" };
  }

  const items = mergeCatalog(
    spotify.status === "fulfilled" ? spotify.value : [],
    soundcloud.status === "fulfilled" ? soundcloud.value : [],
  );

  const degraded: CatalogDegradation =
    spotify.status === "rejected"
      ? "spotify"
      : soundcloud.status === "rejected"
        ? "soundcloud"
        : "none";

  return { items, degraded };
}
