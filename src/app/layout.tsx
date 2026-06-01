import type { Metadata } from "next";
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-great-vibes" });

export const metadata: Metadata = {
  title: "Undangan Pernikahan | Rama & Shinta",
  description: "Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami. Buka tautan ini untuk melihat detail acara.",
  openGraph: {
    title: "Undangan Pernikahan | Rama & Shinta",
    description: "Kami mengundang Anda untuk hadir dalam hari bahagia kami. Ketuk untuk membuka undangan.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} font-sans antialiased bg-[#F3F4F1] text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
