import HeroSection from "@/components/home/HeroSection";
import MusicSection from "@/components/home/MusicSection";
import ComingSection from "@/components/home/ComingSection";
import AboutSection from "@/components/home/AboutSection";
import GallerySection from "@/components/home/GallerySection";
import TourSection from "@/components/home/TourSection";
import BookingSection from "@/components/home/BookingSection";
import Marquee from "@/components/layout/Marquee";
import SideRails from "@/components/layout/SideRails";
import SectionHaze from "@/components/ui/SectionHaze";

export default function Home() {
  return (
    <>
      <SideRails />
      <HeroSection />
      <SectionHaze />
      <Marquee
        items={["ELSK", "VETLE", "RIGHT HERE", "MWAKI", "THAT FEELING", "MUSIC IS MY GOD"]}
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
