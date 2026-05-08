import HeroSection from "@/components/home/HeroSection";
import MusicSection from "@/components/home/MusicSection";
import ComingSection from "@/components/home/ComingSection";
import AboutSection from "@/components/home/AboutSection";
import GallerySection from "@/components/home/GallerySection";
import TourSection from "@/components/home/TourSection";
import BookingSection from "@/components/home/BookingSection";
import Marquee from "@/components/layout/Marquee";
import SideRails from "@/components/layout/SideRails";

export default function Home() {
  return (
    <>
      <SideRails />
      <HeroSection />
      <Marquee
        items={["ELSK", "VETLE", "RIGHT HERE", "MWAKI", "THAT FEELING", "MUSIC IS MY GOD"]}
      />
      <MusicSection />
      <ComingSection />
      <Marquee
        items={["BOOK NOW", "BOOK NOW", "BOOK NOW", "BOOK NOW", "BOOK NOW", "BOOK NOW"]}
        reverse
        muted
        star="✦"
      />
      <AboutSection />
      <GallerySection />
      <TourSection />
      <BookingSection />
    </>
  );
}
