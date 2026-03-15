interface SpotifyEmbedProps {
  spotifyUrl: string;
}

function toEmbedUrl(url: string): string {
  // Convert https://open.spotify.com/track/xxx or /album/xxx to embed format
  return url.replace("open.spotify.com", "open.spotify.com/embed");
}

export function SpotifyEmbed({ spotifyUrl }: SpotifyEmbedProps) {
  return (
    <div
      className="overflow-hidden rounded-xl p-1"
      style={{ backgroundColor: "#2a2118" }}
    >
      <iframe
        src={toEmbedUrl(spotifyUrl)}
        width="100%"
        height="352"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-lg"
        style={{ border: "none" }}
        title="Spotify embed"
      />
    </div>
  );
}

export default SpotifyEmbed;
