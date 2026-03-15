export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  height: string;
  mobileHeight: string;
  layer: 1 | 2 | 3 | 4;
}

export const galleryImages: GalleryImage[] = [
  {
    src: "/images/gallery/moments-10.jpg",
    alt: "Producing in the studio",
    caption: "Not genres — feelings.",
    height: "466px",
    mobileHeight: "350px",
    layer: 4,
  },
  {
    src: "/images/gallery/moments-2.jpg",
    alt: "Kayaking at sunset",
    height: "520px",
    mobileHeight: "380px",
    layer: 3,
  },
  {
    src: "/images/gallery/moments-4.jpg",
    alt: "DJing in Amsterdam",
    caption: "Amsterdam gig.",
    height: "376px",
    mobileHeight: "300px",
    layer: 2,
  },
  {
    src: "/images/gallery/moments-3.jpg",
    alt: "Summit hike with friends",
    height: "522px",
    mobileHeight: "380px",
    layer: 2,
  },
  {
    src: "/images/gallery/moments-9.jpg",
    alt: "Together with family",
    caption: "Family is everything.",
    height: "520px",
    mobileHeight: "380px",
    layer: 4,
  },
  {
    src: "/images/gallery/moments-8.jpg",
    alt: "Cycling at sunset",
    height: "424px",
    mobileHeight: "320px",
    layer: 2,
  },
  {
    src: "/images/gallery/moments-7.jpg",
    alt: "Playing live at Moldejazz",
    caption: "Moldejazz gig.",
    height: "552px",
    mobileHeight: "380px",
    layer: 1,
  },
];
