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
    url: "https://www.instagram.com/wtchout.no",
    icon: "instagram",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/wtchoutofficial",
    icon: "facebook",
  },
];

export const contactEmail = "wtchoutofficial@gmail.com";

export interface LinkItem {
  name: string;
  url: string;
  icon: string;
  description?: string;
}

export interface LinkGroup {
  title: string;
  items: LinkItem[];
}

export const linkGroups: LinkGroup[] = [
  {
    title: "Music",
    items: [
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
        name: "SoundCloud",
        url: "https://soundcloud.com/wtchout",
        icon: "soundcloud",
      },
      {
        name: "YouTube Music",
        url: "https://music.youtube.com/channel/PLACEHOLDER",
        icon: "youtube",
      },
      {
        name: "Tidal",
        url: "https://tidal.com/artist/PLACEHOLDER",
        icon: "tidal",
      },
    ],
  },
  {
    title: "Social Media",
    items: [
      {
        name: "Instagram",
        url: "https://www.instagram.com/wtchout.no",
        icon: "instagram",
      },
      {
        name: "Facebook",
        url: "https://www.facebook.com/wtchoutofficial",
        icon: "facebook",
      },
      {
        name: "TikTok",
        url: "https://www.tiktok.com/@wtchout",
        icon: "tiktok",
      },
      {
        name: "YouTube",
        url: "https://www.youtube.com/@wtchout",
        icon: "youtube",
      },
    ],
  },
  {
    title: "Contact",
    items: [
      { name: "Booking", url: "/#booking", icon: "mail" },
      { name: "Email", url: "mailto:wtchoutofficial@gmail.com", icon: "mail" },
    ],
  },
];
