import HeroSection from "@/components/home/HeroSection";
import MusicSection from "@/components/home/MusicSection";
import ComingSection from "@/components/home/ComingSection";
import AboutSection from "@/components/home/AboutSection";
import GallerySection from "@/components/home/GallerySection";
import TourSection from "@/components/home/TourSection";
import BookingSection from "@/components/home/BookingSection";
import Marquee from "@/components/layout/Marquee";
import SectionHaze from "@/components/ui/SectionHaze";

// Re-render daily so the time-based "New release" tag expires without a redeploy.
export const revalidate = 86400;

export default function Home() {
  return (
    <>
      <HeroSection />
      <SectionHaze />
      <Marquee
        items={Array(6).fill("DO IT — OUT NOW")}
      />
      <MusicSection />
      <SectionHaze />
      <ComingSection />
      <Marquee
        items={["BOOK NOW", "BOOK NOW", "BOOK NOW", "BOOK NOW", "BOOK NOW", "BOOK NOW"]}
        reverse
        muted
        star="✦"
      />
      <AboutSection />
      <SectionHaze />
      <GallerySection />
      <TourSection />
      <BookingSection />
    </>
  );
}
