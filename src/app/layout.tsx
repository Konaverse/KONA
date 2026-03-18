import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Rubik_Glitch } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import HeroNav from "@/components/layout/HeroNav";
import Footer from "@/components/layout/footer";
import FluidWrapper from "@/components/fluid/fluid-wrapper";
import { JsonLd, organizationJsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rubikGlitch = Rubik_Glitch({
  variable: "--font-rubik-glitch",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const monumentExtended = localFont({
  src: [
    {
      path: "../../public/fonts/MonumentExtended-FreeForPersonalUse/MonumentExtended-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/MonumentExtended-FreeForPersonalUse/MonumentExtended-Ultrabold.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-monument",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Kona-verse | Web Design & Digital Marketing Agency in Europe",
    template: "%s | Kona-verse",
  },
  description: siteConfig.description,
  keywords: [
    "web design",
    "web development",
    "digital marketing",
    "social media management",
    "digital advertising",
    "web applications",
    "SaaS development",
    "UI/UX design",
    "SEO services",
    "Europe",
    "branding",
    "conversion optimization",
  ],
  authors: [{ name: siteConfig.creator, url: siteConfig.url }],
  creator: siteConfig.creator,
  publisher: siteConfig.creator,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Kona-verse | Web Design & Digital Marketing Agency in Europe",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Kona-verse — Building Websites That Print Money",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kona-verse | Web Design & Digital Marketing Agency in Europe",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  verification: {
    // Replace with actual verification codes after setting up Search Console
    google: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${monumentExtended.variable} ${rubikGlitch.variable} antialiased bg-[#111111] flex flex-col min-h-screen`}
      >
        <JsonLd data={organizationJsonLd()} />
        <HeroNav />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
