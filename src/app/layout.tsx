import type { Metadata, Viewport } from "next";
import {
  Anton,
  Bricolage_Grotesque,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "WTCHOUT — Sound beyond boundaries",
    template: "%s | WTCHOUT",
  },
  description:
    "WTCHOUT — Norwegian DJ/producer Oscar André Naas. Two sides, one sound: Dusk & Dawn. Sound beyond boundaries.",
  keywords: ["WTCHOUT", "music", "artist", "electronic", "DJ", "producer", "Norway"],
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    images: ["/images/branding/w-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = `${anton.variable} ${bricolage.variable} ${instrumentSerif.variable} ${jetbrains.variable}`;

  return (
    <html lang="en" className={fontVars}>
      <body className="antialiased">
        <CustomCursor />
        <RevealOnScroll />
        <div className="grain" aria-hidden="true" />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
