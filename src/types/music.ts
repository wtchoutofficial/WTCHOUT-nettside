export interface Track {
  title: string;
  duration: string;
  spotifyUrl?: string;
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
