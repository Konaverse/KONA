import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono, Unbounded, Inter, Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-display-serif",
  display: "swap",
});

const geistSans = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-geist-mono",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-monument",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Konaverse — Premium Digital Agency",
  description:
    "Konaverse is a premium digital agency crafting web experiences, films, and brand presence that refuses to be ignored.",
  openGraph: {
    title: "Konaverse — Premium Digital Agency",
    description:
      "Web development, web applications, videography, digital advertising, social media — built with intent.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable} ${unbounded.variable} ${inter.variable} ${cormorant.variable} ${jakartaSans.variable}`}
    >
      <body className="bg-[var(--color-black)] text-[var(--color-text-primary-dark)] antialiased">
        <SmoothScrollProvider>
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
