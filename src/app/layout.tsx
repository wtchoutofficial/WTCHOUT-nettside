import type { Metadata, Viewport } from "next";
import {
  Anton,
  Archivo,
  Bricolage_Grotesque,
  Instrument_Serif,
  JetBrains_Mono,
  Space_Mono,
} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import Preloader from "@/components/ui/Preloader";
import { MoodProvider } from "@/context/MoodContext";

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

// Hero (design handoff): Archivo for the wordmark/UI, Space Mono for labels.
const archivo = Archivo({
  weight: ["400", "500", "600", "800", "900"],
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "WTCHOUT — Norwegian house & rave",
    template: "%s | WTCHOUT",
  },
  description:
    "WTCHOUT — Norwegian house & rave producer Oscar André Naas. Two moods, one world: DUSK & DAWN.",
  keywords: ["WTCHOUT", "music", "artist", "electronic", "DJ", "producer", "Norway"],
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "WTCHOUT — Norwegian house & rave",
    description:
      "WTCHOUT — Norwegian house & rave producer Oscar André Naas. Two moods, one world: DUSK & DAWN.",
    images: ["/images/branding/w-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = `${anton.variable} ${bricolage.variable} ${instrumentSerif.variable} ${jetbrains.variable} ${archivo.variable} ${spaceMono.variable}`;

  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('wtchout-theme');document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:'dark';}catch(e){document.documentElement.dataset.theme='dark';}})();",
          }}
        />
        <link
          rel="preload"
          as="image"
          href="/images/hero/hero-portrait.jpg"
          fetchPriority="high"
        />
      </head>
      <body className="antialiased">
        <MoodProvider>
          <Preloader />
          <CustomCursor />
          <RevealOnScroll />
          <div className="grain" aria-hidden="true" />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </MoodProvider>
      </body>
    </html>
  );
}
