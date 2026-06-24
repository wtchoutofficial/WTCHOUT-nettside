export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export const socials: SocialLink[] = [
  {
    name: "Spotify",
    url: "https://open.spotify.com/artist/6DeWCj9W2OMshT5sdCJnqa",
    icon: "spotify",
  },
  {
    name: "Apple Music",
    url: "https://music.apple.com/no/artist/wtchout/1474091682",
    icon: "apple",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/wtchoutmusic",
    icon: "instagram",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/wtchoutofficial",
    icon: "facebook",
  },
];

export const contactEmail = "wtchoutmusic@gmail.com";

export interface LinkItem {
  name: string;
  url: string;
  icon: string;
  /** Short handle/subtitle shown under the platform name, e.g. "@wtchoutmusic". */
  handle?: string;
}

export interface LinkGroup {
  title: string;
  /** Which side of the DUSK/DAWN gradient this group lives in on the bio page. */
  mood: "dusk" | "dawn" | "neutral";
  items: LinkItem[];
}

export const linkGroups: LinkGroup[] = [
  {
    title: "Listen",
    mood: "dusk",
    items: [
      {
        name: "Spotify",
        url: "https://open.spotify.com/artist/6DeWCj9W2OMshT5sdCJnqa",
        icon: "spotify",
        handle: "WTCHOUT",
      },
      {
        name: "Apple Music",
        url: "https://music.apple.com/no/artist/wtchout/1474091682",
        icon: "apple",
        handle: "WTCHOUT",
      },
      {
        name: "SoundCloud",
        url: "https://soundcloud.com/wtchoutofficial",
        icon: "soundcloud",
        handle: "@wtchoutofficial",
      },
      {
        name: "Beatport",
        url: "https://www.beatport.com/artist/wtchout/819182",
        icon: "beatport",
        handle: "DJ charts & downloads",
      },
    ],
  },
  {
    title: "Follow",
    mood: "dawn",
    items: [
      {
        name: "Instagram",
        url: "https://www.instagram.com/wtchoutmusic",
        icon: "instagram",
        handle: "@wtchoutmusic",
      },
      {
        name: "TikTok",
        url: "https://www.tiktok.com/@wtchoutmusic",
        icon: "tiktok",
        handle: "@wtchoutmusic",
      },
      {
        name: "YouTube",
        url: "https://www.youtube.com/@wtchoutmusic",
        icon: "youtube",
        handle: "@wtchoutmusic",
      },
      {
        name: "Facebook",
        url: "https://www.facebook.com/wtchoutofficial",
        icon: "facebook",
        handle: "wtchoutofficial",
      },
    ],
  },
  {
    title: "Contact",
    mood: "neutral",
    items: [
      {
        name: "Booking",
        url: "/#booking",
        icon: "mail",
        handle: "Live & events",
      },
      {
        name: "Email",
        url: "mailto:wtchoutmusic@gmail.com",
        icon: "mail",
        handle: "wtchoutmusic@gmail.com",
      },
    ],
  },
];
