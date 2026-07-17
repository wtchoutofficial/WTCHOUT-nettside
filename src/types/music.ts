export interface Track {
  title: string;
  duration: string;
  spotifyUrl?: string;
}

/** Where a catalog item was sourced from; "both" = matched on Spotify and SoundCloud. */
export type CatalogSource = "spotify" | "soundcloud" | "both" | "fallback";

export interface CatalogItem {
  /** "sp:<albumId>" | "sc:<trackId>" | "fb:<slug>" */
  id: string;
  title: string;
  type: "single" | "ep" | "album";
  /** ISO yyyy-mm-dd */
  releaseDate: string;
  coverImage: string;
  /** Set for singles; EPs/albums show trackCount instead. */
  durationMs?: number;
  trackCount: number;
  spotifyUrl?: string;
  soundcloudUrl?: string;
  source: CatalogSource;
  /** e.g. "feat. Berlux" */
  description?: string;
}

export interface Release {
  slug: string;
  title: string;
  type: "single" | "ep" | "album";
  releaseDate: string;
  coverImage: string;
  tracks: Track[];
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeMusicUrl?: string;
  tidalUrl?: string;
  description?: string;
  featured?: boolean;
}
