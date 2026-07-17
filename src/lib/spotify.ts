import { z } from "zod";
import type { CatalogItem } from "@/types/music";

const ARTIST_ID = "6DeWCj9W2OMshT5sdCJnqa";
const ARTIST_NAME = "WTCHOUT";
const REVALIDATE_SECONDS = 3600;

const tokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
});

const albumsPageSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      album_type: z.enum(["album", "single", "compilation"]),
      release_date: z.string(),
      total_tracks: z.number(),
      images: z.array(z.object({ url: z.string() })),
      external_urls: z.object({ spotify: z.string() }),
    }),
  ),
  next: z.string().nullable(),
});

const albumsBatchSchema = z.object({
  albums: z.array(
    z.object({
      id: z.string(),
      tracks: z.object({
        items: z.array(
          z.object({
            name: z.string(),
            duration_ms: z.number(),
            artists: z.array(z.object({ name: z.string() })),
          }),
        ),
      }),
    }),
  ),
});

async function getSpotifyToken(): Promise<string> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error(
      "Spotify credentials missing — set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET",
    );
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Spotify token request failed (${res.status})`);

  const parsed = tokenSchema.safeParse(await res.json());
  if (!parsed.success) throw new Error("Spotify token response malformed");
  return parsed.data.access_token;
}

/** Pad release dates with year/month precision to full ISO dates. */
function toIsoDate(releaseDate: string): string {
  const parts = releaseDate.split("-");
  while (parts.length < 3) parts.push("01");
  return parts.join("-");
}

export async function getSpotifyCatalog(): Promise<CatalogItem[]> {
  const token = await getSpotifyToken();
  const headers = { Authorization: `Bearer ${token}` };

  type Album = z.infer<typeof albumsPageSchema>["items"][number];
  const albums: Album[] = [];
  let url: string | null =
    `https://api.spotify.com/v1/artists/${ARTIST_ID}/albums?include_groups=album,single&market=NO&limit=50`;
  while (url) {
    const res = await fetch(url, {
      headers,
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`Spotify albums request failed (${res.status})`);
    const parsed = albumsPageSchema.safeParse(await res.json());
    if (!parsed.success) throw new Error("Spotify albums response malformed");
    albums.push(...parsed.data.items);
    url = parsed.data.next;
  }

  // Batch-fetch full albums for track durations and featured artists.
  const detailById = new Map<
    string,
    z.infer<typeof albumsBatchSchema>["albums"][number]
  >();
  for (let i = 0; i < albums.length; i += 20) {
    const ids = albums
      .slice(i, i + 20)
      .map((a) => a.id)
      .join(",");
    const res = await fetch(
      `https://api.spotify.com/v1/albums?ids=${ids}&market=NO`,
      { headers, next: { revalidate: REVALIDATE_SECONDS } },
    );
    if (!res.ok) throw new Error(`Spotify album batch failed (${res.status})`);
    const parsed = albumsBatchSchema.safeParse(await res.json());
    if (!parsed.success) throw new Error("Spotify album batch malformed");
    for (const album of parsed.data.albums) detailById.set(album.id, album);
  }

  return albums.map((a) => {
    const detail = detailById.get(a.id);
    const tracks = detail?.tracks.items ?? [];
    const featured = [
      ...new Set(
        tracks
          .flatMap((t) => t.artists.map((artist) => artist.name))
          .filter((name) => name.toLowerCase() !== ARTIST_NAME.toLowerCase()),
      ),
    ];

    const type =
      a.album_type === "album"
        ? "album"
        : a.total_tracks >= 3
          ? "ep"
          : "single";

    return {
      id: `sp:${a.id}`,
      title: a.name,
      type,
      releaseDate: toIsoDate(a.release_date),
      coverImage: a.images[0]?.url ?? "",
      durationMs:
        type === "single" && tracks[0] ? tracks[0].duration_ms : undefined,
      trackCount: a.total_tracks,
      spotifyUrl: a.external_urls.spotify,
      source: "spotify",
      description: featured.length ? `feat. ${featured.join(", ")}` : undefined,
    } satisfies CatalogItem;
  });
}
