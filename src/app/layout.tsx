import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { getSettings } from "@/lib/data";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: s.seoTitle, template: `%s | ${s.siteName}` },
    description: s.seoDescription,
    openGraph: {
      type: "website",
      siteName: s.siteName,
      title: s.seoTitle,
      description: s.seoDescription,
      images: s.ogImage ? [{ url: s.ogImage, width: 1200, height: 630, alt: s.siteName }] : undefined,
    },
    twitter: { card: "summary_large_image", title: s.seoTitle, description: s.seoDescription },
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = { themeColor: "#07111D", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
