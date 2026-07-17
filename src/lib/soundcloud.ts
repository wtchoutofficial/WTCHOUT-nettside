import { XMLParser } from "fast-xml-parser";
import type { CatalogItem } from "@/types/music";

// Resolved once via https://soundcloud.com/oembed for soundcloud.com/wtchoutmusic.
const SOUNDCLOUD_USER_ID = "48349110";
const FEED_URL = `https://feeds.soundcloud.com/users/soundcloud:users:${SOUNDCLOUD_USER_ID}/sounds.rss`;
const REVALIDATE_SECONDS = 3600;
const MAX_PAGES = 5;

interface RssItem {
  title?: string;
  link?: string;
  guid?: { "#text"?: string } | string;
  pubDate?: string;
  "itunes:duration"?: string;
  "itunes:image"?: { "@_href"?: string };
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

/** "hh:mm:ss" or "mm:ss" → milliseconds. */
function durationToMs(duration: string | undefined): number | undefined {
  if (!duration) return undefined;
  const parts = duration.split(":").map(Number);
  if (parts.some(Number.isNaN)) return undefined;
  return parts.reduce((total, part) => total * 60 + part, 0) * 1000;
}

/** Feed titles look like "WTCHOUT - Right here" — drop the artist prefix. */
export function stripArtistPrefix(title: string): string {
  return title.replace(/^\s*wtchout\s*[-–—]\s*/i, "").trim() || title.trim();
}

export async function getSoundCloudCatalog(): Promise<CatalogItem[]> {
  const parser = new XMLParser({ ignoreAttributes: false });
  const items: CatalogItem[] = [];

  let url: string | null = FEED_URL;
  for (let page = 0; page < MAX_PAGES && url; page++) {
    const res: Response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`SoundCloud feed request failed (${res.status})`);
    const xml = parser.parse(await res.text());

    const channel = xml?.rss?.channel;
    if (!channel) throw new Error("SoundCloud feed malformed");

    const rssItems = asArray<RssItem>(channel.item);
    if (!rssItems.length) break;

    for (const item of rssItems) {
      const rawTitle = String(item.title ?? "").trim();
      const link = String(item.link ?? "");
      if (!rawTitle || !link) continue;

      const guid =
        typeof item.guid === "string" ? item.guid : (item.guid?.["#text"] ?? link);
      const trackId = String(guid).split("/").pop() ?? link;

      const pubDate = item.pubDate ? new Date(item.pubDate) : null;
      const releaseDate =
        pubDate && !Number.isNaN(pubDate.getTime())
          ? pubDate.toISOString().slice(0, 10)
          : "1970-01-01";

      const artwork = (item["itunes:image"]?.["@_href"] ?? "").replace(
        "-t3000x3000",
        "-t500x500",
      );

      items.push({
        id: `sc:${trackId}`,
        title: stripArtistPrefix(rawTitle),
        type: "single",
        releaseDate,
        coverImage: artwork,
        durationMs: durationToMs(item["itunes:duration"]),
        trackCount: 1,
        soundcloudUrl: link,
        source: "soundcloud",
      });
    }

    const nextLink = asArray<{ "@_rel"?: string; "@_href"?: string }>(
      channel["atom:link"],
    ).find((l) => l["@_rel"] === "next");
    url = nextLink?.["@_href"] ?? null;
  }

  return items;
}
