import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "CivilOS Galaxy — Explore the Ecosystem",
  description:
    "An interactive digital universe showcasing the CivilOS ecosystem — civil engineering tools, community apps, and more.",
  keywords: ["CivilOS", "civil engineering", "Bangladesh", "portfolio", "BNBC 2020"],
  openGraph: {
    title: "CivilOS Galaxy",
    description: "Explore the ecosystem. Discover worlds. Enter projects.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-hidden">
      <body className={`${spaceMono.variable} font-space bg-[#00000f] text-white overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
